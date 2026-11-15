#!/usr/bin/env python3
"""free-model-aggregator-01 entry: a free AI model aggregator proxy.

Serves OpenAI Chat Completions and Anthropic Messages APIs, routing each
client request to the highest-rated free model that can serve it across ten
simulated providers. Fails over on provider refusal, spreads calls under
per-trial budgets, and registers its discovered catalog with the env.

Runs as `python3 main.py` from the repository root under Python 3.13's
standard library alone. Reads the brief from $MAKEFUN_PROMPT_FILE and the
env base URL from $MAKEFUN_ENV_URL.

Usage:
  python3 main.py           # run the server
  python3 main.py --list    # print catalog JSON and exit 0
"""

import json
import os
import sys
import time
import socket
import http.server
import socketserver
import threading
import urllib.request
import urllib.error
import urllib.parse

ENV_URL = os.environ.get("MAKEFUN_ENV_URL", "").rstrip("/")
PROMPT_FILE = os.environ.get("MAKEFUN_PROMPT_FILE", "")
TRIAL_SEED = os.environ.get("MAKEFUN_TRIAL_SEED", "0")

POLL_INTERVAL_MS = 100
PROBE_TIMEOUT_SEC = 8
MAX_BODY_BYTES = 32 * 1024 * 1024

PROTOCOL_VERSION = 1


class BriefError(Exception):
    pass


def read_brief(path: str) -> dict:
    if not path:
        raise BriefError("MAKEFUN_PROMPT_FILE not set")
    try:
        with open(path, "r", encoding="utf-8") as fh:
            data = json.load(fh)
    except FileNotFoundError:
        raise BriefError(f"prompt file not found: {path}")
    except json.JSONDecodeError as exc:
        raise BriefError(f"prompt file is not JSON: {exc}")
    if "directory" not in data or "ratings" not in data or "manifest" not in data:
        raise BriefError("prompt file missing directory/ratings/manifest")
    return data


class ProbedModel:
    def __init__(self, model_id: str, free: bool, context_length: int):
        self.id = model_id
        self.free = free
        self.context_length = context_length


class Probe:
    def __init__(self, provider_id: str, ok: bool, models: list, error: str | None = None):
        self.provider_id = provider_id
        self.ok = ok
        self.models = models
        self.error = error


def fetch_json(url: str, method: str = "GET", body: bytes | None = None,
               headers: dict | None = None, timeout: int = 8) -> tuple:
    req_headers = {"User-Agent": "free-model-aggregator/1.0"}
    if headers:
        req_headers.update(headers)
    req = urllib.request.Request(url, data=body, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read()
            try:
                parsed = json.loads(raw.decode("utf-8")) if raw else None
            except json.JSONDecodeError:
                parsed = None
            return resp.status, parsed, raw
    except urllib.error.HTTPError as exc:
        raw = exc.read() or b""
        try:
            parsed = json.loads(raw.decode("utf-8")) if raw else None
        except json.JSONDecodeError:
            parsed = None
        return exc.code, parsed, raw
    except Exception:
        return 0, None, None


def probe_provider(env_url: str, provider: dict) -> Probe:
    pid = provider["id"]
    path = provider.get("path", f"/p/{pid}")
    wire = provider.get("wire", "openai")
    models_path = "/v1beta/models" if wire == "gemini" else "/v1/models"
    url = env_url + path + models_path
    auth = provider.get("auth", "bearer")
    key = provider.get("key", "")
    hdrs = {}
    if auth == "bearer" and key:
        hdrs["Authorization"] = f"Bearer {key}"
    elif auth == "x-api-key" and key:
        hdrs["x-api-key"] = key
    elif auth == "x-goog-api-key" and key:
        hdrs["x-goog-api-key"] = key

    status, parsed, _ = fetch_json(url, headers=hdrs, timeout=PROBE_TIMEOUT_SEC)
    if status != 200 or not parsed:
        return Probe(pid, False, [], error=f"provider {pid}: HTTP {status}")

    models = []
    if isinstance(parsed, dict):
        items = parsed.get("data", parsed.get("models", []))
    elif isinstance(parsed, list):
        items = parsed
    else:
        items = []

    for item in items:
        if isinstance(item, dict):
            mid = item.get("id")
            if not mid:
                continue
            free = bool(item.get("free", True))
            ctx = int(item.get("context_length", item.get("context_window", 4096)) or 4096)
            models.append(ProbedModel(mid, free, ctx))

    return Probe(pid, True, models)


class CatalogEntry:
    def __init__(self, provider_id: str, base_url: str, key_env: str, wire: str,
                 models: list, ok: bool):
        self.provider_id = provider_id
        self.base_url = base_url
        self.key_env = key_env
        self.wire = wire
        self.models = models
        self.ok = ok


def build_catalog(env_url: str, providers: list) -> list:
    entries = []
    for provider in providers:
        pid = provider["id"]
        probe = probe_provider(env_url, provider)
        entries.append(CatalogEntry(
            provider_id=pid,
            base_url=provider.get("path", f"/p/{pid}"),
            key_env=provider.get("key_env", ""),
            wire=provider.get("wire", "openai"),
            models=probe.models,
            ok=probe.ok,
        ))
        if not probe.ok and probe.error:
            print(f"aggregator: probe {pid}: {probe.error}", file=sys.stderr)
    return entries


def free_models_by_rating(ratings: list) -> dict:
    rating_map = {}
    for r in ratings:
        if r.get("free"):
            rating_map[r["model"]] = {
                "rating_milli": int(r.get("rating_milli", 0)),
                "provider": r.get("provider"),
                "context_length": int(r.get("context_length", 0)),
                "tools": bool(r.get("tools", False)),
                "vision": bool(r.get("vision", False)),
                "json": bool(r.get("json", False)),
            }
    return rating_map


def model_meets_requires(model_rating: dict, requires: dict) -> bool:
    if not model_rating:
        return False
    if requires.get("tools") and not model_rating.get("tools"):
        return False
    if requires.get("vision") and not model_rating.get("vision"):
        return False
    if requires.get("json") and not model_rating.get("json"):
        return False
    min_ctx = requires.get("min_context")
    if min_ctx is not None and model_rating.get("context_length", 0) < int(min_ctx):
        return False
    return True


class Router:
    def __init__(self, catalog: list, ratings: list):
        self.catalog = catalog
        self.ratings = free_models_by_rating(ratings)
        self.provider_in_flight = {e.provider_id: False for e in catalog}
        self.lock = threading.Lock()

    def list_models(self) -> list:
        out = []
        for e in self.catalog:
            models = []
            for m in e.models:
                models.append({"id": m.id, "free": m.free, "context_length": m.context_length})
            out.append({
                "id": e.provider_id,
                "base_url": e.base_url,
                "key_env": e.key_env,
                "wire": e.wire,
                "models": models,
            })
        return out

    def choose_provider(self, requires: dict, exclude_providers: set) -> CatalogEntry | None:
        best = None
        best_rating = -1
        for e in self.catalog:
            if not e.ok:
                continue
            if e.provider_id in exclude_providers:
                continue
            if self.provider_in_flight.get(e.provider_id, False):
                continue
            for m in e.models:
                if not m.free:
                    continue
                rating = self.ratings.get(m.id)
                if not rating:
                    continue
                if not model_meets_requires(rating, requires):
                    continue
                if rating["rating_milli"] > best_rating:
                    best_rating = rating["rating_milli"]
                    best = e
        return best

    def acquire(self, provider_id: str) -> bool:
        with self.lock:
            if self.provider_in_flight.get(provider_id, False):
                return False
            self.provider_in_flight[provider_id] = True
            return True

    def release(self, provider_id: str, success: bool):
        with self.lock:
            self.provider_in_flight[provider_id] = False


def stop_reason_map(reason: str) -> str:
    mapping = {
        "end_turn": "stop",
        "max_tokens": "length",
        "tool_use": "tool_calls",
        "refusal": "content_filter",
        "stop": "stop",
        "length": "length",
        "tool_calls": "tool_calls",
        "content_filter": "content_filter",
    }
    return mapping.get(reason, "stop")


class AggregatorHandler(http.server.BaseHTTPRequestHandler):
    router: Router
    env_url: str

    def log_message(self, format, *args):
        sys.stderr.write(f"aggregator: {format % args}\n")

    def _read_body(self) -> bytes:
        length = int(self.headers.get("Content-Length", 0) or 0)
        if length > MAX_BODY_BYTES:
            length = MAX_BODY_BYTES
        return self.rfile.read(length)

    def _send_json(self, status: int, obj: dict):
        raw = json.dumps(obj).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def _send_raw(self, status: int, content_type: str, raw: bytes):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def _forward(self, provider: CatalogEntry, path: str, body: dict, auth_header: str | None) -> tuple:
        url = self.env_url + provider.base_url + path
        data = json.dumps(body).encode("utf-8")
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "free-model-aggregator/1.0",
        }
        if provider.wire == "gemini":
            if auth_header:
                headers["x-goog-api-key"] = auth_header
        elif provider.wire == "anthropic":
            if auth_header:
                headers["x-api-key"] = auth_header
            headers["anthropic-version"] = "2023-06-01"
        else:  # openai
            if auth_header:
                headers["Authorization"] = auth_header

        req = urllib.request.Request(url, data=data, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                raw = resp.read()
                ct = resp.headers.get("Content-Type", "application/json")
                return resp.status, raw, ct
        except urllib.error.HTTPError as exc:
            raw = exc.read() or b""
            return exc.code, raw, exc.headers.get("Content-Type", "application/json")
        except Exception as exc:
            return 502, str(exc).encode("utf-8"), "text/plain"

    def _requires_from_body(self, body: dict) -> dict:
        requires = {}
        rf = body.get("response_format")
        if isinstance(rf, dict) and rf.get("type") == "json_object":
            requires["json"] = True
        if body.get("tools"):
            requires["tools"] = True
        msgs = body.get("messages", [])
        for m in msgs:
            content = m.get("content")
            if isinstance(content, list):
                for part in content:
                    if isinstance(part, dict) and part.get("type") in ("image_url", "image"):
                        requires["vision"] = True
        return requires

    def _route(self, body: dict, path_hint: str):
        stream = bool(body.get("stream", False))
        requires = self._requires_from_body(body)
        # Determine auth header and wire preference from client headers
        auth_header = self.headers.get("Authorization") or self.headers.get("x-api-key")
        is_anthropic = bool(self.headers.get("x-api-key"))

        tried = set()
        last_status = 502
        last_body = b'{"error": "no provider available"}'
        last_ct = "application/json"

        for _attempt in range(len(self.router.catalog) + 2):
            provider = self.router.choose_provider(requires, tried)
            if provider is None:
                break
            tried.add(provider.provider_id)

            if not self.router.acquire(provider.provider_id):
                continue

            try:
                if provider.wire == "gemini":
                    upstream_path = "/v1beta/models/%s:streamGenerateContent" if stream else "/v1beta/models/%s:generateContent"
                    model = body.get("model", "gemini-pro")
                    status, raw, ct = self._forward(provider, upstream_path % model, body, auth_header)
                elif is_anthropic or provider.wire == "anthropic":
                    status, raw, ct = self._forward(provider, "/v1/messages", body, auth_header)
                else:
                    status, raw, ct = self._forward(provider, "/v1/chat/completions", body, auth_header)
            finally:
                self.router.release(provider.provider_id, success=(status < 400))

            if status < 400:
                try:
                    parsed = json.loads(raw.decode("utf-8"))
                    if "choices" in parsed:
                        for ch in parsed["choices"]:
                            if ch.get("finish_reason"):
                                ch["finish_reason"] = stop_reason_map(ch["finish_reason"])
                    if "stop_reason" in parsed and parsed.get("stop_reason"):
                        parsed["stop_reason"] = stop_reason_map(parsed["stop_reason"])
                    raw = json.dumps(parsed).encode("utf-8")
                except Exception:
                    pass
                self._send_raw(status, ct, raw)
                return

            last_status = status
            last_body = raw
            last_ct = ct

        self._send_raw(last_status, last_ct, last_body)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if path == "/v1/models":
            models_out = []
            for e in self.router.catalog:
                if not e.ok:
                    continue
                for m in e.models:
                    if not m.free:
                        continue
                    models_out.append({"id": m.id, "object": "model", "owned_by": e.provider_id})
            if self.headers.get("Authorization", "").startswith("Bearer "):
                self._send_json(200, {"object": "list", "data": models_out})
            elif self.headers.get("x-api-key"):
                self._send_json(200, {"data": [{"id": m["id"], "type": "model"} for m in models_out]})
            else:
                self._send_json(200, {"object": "list", "data": models_out})
            return
        self._send_json(404, {"error": "not found"})

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body_raw = self._read_body()
        try:
            body = json.loads(body_raw.decode("utf-8")) if body_raw else {}
        except json.JSONDecodeError:
            body = {}
        if path == "/v1/chat/completions":
            self._route(body, "openai")
        elif path == "/v1/messages":
            self._route(body, "anthropic")
        else:
            self._send_json(404, {"error": "not found"})


def register_with_env(port: int, catalog: list) -> int:
    body = json.dumps({
        "protocol_version": PROTOCOL_VERSION,
        "port": port,
        "catalog": catalog,
    }).encode("utf-8")
    req = urllib.request.Request(
        ENV_URL + "/register",
        data=body,
        headers={"Content-Type": "application/json", "User-Agent": "free-model-aggregator/1.0"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return int(data.get("requests", 0))


def poll_work() -> dict:
    status, parsed, _ = fetch_json(ENV_URL + "/work", timeout=5)
    if status != 200 or not parsed:
        return {"done": True}
    return parsed


def find_free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("0.0.0.0", 0))
        return s.getsockname()[1]


def run_server() -> int:
    brief = read_brief(PROMPT_FILE)
    providers = brief["directory"]["providers"]
    ratings = brief["ratings"]

    catalog_entries = build_catalog(ENV_URL, providers)
    router = Router(catalog_entries, ratings)

    if "--list" in sys.argv:
        print(json.dumps(router.list_models(), indent=2))
        return 0

    port = find_free_port()
    print(f"aggregator: listening on port {port}", file=sys.stderr)

    handler = AggregatorHandler
    handler.router = router
    handler.env_url = ENV_URL

    with socketserver.TCPServer(("0.0.0.0", port), handler) as httpd:
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()

        try:
            expected = register_with_env(port, router.list_models())
            print(f"aggregator: registered, expecting {expected} requests", file=sys.stderr)
        except Exception as exc:
            print(f"aggregator: register failed: {exc}", file=sys.stderr)
            httpd.shutdown()
            return 1

        while True:
            work = poll_work()
            if work.get("done"):
                break
            time.sleep(POLL_INTERVAL_MS / 1000.0)

        httpd.shutdown()
    print("aggregator: done, exiting 0", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(run_server())