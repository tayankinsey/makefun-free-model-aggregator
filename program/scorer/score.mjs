// scorer/score.mjs: built by scripts/competitions/build-agent-bundle.ts from src/scorer/main.ts with esbuild 0.28.2. Do not edit: rebuild it.
import { createRequire as __agentBundleCreateRequire } from 'node:module';
const require = __agentBundleCreateRequire(import.meta.url);

// src/scorer/main.ts
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// src/shared/protocol.ts
var CATALOG_SCHEMA = "free-model-aggregator-01/catalog/v1";
var RATINGS_SCHEMA = "free-model-aggregator-01/ratings/v1";
var STATE_SCHEMA = "free-model-aggregator-01/state/v1";
var CATALOG_FILE = "catalog.json";
var RATINGS_FILE = "ratings.json";
var STATE_FILE = "state.json";

// src/shared/providers.ts
var mod = (id, rating_milli, context_length, caps = {}) => ({
  id,
  free: true,
  context_length,
  tools: caps.tools === true,
  vision: caps.vision === true,
  json: caps.json === true,
  rating_milli
});
var paid = (id, rating_milli, context_length, caps = {}) => ({
  ...mod(id, rating_milli, context_length, caps),
  free: false
});
var PROVIDERS = [
  {
    id: "groq",
    name: "Groq",
    wire: "openai",
    auth: "bearer",
    path: "/p/groq",
    key_env: "GROQ_API_KEY",
    key: "sim-groq-0001",
    calls_min: 9,
    calls_max: 12,
    concurrency: 0,
    failure_status: 429,
    failure_code: "rate_limit_exceeded",
    second_failure_code: null,
    retry_after: true,
    models: [
      mod("llama-3.1-8b-instant", 1210, 131072, { tools: true, json: true }),
      mod("gpt-oss-120b", 1352, 131072, { tools: true, json: true }),
      mod("qwen3.8-27b", 1434, 131072, { tools: true, json: true }),
      mod("gpt-oss-20b", 1318, 131072, { tools: true })
    ]
  },
  {
    id: "cerebras",
    name: "Cerebras",
    wire: "openai",
    auth: "bearer",
    path: "/p/cerebras",
    key_env: "CEREBRAS_API_KEY",
    key: "sim-cerebras-0002",
    calls_min: 5,
    calls_max: 6,
    concurrency: 0,
    failure_status: 429,
    failure_code: "too_many_requests",
    second_failure_code: null,
    retry_after: false,
    models: [
      mod("llama-4-scout-17b", 1250, 131072, { tools: true }),
      mod("qwen-3.8-27b", 1434, 131072, { tools: true, json: true }),
      mod("gpt-oss-120b", 1352, 131072, { tools: true, json: true })
    ]
  },
  {
    id: "gemini",
    name: "Google Gemini",
    wire: "gemini",
    auth: "x-goog-api-key",
    path: "/p/gemini",
    key_env: "GEMINI_API_KEY",
    key: "sim-gemini-0003",
    calls_min: 6,
    calls_max: 8,
    concurrency: 0,
    failure_status: 429,
    failure_code: "RESOURCE_EXHAUSTED",
    second_failure_code: null,
    retry_after: false,
    models: [mod("gemini-3.8-flash", 1458, 1048576, { tools: true, vision: true, json: true }), mod("gemma-4-31b", 1452, 131072, { tools: true, vision: true }), mod("gemma-4-26b", 1410, 32768, { vision: true })]
  },
  {
    id: "zai",
    name: "Z.ai",
    wire: "anthropic",
    auth: "bearer",
    path: "/p/zai",
    key_env: "ZAI_API_KEY",
    key: "sim-zai-0004",
    calls_min: 4,
    calls_max: 5,
    concurrency: 1,
    failure_status: 429,
    failure_code: "rate_limit_error",
    second_failure_code: null,
    retry_after: false,
    models: [mod("glm-4.7-flash", 1470, 204800, { tools: true, json: true }), mod("glm-4.6v-flash", 1432, 204800, { tools: true, vision: true })]
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    wire: "openai",
    auth: "bearer",
    path: "/p/openrouter",
    key_env: "OPENROUTER_API_KEY",
    key: "sim-openrouter-0005",
    calls_min: 10,
    calls_max: 12,
    concurrency: 0,
    failure_status: 429,
    failure_code: "rate_limit_exceeded",
    second_failure_code: null,
    retry_after: true,
    models: [
      mod("z-ai/glm-5.3-flash:free", 1475, 204800, { tools: true, json: true }),
      mod("deepseek/deepseek-v4.1:free", 1462, 163840, { tools: true, json: true }),
      mod("minimax/m3:free", 1436, 196608, { tools: true, json: true }),
      paid("anthropic/claude-opus-5.5", 1520, 2e5, { tools: true, vision: true })
    ]
  },
  {
    id: "sambanova",
    name: "SambaNova",
    wire: "openai",
    auth: "bearer",
    path: "/p/sambanova",
    key_env: "SAMBANOVA_API_KEY",
    key: "sim-sambanova-0006",
    calls_min: 4,
    calls_max: 5,
    concurrency: 0,
    failure_status: 429,
    failure_code: "insufficient_quota",
    second_failure_code: "queue_full",
    retry_after: false,
    models: [mod("deepseek-v3.2", 1465, 163840, { tools: true, json: true }), mod("gemma-4-31b", 1452, 131072, { vision: true })]
  },
  {
    id: "pollinations",
    name: "Pollinations",
    wire: "openai",
    auth: "none",
    path: "/p/pollinations",
    key_env: "",
    key: "",
    calls_min: 10,
    calls_max: 14,
    concurrency: 0,
    failure_status: 402,
    failure_code: "payment_required",
    second_failure_code: null,
    retry_after: false,
    models: [mod("mistral-nemo", 1180, 32768, { tools: true }), mod("openai-fast", 1390, 32768, { tools: true })]
  },
  {
    id: "cloudflare",
    name: "Cloudflare Workers AI",
    wire: "openai",
    auth: "bearer",
    path: "/p/cloudflare",
    key_env: "CLOUDFLARE_API_TOKEN",
    key: "sim-cloudflare-0007",
    calls_min: 7,
    calls_max: 8,
    concurrency: 0,
    failure_status: 429,
    failure_code: "neurons_exhausted",
    second_failure_code: null,
    retry_after: false,
    models: [mod("glm-4.7-flash", 1470, 204800, { tools: true, json: true }), mod("llama-3.3-70b", 1330, 131072, { tools: true }), mod("nemotron-3.5-super-vl", 1414, 131072, { vision: true })]
  },
  {
    id: "ovh",
    name: "OVHcloud AI Endpoints",
    wire: "openai",
    auth: "none",
    path: "/p/ovh",
    key_env: "",
    key: "",
    calls_min: 5,
    calls_max: 6,
    concurrency: 0,
    failure_status: 429,
    failure_code: "rate_limit",
    second_failure_code: null,
    retry_after: false,
    models: [mod("qwen3.5-397b", 1440, 262144, { tools: true }), mod("llama-3.3-70b", 1330, 131072, { tools: true })]
  },
  {
    id: "kilol",
    name: "Kilo",
    wire: "openai",
    auth: "none",
    path: "/p/kilol",
    key_env: "",
    key: "",
    calls_min: 12,
    calls_max: 16,
    concurrency: 0,
    failure_status: 429,
    failure_code: "rate_limit",
    second_failure_code: null,
    retry_after: false,
    models: [mod("kilo-fast", 1140, 131072, { tools: true }), mod("kilo-auto/free", 1420, 131072, { tools: true })]
  }
];
var BY_ID = new Map(PROVIDERS.map((p) => [p.id, p]));
function providerById(id) {
  const p = BY_ID.get(id);
  if (p === void 0) throw new Error(`no provider ${id} in the sealed table (the providers are ${PROVIDERS.map((x) => x.id).join(", ")})`);
  return p;
}
function modelRow(provider, model) {
  const row = providerById(provider).models.find((m) => m.id === model);
  if (row === void 0) throw new Error(`${provider} serves no model ${model} in the sealed table`);
  return row;
}

// src/generator/workload.ts
var WORKLOAD = [
  { id: "r01", api: "openai", stream: false, weight: 2, requires: { tools: true, vision: true } },
  { id: "r02", api: "openai", stream: true, weight: 2, requires: { tools: true, vision: true } },
  { id: "r03", api: "openai", stream: false, weight: 2, requires: { tools: true } },
  { id: "r04", api: "anthropic", stream: false, weight: 2, requires: { tools: true } },
  { id: "r05", api: "anthropic", stream: true, weight: 2, requires: { tools: true } },
  { id: "r06", api: "openai", stream: true, weight: 2, requires: { vision: true } },
  { id: "r07", api: "openai", stream: false, weight: 1, requires: { json: true } },
  { id: "r08", api: "anthropic", stream: false, weight: 1, requires: { json: true } },
  { id: "r09", api: "anthropic", stream: true, weight: 1, requires: { json: true } },
  { id: "r10", api: "openai", stream: false, weight: 1, requires: { min_context: 2e5 } },
  { id: "r11", api: "openai", stream: true, weight: 1, requires: { min_context: 2e5 } },
  { id: "r12", api: "anthropic", stream: false, weight: 1, requires: { min_context: 2e5 } },
  { id: "r13", api: "openai", stream: false, weight: 1, requires: {} },
  { id: "r14", api: "openai", stream: false, weight: 1, requires: {} },
  { id: "r15", api: "openai", stream: false, weight: 1, requires: {} },
  { id: "r16", api: "anthropic", stream: false, weight: 1, requires: {} },
  { id: "r17", api: "anthropic", stream: true, weight: 1, requires: {} },
  { id: "r18", api: "openai", stream: true, weight: 1, requires: {} },
  { id: "r19", api: "openai", stream: false, weight: 1, requires: {} },
  { id: "r20", api: "anthropic", stream: true, weight: 1, requires: {} }
];
var BY_ID2 = new Map(WORKLOAD.map((r) => [r.id, r]));
function requestById(id) {
  const r = BY_ID2.get(id);
  if (r === void 0) throw new Error(`no request ${id} in the workload (the requests are ${WORKLOAD.map((x) => x.id).join(", ")})`);
  return r;
}
function weightOf(id) {
  return requestById(id).weight;
}

// src/scorer/score.ts
function jsonObject(name, text) {
  let v;
  try {
    v = JSON.parse(text);
  } catch (err) {
    throw new Error(`${name} is not JSON: ${err.message}`);
  }
  return record(name, v);
}
function record(name, v) {
  if (v === null || typeof v !== "object" || Array.isArray(v)) throw new Error(`${name} is not a JSON object`);
  return v;
}
function exactKeys(name, o, keys) {
  const got = Object.keys(o).sort();
  const want = [...keys].sort();
  if (got.join(",") !== want.join(",")) throw new Error(`${name} holds the keys ${got.join(", ")}, not ${want.join(", ")}`);
}
function int(name, v, min, max) {
  if (typeof v !== "number" || !Number.isSafeInteger(v) || v < min || v > max) throw new Error(`${name} is not an integer from ${min} to ${max}`);
  return v;
}
function str(name, v) {
  if (typeof v !== "string") throw new Error(`${name} is not a string`);
  return v;
}
function nonEmpty(name, v) {
  if (typeof v !== "string" || v === "") throw new Error(`${name} is not a non-empty string`);
  return v;
}
function bool(name, v) {
  if (typeof v !== "boolean") throw new Error(`${name} is not a boolean`);
  return v;
}
function nullable(name, v) {
  if (v === null) return null;
  if (typeof v !== "string" || v === "") throw new Error(`${name} is not a non-empty string or null`);
  return v;
}
function answerRow(provider, model) {
  try {
    return modelRow(provider, model);
  } catch (err) {
    const prefix = `${provider}/`;
    if (model.startsWith(prefix)) return modelRow(provider, model.slice(prefix.length));
    throw err;
  }
}
function list(name, v, length) {
  if (!Array.isArray(v)) throw new Error(`${name} is not an array`);
  if (length !== void 0 && v.length !== length) throw new Error(`${name} holds ${v.length} items, not ${length}`);
  return v;
}
function sameStrings(a, b) {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  if (set.size !== a.length) return false;
  return b.every((x) => set.has(x));
}
function parseRatingsFile(source) {
  const name = RATINGS_FILE;
  const o = jsonObject(name, source);
  exactKeys(name, o, ["schema", "ratings", "best"]);
  if (o.schema !== RATINGS_SCHEMA) throw new Error(`${name}: schema is not ${RATINGS_SCHEMA}`);
  const rows = list(`${name}: ratings`, o.ratings).map((v, i) => {
    const at = `${name}: ratings[${i}]`;
    const e = record(at, v);
    exactKeys(at, e, ["model", "provider", "rating_milli", "context_length", "tools", "vision", "json", "free"]);
    return {
      model: nonEmpty(`${at}.model`, e.model),
      provider: nonEmpty(`${at}.provider`, e.provider),
      rating_milli: int(`${at}.rating_milli`, e.rating_milli, 0, 2e3),
      context_length: e.context_length === null ? null : int(`${at}.context_length`, e.context_length, 1, 1e8),
      tools: bool(`${at}.tools`, e.tools),
      vision: bool(`${at}.vision`, e.vision),
      json: bool(`${at}.json`, e.json),
      free: bool(`${at}.free`, e.free)
    };
  });
  const tableKeys = PROVIDERS.flatMap((p) => p.models.map((m) => `${p.id}/${m.id}`)).sort();
  const rowKeys = rows.map((r) => `${r.provider}/${r.model}`).sort();
  if (rowKeys.length !== tableKeys.length || rowKeys.some((k, i) => k !== tableKeys[i])) throw new Error(`${name}: its rows are not the sealed table's ${tableKeys.length} models, once each`);
  for (const row of rows) {
    const m = modelRow(row.provider, row.model);
    if (row.rating_milli !== m.rating_milli || row.free !== m.free || row.tools !== m.tools || row.vision !== m.vision || row.json !== m.json || row.context_length !== m.context_length) {
      throw new Error(`${name}: ${row.provider}/${row.model} does not match the sealed table`);
    }
  }
  const best = list(`${name}: best`, o.best, WORKLOAD.length).map((v, i) => {
    const at = `${name}: best[${i}]`;
    const e = record(at, v);
    exactKeys(at, e, ["id", "rating_milli"]);
    const id = nonEmpty(`${at}.id`, e.id);
    if (id !== WORKLOAD[i].id) throw new Error(`${at}.id is ${id}, not ${WORKLOAD[i].id}`);
    return { id, rating_milli: int(`${at}.rating_milli`, e.rating_milli, 0, 2e3) };
  });
  return { schema: RATINGS_SCHEMA, ratings: rows, best };
}
function parseCatalogTruth(source) {
  const name = CATALOG_FILE;
  const o = jsonObject(name, source);
  exactKeys(name, o, ["schema", "providers"]);
  if (o.schema !== CATALOG_SCHEMA) throw new Error(`${name}: schema is not ${CATALOG_SCHEMA}`);
  const providers = list(`${name}: providers`, o.providers, PROVIDERS.length).map((v, i) => {
    const at = `${name}: providers[${i}]`;
    const e = record(at, v);
    exactKeys(at, e, ["id", "base_url", "key_env", "wire", "free_models", "paid_models"]);
    const id = nonEmpty(`${at}.id`, e.id);
    const table = PROVIDERS.find((p) => p.id === id);
    if (table === void 0) throw new Error(`${at}.id is ${id}, which the sealed table does not hold`);
    if (id !== PROVIDERS[i].id) throw new Error(`${at}.id is ${id}, not ${PROVIDERS[i].id}`);
    const free = list(`${at}.free_models`, e.free_models).map((m, k) => nonEmpty(`${at}.free_models[${k}]`, m));
    const paid2 = list(`${at}.paid_models`, e.paid_models).map((m, k) => nonEmpty(`${at}.paid_models[${k}]`, m));
    if (nonEmpty(`${at}.base_url`, e.base_url) !== table.path) throw new Error(`${at}.base_url is not the table's path ${table.path}`);
    if (str(`${at}.key_env`, e.key_env) !== table.key_env) throw new Error(`${at}.key_env is not ${table.key_env}`);
    if (e.wire !== table.wire) throw new Error(`${at}.wire is not ${table.wire}`);
    if (!sameStrings(free, table.models.filter((m) => m.free).map((m) => m.id))) throw new Error(`${at}.free_models is not the sealed table's free set`);
    if (!sameStrings(paid2, table.models.filter((m) => !m.free).map((m) => m.id))) throw new Error(`${at}.paid_models is not the sealed table's paid set`);
    return { id, base_url: table.path, key_env: table.key_env, wire: table.wire, free_models: free, paid_models: paid2 };
  });
  return { schema: CATALOG_SCHEMA, providers };
}
function readCatalog(v) {
  if (v === null || typeof v !== "object" || Array.isArray(v)) return null;
  const o = v;
  if (!Array.isArray(o.providers)) return null;
  return { providers: o.providers };
}
function readCatalogRoute(v) {
  if (v === null) return null;
  const at = `${STATE_FILE}: catalog_route`;
  const o = record(at, v);
  exactKeys(at, o, ["openai", "anthropic"]);
  return { openai: bool(`${at}.openai`, o.openai), anthropic: bool(`${at}.anthropic`, o.anthropic) };
}
function parseTrialState(source) {
  const name = STATE_FILE;
  const o = jsonObject(name, source);
  exactKeys(name, o, ["schema", "requests", "catalog", "catalog_route", "totals"]);
  if (o.schema !== STATE_SCHEMA) throw new Error(`${name}: schema is not ${STATE_SCHEMA}`);
  const requests = list(`${name}: requests`, o.requests, WORKLOAD.length).map((v, i) => {
    const at = `${name}: requests[${i}]`;
    const e = record(at, v);
    exactKeys(at, e, ["id", "delivered", "status", "valid", "provider", "model", "rating_milli", "upstream_calls", "failures", "checks", "error"]);
    const id = nonEmpty(`${at}.id`, e.id);
    if (id !== WORKLOAD[i].id) throw new Error(`${at}.id is ${id}, not ${WORKLOAD[i].id}`);
    const provider = nullable(`${at}.provider`, e.provider);
    const model = nullable(`${at}.model`, e.model);
    if (model !== null && provider === null) throw new Error(`${at} names a model with no provider`);
    const rating_milli = int(`${at}.rating_milli`, e.rating_milli, 0, 2e3);
    if (provider !== null && model !== null) {
      const row = answerRow(provider, model);
      if (rating_milli !== row.rating_milli) throw new Error(`${at}.rating_milli is ${rating_milli}, and the sealed table rates ${provider}/${row.id} at ${row.rating_milli}`);
    } else if (rating_milli !== 0) throw new Error(`${at}.rating_milli is ${rating_milli} with no model`);
    const failures = list(`${at}.failures`, e.failures).map((f, k) => {
      const at2 = `${at}.failures[${k}]`;
      const fe = record(at2, f);
      exactKeys(at2, fe, ["provider", "model", "status", "code"]);
      return { provider: nonEmpty(`${at2}.provider`, fe.provider), model: nullable(`${at2}.model`, fe.model), status: int(`${at2}.status`, fe.status, 0, 599), code: str(`${at2}.code`, fe.code) };
    });
    const checks = list(`${at}.checks`, e.checks).map((c, k) => {
      const at2 = `${at}.checks[${k}]`;
      const ce = record(at2, c);
      exactKeys(at2, ce, ["name", "pass", "detail"]);
      return { name: nonEmpty(`${at2}.name`, ce.name), pass: bool(`${at2}.pass`, ce.pass), detail: str(`${at2}.detail`, ce.detail) };
    });
    const valid = bool(`${at}.valid`, e.valid);
    if (valid && (provider === null || model === null)) throw new Error(`${at} is valid with no provider answer`);
    return {
      id,
      delivered: bool(`${at}.delivered`, e.delivered),
      status: int(`${at}.status`, e.status, 0, 599),
      valid,
      provider,
      model,
      rating_milli,
      upstream_calls: int(`${at}.upstream_calls`, e.upstream_calls, 0, 1e6),
      failures,
      checks,
      error: nullable(`${at}.error`, e.error)
    };
  });
  const t = record(`${name}: totals`, o.totals);
  exactKeys(`${name}: totals`, t, ["requests", "delivered", "valid", "upstream_calls", "checks", "checks_passed", "failover_requests", "failover_handled"]);
  const totals = {
    requests: int(`${name}: totals.requests`, t.requests, 0, WORKLOAD.length),
    delivered: int(`${name}: totals.delivered`, t.delivered, 0, WORKLOAD.length),
    valid: int(`${name}: totals.valid`, t.valid, 0, WORKLOAD.length),
    upstream_calls: int(`${name}: totals.upstream_calls`, t.upstream_calls, 0, 1e6),
    checks: int(`${name}: totals.checks`, t.checks, 0, 1e6),
    checks_passed: int(`${name}: totals.checks_passed`, t.checks_passed, 0, 1e6),
    failover_requests: int(`${name}: totals.failover_requests`, t.failover_requests, 0, WORKLOAD.length),
    failover_handled: int(`${name}: totals.failover_handled`, t.failover_handled, 0, WORKLOAD.length)
  };
  if (totals.checks_passed > totals.checks) throw new Error(`${name}: totals.checks_passed is over totals.checks`);
  if (totals.failover_handled > totals.failover_requests) throw new Error(`${name}: totals.failover_handled is over totals.failover_requests`);
  const counted = {
    requests: requests.length,
    delivered: requests.filter((r) => r.delivered).length,
    valid: requests.filter((r) => r.valid).length,
    upstream_calls: requests.reduce((n, r) => n + r.upstream_calls, 0),
    checks: requests.reduce((n, r) => n + r.checks.length, 0),
    checks_passed: requests.reduce((n, r) => n + r.checks.filter((c) => c.pass).length, 0),
    failover_requests: requests.filter((r) => r.failures.length > 0).length,
    failover_handled: requests.filter((r) => r.failures.length > 0 && r.valid).length
  };
  for (const key of Object.keys(counted)) {
    if (totals[key] !== counted[key]) throw new Error(`${name}: totals.${key} is ${totals[key]}, and the requests say ${counted[key]}`);
  }
  return { schema: STATE_SCHEMA, requests, catalog: readCatalog(o.catalog), catalog_route: readCatalogRoute(o.catalog_route), totals };
}
function catalogChecks(report, truth, route) {
  let passed = 0;
  let checks = 0;
  for (const t of truth.providers) {
    checks += 4;
    const entries = report === null ? [] : report.providers.filter((p) => p !== null && typeof p === "object" && !Array.isArray(p));
    const entry = entries.find((p) => p.id === t.id);
    if (entry === void 0) continue;
    passed += 1;
    if (typeof entry.base_url === "string" && entry.base_url.endsWith(t.base_url) && entry.key_env === t.key_env) passed += 1;
    const models = Array.isArray(entry.models) ? entry.models.filter((m) => m !== null && typeof m === "object" && !Array.isArray(m)) : null;
    const free = models === null ? null : models.filter((m) => m.free === true && typeof m.id === "string").map((m) => m.id);
    if (free !== null && sameStrings(free, t.free_models)) passed += 1;
    const paidFree = models !== null && models.some((m) => m.free === true && typeof m.id === "string" && t.paid_models.includes(m.id));
    if (!paidFree) passed += 1;
  }
  checks += 2;
  if (route !== null && route.openai) passed += 1;
  if (route !== null && route.anthropic) passed += 1;
  return { passed, checks };
}
function score(state, ratings, catalog) {
  const best = new Map(ratings.best.map((b) => [b.id, b.rating_milli]));
  let earned = 0;
  let bound = 0;
  for (const r of state.requests) {
    const weight = weightOf(r.id);
    const top = best.get(r.id);
    if (top === void 0) throw new Error(`${RATINGS_FILE}: no best rating for ${r.id}`);
    bound += weight * top;
    if (r.valid) {
      earned += weight * Math.min(r.rating_milli, top);
    }
  }
  const total = state.requests.length;
  const quality = bound === 0 ? 0 : Math.floor(100 * earned / bound);
  const served = total === 0 ? 0 : Math.floor(100 * state.totals.valid / total);
  const wire = state.totals.checks === 0 ? 100 : Math.floor(100 * state.totals.checks_passed / state.totals.checks);
  const failover = state.totals.failover_requests === 0 ? state.totals.valid > 0 ? 100 : 0 : Math.floor(100 * state.totals.failover_handled / state.totals.failover_requests);
  const cat = catalogChecks(state.catalog, catalog, state.catalog_route);
  const catalogScore = cat.checks === 0 ? 100 : Math.floor(100 * cat.passed / cat.checks);
  return {
    score: Math.round((60 * quality + 15 * served + 10 * wire + 10 * failover + 5 * catalogScore) / 100),
    quality,
    served,
    wire,
    failover,
    catalog: catalogScore,
    upstream_calls: state.totals.upstream_calls,
    working: state.totals.valid > 0 ? 1 : 0
  };
}

// src/scorer/main.ts
var OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "/output";
var REFERENCE_DIR = process.env.MAKEFUN_REFERENCE_DIR || "/reference";
var SCORES_DIR = process.env.MAKEFUN_SCORES_DIR || "/scores";
function readText(dir, name) {
  try {
    return readFileSync(join(dir, name), "utf8");
  } catch (err) {
    throw new Error(`${name}: cannot be read: ${err.message}`);
  }
}
try {
  const ratings = parseRatingsFile(readText(REFERENCE_DIR, RATINGS_FILE));
  const catalog = parseCatalogTruth(readText(REFERENCE_DIR, CATALOG_FILE));
  const state = parseTrialState(readText(OUTPUT_DIR, STATE_FILE));
  const scores = score(state, ratings, catalog);
  mkdirSync(SCORES_DIR, { recursive: true });
  writeFileSync(join(SCORES_DIR, "scores.json"), `${JSON.stringify(scores)}
`);
  process.stdout.write(`${state.totals.valid} of ${state.requests.length} valid, ${state.totals.upstream_calls} upstream calls; score ${scores.score} (quality ${scores.quality}, served ${scores.served}, wire ${scores.wire}, failover ${scores.failover}, catalog ${scores.catalog})
`);
} catch (err) {
  process.stderr.write(`${err.message}
`);
  process.exitCode = 1;
}
