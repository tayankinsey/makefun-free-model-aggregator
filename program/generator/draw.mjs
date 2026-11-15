// generator/draw.mjs: built by scripts/competitions/build-agent-bundle.ts from src/generator/main.ts with esbuild 0.28.2. Do not edit: rebuild it.
import { createRequire as __agentBundleCreateRequire } from 'node:module';
const require = __agentBundleCreateRequire(import.meta.url);

// src/generator/main.ts
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// src/shared/protocol.ts
var PROVIDERS_SCHEMA = "free-model-aggregator-01/providers/v1";
var WORKLOAD_SCHEMA = "free-model-aggregator-01/workload/v1";
var CATALOG_SCHEMA = "free-model-aggregator-01/catalog/v1";
var RATINGS_SCHEMA = "free-model-aggregator-01/ratings/v1";

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
function meetsRequirements(model, requires) {
  if (requires.tools === true && !model.tools) return false;
  if (requires.vision === true && !model.vision) return false;
  if (requires.json === true && !model.json) return false;
  if (requires.min_context !== void 0 && model.context_length < requires.min_context) return false;
  return true;
}
function bestFreeRating(requires) {
  let best = -1;
  for (const p of PROVIDERS) for (const m of p.models) if (m.free && meetsRequirements(m, requires)) best = Math.max(best, m.rating_milli);
  if (best < 0) throw new Error(`no free model in the sealed table meets ${JSON.stringify(requires)}`);
  return best;
}

// src/generator/rng.ts
import { createHmac } from "node:crypto";
var Stream = class {
  key;
  label;
  block = 0;
  buf = Buffer.alloc(0);
  pos = 0;
  constructor(seedHex, label) {
    if (!/^[0-9a-f]{64}$/.test(seedHex)) throw new RangeError("a stream is seeded by 64 lowercase hex characters");
    this.key = Buffer.from(seedHex, "hex");
    this.label = label;
  }
  byte() {
    if (this.pos === this.buf.length) {
      this.buf = createHmac("sha256", this.key).update(`${this.label}/${this.block}`).digest();
      this.block += 1;
      this.pos = 0;
    }
    const b = this.buf[this.pos];
    this.pos += 1;
    return b;
  }
  bytes(n) {
    if (!Number.isSafeInteger(n) || n < 0) throw new RangeError(`bytes(n) takes a whole n, got ${n}`);
    const out = Buffer.alloc(n);
    for (let i = 0; i < n; i++) out[i] = this.byte();
    return out;
  }
  uint32() {
    return (this.byte() << 24 >>> 0) + (this.byte() << 16) + (this.byte() << 8) + this.byte();
  }
  /** A whole number from lo to hi, both included, by rejection over 32-bit words. */
  int(lo, hi) {
    if (!Number.isSafeInteger(lo) || !Number.isSafeInteger(hi) || hi < lo || hi - lo + 1 > 2 ** 32) throw new RangeError(`int(${lo}, ${hi}) is not a range of at most 2^32 whole numbers`);
    const n = hi - lo + 1;
    const limit = Math.floor(2 ** 32 / n) * n;
    for (; ; ) {
      const w = this.uint32();
      if (w < limit) return lo + w % n;
    }
  }
  /** A number in [0, 1), 53 bits of it drawn. */
  float() {
    const hi = this.uint32() >>> 5;
    const lo = this.uint32() >>> 6;
    return (hi * 67108864 + lo) / 9007199254740992;
  }
  /** A number from lo to hi. */
  uniform(lo, hi) {
    return lo + (hi - lo) * this.float();
  }
  pick(xs) {
    if (xs.length === 0) throw new RangeError("pick from an empty list");
    return xs[this.int(0, xs.length - 1)];
  }
  shuffle(xs) {
    const out = [...xs];
    for (let i = out.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }
};

// src/generator/workload.ts
var VISION_PNG_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
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
var SYSTEM_IDS = /* @__PURE__ */ new Set(["r02", "r04", "r06", "r08", "r10", "r12", "r14", "r16", "r18", "r20"]);
var STOP_IDS = /* @__PURE__ */ new Set(["r02", "r05", "r08", "r11", "r14", "r17"]);
var SYSTEM_TEXT = "You are a careful operations assistant. Follow the tool contract exactly, never invent an account id, and answer in the language the request uses.";
var TOOL_FUNCTIONS = [
  {
    name: "lookup_customer",
    description: "Look up one customer account by its account id and return its plan, status and last invoice.",
    parameters: {
      type: "object",
      properties: {
        account_id: { type: "string", description: "The account id, four digits." },
        include_history: { type: "boolean", description: "Whether to include the last twelve invoices." }
      },
      required: ["account_id"],
      additionalProperties: false
    }
  },
  {
    name: "create_ticket",
    description: "Open one support ticket and return its id and queue.",
    parameters: {
      type: "object",
      properties: {
        subject: { type: "string", description: "One line naming the problem." },
        priority: { type: "string", enum: ["low", "normal", "urgent"], description: "How soon the queue must pick it up." }
      },
      required: ["subject", "priority"],
      additionalProperties: false
    }
  }
];
var TASK = {
  r01: "A customer complaint arrived as the attached image. Read it, find the account id it names, call lookup_customer for that account, and if the complaint is about a charge call create_ticket with priority urgent.",
  r02: "Look at the attached screenshot of the billing dashboard and summarise it for the operations channel, then call create_ticket with a subject naming the problem and a priority.",
  r03: "Find account 8812 with lookup_customer and open one ticket for its overdue invoice with create_ticket. Use the tools you are given; do not guess an account id.",
  r04: "The nightly billing job failed on account 4407. Look the account up and open one urgent ticket describing the failure and the account plan.",
  r05: "Check account 5402 for its refund window, then open the matching ticket. Two calls at most.",
  r06: "What does this chart show? Name the trend and the one outlier the annotation points at, in two sentences.",
  r07: 'Classify the following support message as billing, bug or feature, and give a confidence from 0 to 1. Answer with one JSON object: {"label": "...", "confidence": 0.0}. Message: "Your last deploy removed the export button from the invoices page."',
  r08: 'Extract the invoice fields from this text and answer with one JSON object {"vendor": "...", "total": "...", "due": "..."}. Text: "Northwind Traders, invoice 2291, total 1,284.50 EUR, due on the fourteenth."',
  r09: 'Turn this changelog into one JSON object of arrays {"added": [], "fixed": [], "removed": []}. Changelog: "Added CSV export. Fixed the timezone in the digest. Removed the legacy billing tab."',
  r10: "Here is a service log. Find the first error and the request id that caused the burst that follows it, and answer in one sentence.",
  r11: "Here is a rollout log. Say which step first exceeded its latency budget, and by how much, in one sentence.",
  r12: "Here is an audit trail. Name the account whose quota was raised twice, in one sentence.",
  r13: "Write a one-paragraph release note for the version described below, addressed to customers.",
  r14: "Summarise the three bullet points below as one sentence for the status page.",
  r15: "Rewrite the paragraph below in plain English at a sixth-grade reading level.",
  r16: "Name the two risks the paragraph below implies, as a short numbered list.",
  r17: "Answer the question in the text below in at most two sentences.",
  r18: "Turn the notes below into a short checklist of the steps they describe.",
  r19: "Give one concrete example that makes the definition below easier to understand.",
  r20: "Restate the claim below as a testable hypothesis, in one sentence."
};
var FILLER = {
  r13: "Version 4.2 of the console now keeps filters when you switch pages, shows the deploy history beside each environment, and no longer logs the user out after an idle hour.",
  r14: "The queue drained by noon. Two workers restarted after their memory limit was raised. The error rate is back under its alert threshold.",
  r15: "The migration, which had been scheduled for the maintenance window, was postponed because the replica, having fallen behind during the previous night, had not yet caught up with the primary.",
  r16: "The new pricing depends on one vendor quota that has been raised twice this quarter, and the export pipeline has no test that runs on the real invoice shapes.",
  r17: "Question: how long does a trial last, and what happens to its data when it ends?",
  r18: "Notes: run the migration, then restart the workers, then check the queue depth, then announce the change in the channel.",
  r19: "Definition: a quota is the number of calls a provider will answer in a window before it starts refusing.",
  r20: "Claim: a router that retries the same provider twice answers more requests than one that fails over at once."
};
function serviceLog(st) {
  const levels = ["info", "info", "info", "warn", "error"];
  const modules = ["ingest", "billing", "gateway", "search", "worker"];
  const lines = [];
  for (let i = 1; i <= 140; i++) {
    const level = st.pick(levels);
    const module = st.pick(modules);
    const account = 1e3 + st.int(0, 8999);
    const ms = st.int(1, 900);
    const msg = level === "error" ? "upstream timeout" : level === "warn" ? "retry scheduled" : "handled";
    lines.push(`seq=${String(i).padStart(4, "0")} level=${level} module=${module} account=${account} took_ms=${ms} msg=${msg}`);
  }
  return lines.join("\n");
}
function userText(request, nonce, log) {
  const task = TASK[request.id];
  if (task === void 0) throw new Error(`the workload has no task text for ${request.id}`);
  const parts = [task];
  if (FILLER[request.id] !== void 0) parts.push(`The text: ${FILLER[request.id]}`);
  if (log !== null) parts.push("The log:", log);
  parts.push(`[request nonce ${nonce}]`);
  return parts.join("\n\n");
}
function bodyFor(request, seed) {
  const st = new Stream(seed, `workload/${request.id}`);
  const nonce = st.bytes(8).toString("hex");
  const max_tokens = st.int(64, 512);
  const temperature = Math.round(st.uniform(0, 1) * 100) / 100;
  const toolCount = st.int(1, 2);
  const system = SYSTEM_IDS.has(request.id) ? SYSTEM_TEXT : null;
  const stop = STOP_IDS.has(request.id);
  const log = request.requires.min_context !== void 0 ? serviceLog(new Stream(seed, `log/${request.id}`)) : null;
  const text = userText(request, nonce, log);
  const tools = request.requires.tools === true ? TOOL_FUNCTIONS.slice(0, toolCount) : [];
  const image = request.requires.vision === true;
  const jsonMode = request.requires.json === true;
  if (request.api === "openai") {
    const content2 = image ? [{ type: "text", text }, { type: "image_url", image_url: { url: `data:image/png;base64,${VISION_PNG_BASE64}` } }] : text;
    return {
      model: "auto",
      messages: [...system === null ? [] : [{ role: "system", content: system }], { role: "user", content: content2 }],
      max_tokens,
      temperature,
      ...tools.length === 0 ? {} : { tools: tools.map((t) => ({ type: "function", function: t })), tool_choice: "auto" },
      ...jsonMode ? { response_format: { type: "json_object" } } : {},
      ...stop ? { stop: ["\n\n###"] } : {},
      ...request.stream ? { stream: true } : {}
    };
  }
  const content = image ? [{ type: "text", text }, { type: "image", source: { type: "base64", media_type: "image/png", data: VISION_PNG_BASE64 } }] : text;
  return {
    model: "auto",
    max_tokens,
    ...system === null ? {} : { system },
    messages: [{ role: "user", content }],
    temperature,
    ...tools.length === 0 ? {} : { tools: tools.map((t) => ({ name: t.name, description: t.description, input_schema: t.parameters })) },
    ...stop ? { stop_sequences: ["\n\nHuman:"] } : {},
    ...request.stream ? { stream: true } : {}
  };
}
function bodiesFor(seed) {
  const bodies = {};
  for (const request of WORKLOAD) bodies[request.id] = bodyFor(request, seed);
  return bodies;
}

// src/generator/instance.ts
var INSTANCE_SEED_SCHEMA = "agent-fun/instance-seed/v1";
function readSeedFile(source) {
  let v;
  try {
    v = JSON.parse(source);
  } catch (err) {
    throw new Error(`/input/seed.json is not JSON: ${err.message}`);
  }
  const o = v;
  if (o === null || typeof o !== "object" || o.schema !== INSTANCE_SEED_SCHEMA || typeof o.seed !== "string" || !/^[0-9a-f]{64}$/.test(o.seed)) {
    throw new Error(`/input/seed.json is not an ${INSTANCE_SEED_SCHEMA} seed`);
  }
  if (o.t !== void 0 && (typeof o.t !== "number" || !Number.isSafeInteger(o.t) || o.t < 0)) throw new Error("/input/seed.json: t is not a trial index");
  return { seed: o.seed, purpose: typeof o.purpose === "string" ? o.purpose : "", k: typeof o.k === "number" ? o.k : 0, t: typeof o.t === "number" ? o.t : null };
}
function drawFailCalls(st, lo, hi, count) {
  if (hi - lo + 1 < count) throw new RangeError(`cannot draw ${count} distinct numbers from ${lo} to ${hi}`);
  const picked = /* @__PURE__ */ new Set();
  while (picked.size < count) picked.add(st.int(lo, hi));
  return [...picked].sort((a, b) => a - b);
}
function drawInstance(seed) {
  const ids = PROVIDERS.map((p) => p.id);
  const secondCall = new Stream(seed, "failover/second-call").pick(ids);
  const outage = new Stream(seed, "outage").pick(ids);
  const providers = PROVIDERS.map((p) => {
    const budget = new Stream(seed, `provider/${p.id}/budget`).int(p.calls_min, p.calls_max);
    const count = new Stream(seed, `provider/${p.id}/fails/count`).int(1, 2);
    const fail_calls = drawFailCalls(new Stream(seed, `provider/${p.id}/fails`), 2, budget - 1, count);
    return {
      id: p.id,
      name: p.name,
      wire: p.wire,
      auth: p.auth,
      path: p.path,
      key_env: p.key_env,
      key: p.key,
      budget,
      concurrency: p.concurrency,
      fail_calls,
      outage_from: null,
      models: p.models.map((m) => ({ ...m }))
    };
  });
  const designated = providers.find((p) => p.id === secondCall);
  if (designated === void 0) throw new Error(`the draw picked no provider ${secondCall}`);
  if (!designated.fail_calls.includes(2)) designated.fail_calls = [2, ...designated.fail_calls.slice(1)].sort((a, b) => a - b);
  const down = providers.find((p) => p.id === outage);
  if (down === void 0) throw new Error(`the draw picked no provider ${outage}`);
  down.outage_from = new Stream(seed, `provider/${outage}/outage`).int(2, down.budget - 1);
  return { seed, providers, workload: { schema: WORKLOAD_SCHEMA, manifest: WORKLOAD.map((r) => ({ ...r, requires: { ...r.requires } })), bodies: bodiesFor(seed) } };
}
function providersFile(i) {
  return {
    schema: PROVIDERS_SCHEMA,
    providers: i.providers.map((p) => ({
      id: p.id,
      name: p.name,
      wire: p.wire,
      auth: p.auth,
      path: p.path,
      key_env: p.key_env,
      key: p.key,
      budget: p.budget,
      concurrency: p.concurrency,
      fail_calls: [...p.fail_calls],
      outage_from: p.outage_from,
      models: p.models.map((m) => ({ ...m }))
    }))
  };
}
function catalogTruth() {
  return {
    schema: CATALOG_SCHEMA,
    providers: PROVIDERS.map((p) => ({
      id: p.id,
      base_url: p.path,
      key_env: p.key_env,
      wire: p.wire,
      free_models: p.models.filter((m) => m.free).map((m) => m.id),
      paid_models: p.models.filter((m) => !m.free).map((m) => m.id)
    }))
  };
}
function ratingsFile() {
  const ratings = [];
  for (const p of PROVIDERS) {
    for (const m of p.models) {
      ratings.push({ model: m.id, provider: p.id, rating_milli: m.rating_milli, context_length: m.context_length, tools: m.tools, vision: m.vision, json: m.json, free: m.free });
    }
  }
  const best = WORKLOAD.map((r) => ({ id: r.id, rating_milli: bestFreeRating(r.requires) }));
  return { schema: RATINGS_SCHEMA, ratings, best };
}
var BRIEF = (() => {
  const directory = {
    schema: PROVIDERS_SCHEMA,
    providers: PROVIDERS.map((p) => ({ id: p.id, name: p.name, wire: p.wire, auth: p.auth, key_env: p.key_env, key: p.key, path: p.path }))
  };
  const quality = {
    schema: RATINGS_SCHEMA,
    ratings: PROVIDERS.flatMap(
      (p) => p.models.filter((m) => m.free).map((m) => ({ model: m.id, provider: p.id, rating_milli: m.rating_milli, context_length: m.context_length, tools: m.tools, vision: m.vision, json: m.json, free: true }))
    ),
    best: WORKLOAD.map((r) => ({ id: r.id, rating_milli: bestFreeRating(r.requires) }))
  };
  const workload = {
    schema: WORKLOAD_SCHEMA,
    manifest: WORKLOAD.map((r) => ({ id: r.id, api: r.api, stream: r.stream, weight: r.weight, requires: { ...r.requires } })),
    bodies: {}
  };
  return [
    "free-model-aggregator-01: serve every request with the best free model you can get.",
    "",
    "You write one long-running program. It listens on 0.0.0.0 at a port you choose, registers with the env, and answers the requests the env's client sends to its own HTTP server; when the client is done it exits 0. Every answer must come from one of the ten providers below, through the env: there is no model of your own. For each request, choose the strongest model that is free, that meets the request's requirements, and that still has budget; speak that provider's wire; when a provider refuses, count the failure and answer the request with another; and return the answer in the wire the client used.",
    "",
    "Run with --list, print your catalog as one JSON document and exit 0 without starting the server. The catalog is one entry a provider: id, base_url (the provider's own path, such as /p/groq, never joined to $MAKEFUN_ENV_URL: join the env only to dial), key_env, wire, and models, each with id, free and context_length.",
    "",
    "The env is at $MAKEFUN_ENV_URL and serves three routes:",
    "  POST /register   the body is protocol_version 1, the port you listen on, and your catalog; it answers ok true and the number of requests",
    "  GET  /work       answers done false with the next request id and how many are pending, until the client has sent every request, then done true",
    "  GET  /instance   answers the provider directory and the workload manifest as JSON, with absolute base_urls for dialling",
    "The client sends one request at a time and waits for its answer.",
    "",
    "Your server",
    "  POST /v1/chat/completions   an OpenAI Chat Completions request; stream true asks for server-sent events",
    "  POST /v1/messages           an Anthropic Messages request; stream true asks for server-sent events",
    "  GET  /v1/models             the model list: OpenAI shape for Authorization: Bearer, Anthropic shape for x-api-key",
    "The wire is the auth header: Authorization: Bearer is OpenAI, x-api-key is Anthropic.",
    "",
    `Requests name model "auto", and the model is yours to choose. Pass a request through in the provider's wire untouched: its system prompt, its user text (images included), its tools, its stop sequences, its max_tokens, its JSON mode. The provider echoes what it parsed, and the client compares that echo with what it sent: a field you rewrite or drop loses the request. A JSON-mode request carries response_format on the OpenAI wire; a provider whose wire cannot carry it echoes that it was absent, so route such a request to a wire that can. Return the provider's answer in the wire the client used, streamed or not as it asked, with the provider's text whole, its usage counts as that wire reports them, and its stop reason mapped end_turn to stop, max_tokens to length, tool_use to tool_calls and refusal to content_filter.`,
    "",
    "A provider is at <ENV>/p/<id>, where <ENV> is $MAKEFUN_ENV_URL, and serves its wire's vendor API at the vendor's own paths: openai POST /v1/chat/completions and GET /v1/models; anthropic POST /v1/messages and GET /v1/models (send the anthropic-version header your client sends); gemini POST /v1beta/models/<model>:generateContent and :streamGenerateContent, GET /v1beta/models. The auth field names the header that carries the key: bearer is Authorization: Bearer <key>, x-api-key is x-api-key: <key>, x-goog-api-key is x-goog-api-key: <key>, none sends no key and has empty key_env and key.",
    "",
    "Each provider has a free-tier budget for the trial, drawn per trial and never published; a call over it, a call on the provider's own failure schedule, or any call after its outage begins refuses with that provider's own status and its error code in its wire's envelope: 429 on all but one provider and 402 on that one, some with a retry-after. A refusal is not your answer: count it and answer the request with another model. A provider serves one inference call at a time: a second call sent while its first is in flight is refused with 429 and the concurrent_requests code, and spends none of its budget. A model that lacks something a request requires cannot serve it, and a paid model is never a legal pick: a request answered by one is invalid.",
    "",
    "The score: quality 60 percent is the weighted rating of your valid answers over the best legal rating for each request; served 15 is the share of the 20 requests answered validly; wire 10 is the share of the client's response checks passed; failover 10 is the share of requests whose first provider call refused that you still served; catalog 5 is whether your --list report matches the directory and the free-model sets exactly. Your own GET /v1/models is scored too: asked at the trial's start with both auth headers, it must list exactly the free model ids you registered.",
    "",
    "A trial is replayed, and the export must match: keep every route a function of the requests and the providers' answers you have seen so far, never of the wall clock. MAKEFUN_TRIAL_SEED is a seed for any randomness you need.",
    "",
    "The provider directory, one JSON document (each provider's path is the base_url a catalog reports):",
    JSON.stringify(directory),
    "",
    "The quality table and each request's best rating, one JSON document (free models only):",
    JSON.stringify(quality),
    "",
    "The workload manifest, one JSON document:",
    JSON.stringify(workload),
    ""
  ].join("\n");
})();
function jsonText(v) {
  return `${JSON.stringify(v, null, 2)}
`;
}
function instanceFiles(i) {
  return {
    "input/prompt.txt": BRIEF,
    "input/env/providers.json": jsonText(providersFile(i)),
    "input/env/workload.json": jsonText(i.workload),
    "reference/catalog.json": jsonText(catalogTruth()),
    "reference/ratings.json": jsonText(ratingsFile())
  };
}

// src/generator/main.ts
var INPUT_DIR = process.env.MAKEFUN_INPUT_DIR || "/input";
var OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "/output";
try {
  const seedFile = readSeedFile(readFileSync(join(INPUT_DIR, "seed.json"), "utf8"));
  const instance = drawInstance(seedFile.seed);
  const files = instanceFiles(instance);
  for (const [rel, text] of Object.entries(files)) {
    const file = join(OUTPUT_DIR, ...rel.split("/"));
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  }
  const budget = instance.providers.reduce((n, p) => n + p.budget, 0);
  const down = instance.providers.filter((p) => p.outage_from !== null).map((p) => p.id);
  process.stdout.write(`drew ${instance.workload.manifest.length} requests over ${instance.providers.length} providers, ${budget} calls budgeted, outage ${down.join(",")} (${seedFile.purpose} k=${seedFile.k}${seedFile.t === null ? "" : ` t=${seedFile.t}`})
`);
} catch (err) {
  process.stderr.write(`${err.message}
`);
  process.exitCode = 1;
}
