// env/server.mjs: built by scripts/competitions/build-agent-bundle.ts from src/server/main.ts with esbuild 0.28.2. Do not edit: rebuild it.
import { createRequire as __agentBundleCreateRequire } from 'node:module';
const require = __agentBundleCreateRequire(import.meta.url);

// src/server/main.ts
import { appendFileSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { join } from "node:path";

// ../../server/agent-env/listen.ts
var ENV_HOST_ENV = "MAKEFUN_ENV_HOST";
var ENV_PORT_ENV = "MAKEFUN_ENV_PORT";
var STATE_DIR_ENV = "MAKEFUN_STATE_DIR";
var DEFAULT_ENV_PORT = 8080;
var PROCESS_DRIVER_HOST = "127.0.0.1";
var CONTAINER_HOST = "0.0.0.0";
function listenTarget(env = process.env) {
  const stateDir = env[STATE_DIR_ENV];
  const processDriver = stateDir !== void 0 && stateDir !== "";
  const host = env[ENV_HOST_ENV] || (processDriver ? PROCESS_DRIVER_HOST : CONTAINER_HOST);
  const portText = env[ENV_PORT_ENV] ?? String(DEFAULT_ENV_PORT);
  if (!/^\d{1,5}$/.test(portText) || Number(portText) > 65535) {
    throw new Error(`${ENV_PORT_ENV} ${JSON.stringify(portText)} is not a port`);
  }
  return { host, port: Number(portText) };
}
function envListen(server, env = process.env) {
  const target = listenTarget(env);
  return new Promise((resolve, reject) => {
    const onError = (err) => reject(err);
    server.once("error", onError);
    server.listen({ port: target.port, host: target.host, reusePort: false }, () => {
      server.removeListener("error", onError);
      const bound = server.address();
      if (bound === null || typeof bound === "string") {
        reject(new Error(`the env's listener on ${target.host}:${target.port} has no TCP address`));
        return;
      }
      resolve({ host: target.host, port: bound.port });
    });
  });
}

// src/shared/protocol.ts
var PROTOCOL_VERSION = 1;
var READY_SCHEMA = "free-model-aggregator-01/ready/v1";
var PROVIDERS_SCHEMA = "free-model-aggregator-01/providers/v1";
var WORKLOAD_SCHEMA = "free-model-aggregator-01/workload/v1";
var STATE_SCHEMA = "free-model-aggregator-01/state/v1";
var PROVIDERS_FILE = "providers.json";
var WORKLOAD_FILE = "workload.json";
var STATE_FILE = "state.json";
var REGISTER_PATH = "/register";
var WORK_PATH = "/work";
var INSTANCE_PATH = "/instance";

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
function isFree(provider, model) {
  return modelRow(provider, model).free;
}
function meetsRequirements(model, requires) {
  if (requires.tools === true && !model.tools) return false;
  if (requires.vision === true && !model.vision) return false;
  if (requires.json === true && !model.json) return false;
  if (requires.min_context !== void 0 && model.context_length < requires.min_context) return false;
  return true;
}

// src/server/providers.ts
import { createHash } from "node:crypto";
var FIXED_CREATED = 1767225600;
var SSE_DELTA_CHARS = 13;
var CONCURRENCY_HOLD_MS = 25;
var isRecord = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
function sha8Text(text) {
  return createHash("sha256").update(text).digest("hex").slice(0, 8);
}
function sha8Bytes(bytes) {
  return createHash("sha256").update(bytes).digest("hex").slice(0, 8);
}
function numberOrNull(v) {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}
function stringList(v) {
  if (typeof v === "string") return [v];
  if (!Array.isArray(v)) return [];
  return v.filter((x) => typeof x === "string");
}
function blocksText(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  const parts = [];
  for (const block of content) if (isRecord(block) && block.type === "text" && typeof block.text === "string") parts.push(block.text);
  return parts.join("\n");
}
function imageShaOfUrl(url) {
  if (typeof url !== "string" || url === "") return null;
  const data = /^data:[^,]*;base64,(.*)$/s.exec(url);
  if (data !== null) return sha8Bytes(Buffer.from(data[1], "base64"));
  return sha8Text(url);
}
function echoOf(o) {
  return {
    system_present: o.systemText !== "",
    system_sha8: o.systemText === "" ? null : sha8Text(o.systemText),
    user_sha8: sha8Text(o.userText),
    tools: o.tools,
    max_tokens: o.maxTokens,
    stops: o.stops,
    image_sha8: o.imageSha8,
    json_mode: o.jsonMode
  };
}
function openAIParsed(body) {
  const messages = Array.isArray(body.messages) ? body.messages.filter(isRecord) : [];
  const systemParts = [];
  let userText = "";
  let imageSha8 = null;
  for (const message of messages) {
    if (message.role === "system") {
      const text = blocksText(message.content);
      if (text !== "") systemParts.push(text);
    } else if (message.role === "user") {
      userText = blocksText(message.content);
      if (Array.isArray(message.content)) {
        for (const block of message.content) {
          if (!isRecord(block)) continue;
          if (block.type === "image_url" && isRecord(block.image_url)) imageSha8 = imageShaOfUrl(block.image_url.url) ?? imageSha8;
        }
      }
    }
  }
  const tools = [];
  if (Array.isArray(body.tools)) {
    for (const tool of body.tools) if (isRecord(tool) && isRecord(tool.function) && typeof tool.function.name === "string") tools.push(tool.function.name);
  }
  const format = isRecord(body.response_format) ? body.response_format.type : void 0;
  const systemText = systemParts.join("\n");
  const maxTokens = numberOrNull(body.max_tokens) ?? numberOrNull(body.max_completion_tokens);
  const stops = stringList(body.stop);
  return {
    model: typeof body.model === "string" ? body.model : null,
    stream: body.stream === true,
    includeUsage: isRecord(body.stream_options) && body.stream_options.include_usage === true,
    echo: echoOf({ systemText, userText, tools, maxTokens, stops, imageSha8, jsonMode: format === "json_object" || format === "json_schema" }),
    systemText,
    userText,
    stop: "stop"
  };
}
function anthropicParsed(body) {
  const systemText = blocksText(body.system);
  const messages = Array.isArray(body.messages) ? body.messages.filter(isRecord) : [];
  let userText = "";
  let imageSha8 = null;
  for (const message of messages) {
    if (message.role !== "user") continue;
    userText = blocksText(message.content);
    if (Array.isArray(message.content)) {
      for (const block of message.content) {
        if (!isRecord(block) || block.type !== "image" || !isRecord(block.source)) continue;
        if (block.source.type === "base64" && typeof block.source.data === "string") imageSha8 = sha8Bytes(Buffer.from(block.source.data, "base64"));
        else if (block.source.type === "url") imageSha8 = imageShaOfUrl(block.source.url) ?? imageSha8;
      }
    }
  }
  const tools = [];
  if (Array.isArray(body.tools)) {
    for (const tool of body.tools) if (isRecord(tool) && typeof tool.name === "string") tools.push(tool.name);
  }
  const maxTokens = numberOrNull(body.max_tokens);
  const stops = stringList(body.stop_sequences);
  return {
    model: typeof body.model === "string" ? body.model : null,
    stream: body.stream === true,
    includeUsage: false,
    echo: echoOf({ systemText, userText, tools, maxTokens, stops, imageSha8, jsonMode: false }),
    systemText,
    userText,
    stop: "end_turn"
  };
}
function geminiPartsText(parts) {
  if (!Array.isArray(parts)) return "";
  const texts = [];
  for (const part of parts) if (isRecord(part) && typeof part.text === "string") texts.push(part.text);
  return texts.join("\n");
}
function geminiParsed(body, model, stream) {
  const systemText = isRecord(body.systemInstruction) ? geminiPartsText(body.systemInstruction.parts) : "";
  const contents = Array.isArray(body.contents) ? body.contents.filter(isRecord) : [];
  let userText = "";
  let imageSha8 = null;
  for (const content of contents) {
    if (content.role === "model") continue;
    userText = geminiPartsText(content.parts);
    if (Array.isArray(content.parts)) {
      for (const part of content.parts) {
        if (!isRecord(part)) continue;
        if (isRecord(part.inlineData) && typeof part.inlineData.data === "string") imageSha8 = sha8Bytes(Buffer.from(part.inlineData.data, "base64"));
        else if (isRecord(part.fileData) && typeof part.fileData.fileUri === "string") imageSha8 = imageShaOfUrl(part.fileData.fileUri) ?? imageSha8;
      }
    }
  }
  const tools = [];
  if (Array.isArray(body.tools)) {
    for (const tool of body.tools) {
      if (!isRecord(tool) || !Array.isArray(tool.functionDeclarations)) continue;
      for (const fn of tool.functionDeclarations) if (isRecord(fn) && typeof fn.name === "string") tools.push(fn.name);
    }
  }
  const config = isRecord(body.generationConfig) ? body.generationConfig : {};
  const maxTokens = numberOrNull(config.maxOutputTokens);
  const stops = stringList(config.stopSequences);
  return {
    model,
    stream,
    includeUsage: false,
    echo: echoOf({ systemText, userText, tools, maxTokens, stops, imageSha8, jsonMode: config.responseMimeType === "application/json" }),
    systemText,
    userText,
    stop: "STOP"
  };
}
function parseClientEcho(api, body) {
  if (!isRecord(body)) return null;
  return api === "openai" ? openAIParsed(body).echo : anthropicParsed(body).echo;
}
function jsonReply(status, value) {
  const body = Buffer.from(`${JSON.stringify(value)}
`);
  return { status, headers: { "content-type": "application/json" }, body };
}
function sseReply(text) {
  return {
    status: 200,
    headers: { "content-type": "text/event-stream; charset=utf-8", "cache-control": "no-cache", connection: "keep-alive" },
    body: Buffer.from(text)
  };
}
function sseFrame(event, data) {
  return `${event === null ? "" : `event: ${event}
`}data: ${JSON.stringify(data)}

`;
}
function openAIErrorType(status) {
  if (status === 429) return "rate_limit_error";
  if (status >= 500) return "api_error";
  return "invalid_request_error";
}
function anthropicErrorType(status, code) {
  if (status === 401) return "authentication_error";
  if (status === 400) return "invalid_request_error";
  return code;
}
function errorReply(wire, status, code, message, retryAfter) {
  const retry = retryAfter && status === 429 ? 1 : null;
  let body;
  if (wire === "openai") {
    const error = { message, type: openAIErrorType(status), param: null, code };
    if (retry !== null) error.retry_after = retry;
    body = { error };
  } else if (wire === "anthropic") {
    const error = { type: anthropicErrorType(status, code), message };
    if (retry !== null) error.retry_after = retry;
    body = { type: "error", error };
  } else {
    const error = { code: status, message, status: code };
    if (retry !== null) error.retry_after = retry;
    body = { error };
  }
  const reply = jsonReply(status, body);
  if (retry !== null) reply.headers["retry-after"] = String(retry);
  return reply;
}
function authCode(wire) {
  if (wire === "openai") return "invalid_api_key";
  if (wire === "anthropic") return "authentication_error";
  return "UNAUTHENTICATED";
}
function authHeaderName(auth) {
  if (auth === "bearer") return "authorization";
  if (auth === "x-api-key") return "x-api-key";
  if (auth === "x-goog-api-key") return "x-goog-api-key";
  return null;
}
function headerValue(headers, name) {
  const value = headers[name];
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0] ?? null;
  return null;
}
function authOk(entry, request) {
  const name = authHeaderName(entry.auth);
  if (name === null) return true;
  const value = headerValue(request.headers, name);
  if (entry.auth === "bearer") return value === `Bearer ${entry.key}`;
  if (entry.auth === "x-goog-api-key") return value === entry.key || request.query.get("key") === entry.key;
  return value === entry.key;
}
function splitText(text) {
  const pieces = [];
  for (let at = 0; at < text.length; at += SSE_DELTA_CHARS) pieces.push(text.slice(at, at + SSE_DELTA_CHARS));
  return pieces.length === 0 ? [""] : pieces;
}
function openAIAnswer(model, text, usage, stream, includeUsage) {
  const tokens = { prompt_tokens: usage.input, completion_tokens: usage.output, total_tokens: usage.input + usage.output };
  if (!stream) {
    return jsonReply(200, {
      id: "chatcmpl-sim",
      object: "chat.completion",
      created: FIXED_CREATED,
      model,
      choices: [{ index: 0, message: { role: "assistant", content: text }, finish_reason: "stop", logprobs: null }],
      usage: tokens
    });
  }
  const chunk = (delta, finish) => ({ id: "chatcmpl-sim", object: "chat.completion.chunk", created: FIXED_CREATED, model, choices: [{ index: 0, delta, finish_reason: finish }] });
  const frames = [sseFrame(null, chunk({ role: "assistant", content: "" }, null))];
  for (const piece of splitText(text)) frames.push(sseFrame(null, chunk({ content: piece }, null)));
  frames.push(sseFrame(null, chunk({}, "stop")));
  if (includeUsage) frames.push(sseFrame(null, { id: "chatcmpl-sim", object: "chat.completion.chunk", created: FIXED_CREATED, model, choices: [], usage: tokens }));
  frames.push("data: [DONE]\n\n");
  return sseReply(frames.join(""));
}
function anthropicAnswer(model, text, usage, stream) {
  if (!stream) {
    return jsonReply(200, {
      id: "msg_sim",
      type: "message",
      role: "assistant",
      model,
      content: [{ type: "text", text }],
      stop_reason: "end_turn",
      stop_sequence: null,
      usage: { input_tokens: usage.input, output_tokens: usage.output }
    });
  }
  const frames = [
    sseFrame("message_start", {
      type: "message_start",
      message: { id: "msg_sim", type: "message", role: "assistant", model, content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: usage.input, output_tokens: 0 } }
    }),
    sseFrame("content_block_start", { type: "content_block_start", index: 0, content_block: { type: "text", text: "" } })
  ];
  for (const piece of splitText(text)) frames.push(sseFrame("content_block_delta", { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: piece } }));
  frames.push(
    sseFrame("content_block_stop", { type: "content_block_stop", index: 0 }),
    sseFrame("message_delta", { type: "message_delta", delta: { stop_reason: "end_turn", stop_sequence: null }, usage: { output_tokens: usage.output } }),
    sseFrame("message_stop", { type: "message_stop" })
  );
  return sseReply(frames.join(""));
}
function geminiAnswer(model, text, usage, stream) {
  const metadata = { promptTokenCount: usage.input, candidatesTokenCount: usage.output, totalTokenCount: usage.input + usage.output };
  if (!stream) {
    return jsonReply(200, { candidates: [{ content: { parts: [{ text }], role: "model" }, finishReason: "STOP", index: 0 }], usageMetadata: metadata, modelVersion: model });
  }
  const frames = [];
  for (const piece of splitText(text)) frames.push(sseFrame(null, { candidates: [{ content: { parts: [{ text: piece }], role: "model" }, index: 0 }] }));
  frames.push(sseFrame(null, { candidates: [{ content: { parts: [{ text: "" }], role: "model" }, finishReason: "STOP", index: 0 }], usageMetadata: metadata, modelVersion: model }));
  return sseReply(frames.join(""));
}
function catalogReply(entry) {
  if (entry.wire === "openai") {
    return jsonReply(200, {
      object: "list",
      data: entry.models.map((m) => ({ id: m.id, object: "model", created: FIXED_CREATED, owned_by: entry.id, free: m.free, context_length: m.context_length, tools: m.tools, vision: m.vision, json: m.json }))
    });
  }
  if (entry.wire === "anthropic") {
    return jsonReply(200, {
      data: entry.models.map((m) => ({ type: "model", id: m.id, display_name: m.id, created_at: "2026-01-01T00:00:00Z", free: m.free, context_length: m.context_length, tools: m.tools, vision: m.vision, json: m.json })),
      has_more: false
    });
  }
  return jsonReply(200, {
    models: entry.models.map((m) => ({ name: `models/${m.id}`, displayName: m.id, inputTokenLimit: m.context_length, free: m.free, context_length: m.context_length, tools: m.tools, vision: m.vision, json: m.json }))
  });
}
function safeDecode(text) {
  try {
    return decodeURIComponent(text);
  } catch {
    return text;
  }
}
function routeOf(wire, method, sub) {
  if (wire === "openai") {
    if (sub === "/v1/models") return method === "GET" ? { kind: "catalog" } : { kind: "method", allow: "GET" };
    if (sub === "/v1/chat/completions") return method === "POST" ? { kind: "infer", modelFromPath: null, streamFromPath: false } : { kind: "method", allow: "POST" };
    return null;
  }
  if (wire === "anthropic") {
    if (sub === "/v1/models") return method === "GET" ? { kind: "catalog" } : { kind: "method", allow: "GET" };
    if (sub === "/v1/messages") return method === "POST" ? { kind: "infer", modelFromPath: null, streamFromPath: false } : { kind: "method", allow: "POST" };
    return null;
  }
  if (sub === "/v1beta/models") return method === "GET" ? { kind: "catalog" } : { kind: "method", allow: "GET" };
  const call = /^\/v1beta\/models\/([^/:]+):(generateContent|streamGenerateContent)$/.exec(sub);
  if (call === null) return null;
  if (method !== "POST") return { kind: "method", allow: "POST" };
  return { kind: "infer", modelFromPath: safeDecode(call[1]), streamFromPath: call[2] === "streamGenerateContent" };
}
function usageOf(parsed, text) {
  const prompt = parsed.systemText.length + parsed.userText.length + parsed.echo.tools.join(",").length;
  return { input: 1 + Math.floor(prompt / 4), output: 1 + Math.floor(text.length / 4) };
}
var Providers = class {
  #rows = /* @__PURE__ */ new Map();
  #calls = [];
  #seq = 0;
  /** `file` is the instance's providers.json: its rows are the directory plus this trial's numbers. */
  constructor(file) {
    for (const entry of file.providers) {
      const spec = providerById(entry.id);
      this.#rows.set(entry.id, { entry, spec, calls: 0, inFlight: 0, holds: [] });
    }
  }
  /** Every provider call the trial has made so far, in the order the providers decided them. */
  calls() {
    return this.#calls;
  }
  /** One inbound provider request: the provider's answer, and the call logged when it names a model. */
  async handle(id, request) {
    const row = this.#rows.get(id);
    if (row === void 0) return jsonReply(404, { error: "not_found", message: `no provider ${id}` });
    const entry = row.entry;
    const sub = request.path.startsWith(entry.path) ? request.path.slice(entry.path.length) : null;
    if (sub === null) return jsonReply(404, { error: "not_found", message: `no provider route ${request.path}` });
    const route = routeOf(entry.wire, request.method, sub);
    if (route === null) return jsonReply(404, { error: "not_found", message: `no route ${request.method} ${request.path}` });
    if (route.kind === "method") return jsonReply(405, { error: "method_not_allowed", message: `${request.path} takes ${route.allow}` });
    if (!authOk(entry, request)) {
      this.#record(row, null, 401, authCode(entry.wire), null, null, null);
      return errorReply(entry.wire, 401, authCode(entry.wire), "the key is missing or wrong", false);
    }
    if (route.kind === "catalog") return catalogReply(entry);
    let body = null;
    if (!request.bodyTooLarge && request.body !== null) {
      try {
        body = JSON.parse(request.body.toString("utf8"));
      } catch {
        body = void 0;
      }
    }
    if (!isRecord(body)) {
      this.#record(row, null, 400, "invalid_request", null, null, null);
      return errorReply(entry.wire, 400, "invalid_request", "the request body is not one JSON object", false);
    }
    const parsed = entry.wire === "openai" ? openAIParsed(body) : entry.wire === "anthropic" ? anthropicParsed(body) : geminiParsed(body, route.modelFromPath ?? "", route.streamFromPath);
    const model = route.modelFromPath ?? parsed.model;
    const spec = model === null ? null : entry.models.find((m) => m.id === model) ?? null;
    if (model === null || spec === null || spec.free !== true) {
      const why = model === null ? "the request names no model" : spec === null ? `the provider serves no model ${JSON.stringify(model)}` : `${model} is a paid model, and a paid model is never a legal pick`;
      this.#record(row, model, 400, "invalid_model", null, null, null);
      return errorReply(entry.wire, 400, "invalid_model", why, false);
    }
    releaseHolds(row);
    if (entry.concurrency > 0 && row.inFlight >= entry.concurrency) {
      this.#record(row, model, 429, "concurrent_requests", null, null, null);
      return errorReply(entry.wire, 429, "concurrent_requests", `${entry.name} serves ${entry.concurrency} call at a time`, row.spec.retry_after);
    }
    const callNumber = row.calls + 1;
    row.calls = callNumber;
    const refused = callNumber > entry.budget ? `${entry.name}'s free-tier budget is spent` : entry.outage_from !== null && callNumber >= entry.outage_from ? `${entry.name} is out` : entry.fail_calls.includes(callNumber) ? `${entry.name} refused this call` : null;
    if (refused !== null) {
      this.#record(row, model, row.spec.failure_status, row.spec.failure_code, null, null, callNumber);
      return errorReply(entry.wire, row.spec.failure_status, row.spec.failure_code, refused, row.spec.retry_after);
    }
    row.inFlight += 1;
    try {
      if (entry.concurrency > 0) await holdSlot(row);
      const text = `ANSWER ECHO${JSON.stringify(parsed.echo)}`;
      const usage = usageOf(parsed, text);
      this.#record(row, model, 200, null, parsed.stop, usage, callNumber);
      if (entry.wire === "openai") return openAIAnswer(model, text, usage, parsed.stream, parsed.includeUsage);
      if (entry.wire === "anthropic") return anthropicAnswer(model, text, usage, parsed.stream);
      return geminiAnswer(model, text, usage, parsed.stream);
    } finally {
      row.inFlight -= 1;
    }
  }
  #record(row, model, status, code, stop, usage, counted) {
    this.#seq += 1;
    this.#calls.push({ seq: this.#seq, provider: row.entry.id, model, status, code, stop, usage, counted });
  }
};
function holdSlot(row) {
  return new Promise((resolve) => {
    let done = false;
    let timer = null;
    const release = () => {
      if (done) return;
      done = true;
      if (timer !== null) clearTimeout(timer);
      const at = row.holds.indexOf(release);
      if (at !== -1) row.holds.splice(at, 1);
      resolve();
    };
    timer = setTimeout(release, CONCURRENCY_HOLD_MS);
    row.holds.push(release);
  });
}
function releaseHolds(row) {
  const holds = row.holds;
  row.holds = [];
  for (const release of holds) release();
}

// src/server/checks.ts
var ANSWER_PREFIX = "ANSWER ECHO";
var ECHO_KEYS = ["image_sha8", "json_mode", "max_tokens", "stops", "system_present", "system_sha8", "tools", "user_sha8"];
function check(name, pass, detail) {
  return { name, pass, detail };
}
function numberOrNull2(v) {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}
function echoFromText(text) {
  if (!text.startsWith(ANSWER_PREFIX)) return null;
  let value;
  try {
    value = JSON.parse(text.slice(ANSWER_PREFIX.length));
  } catch {
    return null;
  }
  if (!isRecord(value)) return null;
  const keys = Object.keys(value).sort();
  if (keys.length !== ECHO_KEYS.length || keys.some((key, i) => key !== ECHO_KEYS[i])) return null;
  if (typeof value.system_present !== "boolean" || typeof value.json_mode !== "boolean") return null;
  if (value.system_sha8 !== null && typeof value.system_sha8 !== "string") return null;
  if (typeof value.user_sha8 !== "string") return null;
  if (value.image_sha8 !== null && typeof value.image_sha8 !== "string") return null;
  if (value.max_tokens !== null && numberOrNull2(value.max_tokens) === null) return null;
  if (!Array.isArray(value.tools) || !value.tools.every((x) => typeof x === "string")) return null;
  if (!Array.isArray(value.stops) || !value.stops.every((x) => typeof x === "string")) return null;
  return {
    system_present: value.system_present,
    system_sha8: value.system_sha8,
    user_sha8: value.user_sha8,
    tools: value.tools,
    max_tokens: value.max_tokens,
    stops: value.stops,
    image_sha8: value.image_sha8,
    json_mode: value.json_mode
  };
}
function sameStrings(a, b) {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}
function parseSseFrames(text) {
  const frames = [];
  const normalized = text.replace(/\r\n/g, "\n");
  for (const frame of normalized.split("\n\n")) {
    if (frame.trim() === "") continue;
    let event = null;
    const data = [];
    for (const line of frame.split("\n")) {
      if (line.startsWith("event:")) event = line.slice("event:".length).trim();
      else if (line.startsWith("data:")) data.push(line.slice("data:".length).replace(/^ /, ""));
    }
    if (data.length > 0) frames.push({ event, data: data.join("\n") });
  }
  return frames;
}
function noAnswer(detail, stream) {
  return { shapeOk: false, shapeDetail: detail, streamOrder: stream ? { ok: false, detail } : null, text: "", usage: null, stopReason: null };
}
function answerText(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  const parts = [];
  for (const block of content) if (isRecord(block) && block.type === "text" && typeof block.text === "string") parts.push(block.text);
  return parts.join("");
}
function openAIJson(body) {
  let value;
  try {
    value = JSON.parse(body);
  } catch {
    return noAnswer("the entry answered a body that is not JSON", false);
  }
  if (!isRecord(value)) return noAnswer("the entry answered a JSON value that is not one object", false);
  const choices = Array.isArray(value.choices) ? value.choices : null;
  if (choices === null || choices.length === 0) return noAnswer("the completion holds no choices", false);
  const choice = choices[0];
  if (!isRecord(choice)) return noAnswer("the completion's first choice is not an object", false);
  const message = isRecord(choice.message) ? choice.message : null;
  if (message === null) return noAnswer("the first choice holds no message", false);
  if (message.role !== "assistant") return noAnswer("the first choice's message is not the assistant's", false);
  const stopReason = typeof choice.finish_reason === "string" ? choice.finish_reason : null;
  if (stopReason === null) return noAnswer("the first choice names no finish_reason", false);
  const usage = isRecord(value.usage) ? { input: numberOrNull2(value.usage.prompt_tokens), output: numberOrNull2(value.usage.completion_tokens) } : null;
  return {
    shapeOk: true,
    shapeDetail: "a well-formed openai completion",
    streamOrder: null,
    text: typeof message.content === "string" ? message.content : answerText(message.content),
    usage,
    stopReason
  };
}
function anthropicJson(body) {
  let value;
  try {
    value = JSON.parse(body);
  } catch {
    return noAnswer("the entry answered a body that is not JSON", false);
  }
  if (!isRecord(value)) return noAnswer("the entry answered a JSON value that is not one object", false);
  if (value.type !== "message") return noAnswer("the body is not an anthropic message (type is not 'message')", false);
  if (!Array.isArray(value.content)) return noAnswer("the message holds no content blocks", false);
  const stopReason = typeof value.stop_reason === "string" ? value.stop_reason : null;
  if (stopReason === null) return noAnswer("the message names no stop_reason", false);
  const usage = isRecord(value.usage) ? { input: numberOrNull2(value.usage.input_tokens), output: numberOrNull2(value.usage.output_tokens) } : null;
  return { shapeOk: true, shapeDetail: "a well-formed anthropic message", streamOrder: null, text: answerText(value.content), usage, stopReason };
}
function openAIStream(frames) {
  let text = "";
  let usage = null;
  let stopReason = null;
  let sawFinish = false;
  let sawDone = false;
  let shapeDetail = null;
  let orderDetail = null;
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    const payload = frame.data.trim();
    if (payload === "[DONE]") {
      if (sawDone) orderDetail ??= "the stream carried [DONE] twice";
      if (i !== frames.length - 1) orderDetail ??= "events followed [DONE]";
      sawDone = true;
      continue;
    }
    if (sawDone) {
      orderDetail ??= "an event followed [DONE]";
      continue;
    }
    let chunk;
    try {
      chunk = JSON.parse(payload);
    } catch {
      shapeDetail ??= `SSE event ${i + 1} is not JSON`;
      continue;
    }
    if (!isRecord(chunk)) {
      shapeDetail ??= `SSE event ${i + 1} is not one JSON object`;
      continue;
    }
    if (!Array.isArray(chunk.choices)) {
      shapeDetail ??= `SSE event ${i + 1} carries no choices`;
      continue;
    }
    if (isRecord(chunk.usage)) usage = { input: numberOrNull2(chunk.usage.prompt_tokens), output: numberOrNull2(chunk.usage.completion_tokens) };
    if (chunk.choices.length === 0) continue;
    const choice = chunk.choices[0];
    if (!isRecord(choice)) {
      shapeDetail ??= `SSE event ${i + 1}'s first choice is not an object`;
      continue;
    }
    if (isRecord(choice.delta) && typeof choice.delta.content === "string" && choice.delta.content !== "") {
      if (sawFinish) orderDetail ??= "a content delta followed the finish chunk";
      text += choice.delta.content;
    }
    if (typeof choice.finish_reason === "string") {
      if (sawFinish) orderDetail ??= "the stream carried two finish chunks";
      sawFinish = true;
      stopReason = choice.finish_reason;
    }
  }
  if (!sawFinish) orderDetail ??= "the stream carried no finish chunk";
  if (!sawDone) orderDetail ??= "the stream did not end with [DONE]";
  if (frames.length === 0) shapeDetail ??= "the answer carried no SSE events";
  return {
    shapeOk: shapeDetail === null,
    shapeDetail: shapeDetail ?? "a well-formed openai event stream",
    streamOrder: { ok: orderDetail === null, detail: orderDetail ?? "the openai events are in order and end with [DONE]" },
    text,
    usage,
    stopReason
  };
}
function anthropicStream(frames) {
  let text = "";
  let inputTokens = null;
  let outputTokens = null;
  let stopReason = null;
  let shapeDetail = null;
  let orderDetail = null;
  let started = false;
  let sawDelta = false;
  let stopped = false;
  const open = /* @__PURE__ */ new Set();
  const closed = /* @__PURE__ */ new Set();
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    if (stopped) {
      orderDetail ??= "an event followed message_stop";
      continue;
    }
    if (frame.event === null) {
      shapeDetail ??= `SSE event ${i + 1} carries no event name`;
      continue;
    }
    let data;
    try {
      data = JSON.parse(frame.data);
    } catch {
      shapeDetail ??= `SSE event ${i + 1} (${frame.event}) is not JSON`;
      continue;
    }
    if (!isRecord(data)) {
      shapeDetail ??= `SSE event ${i + 1} (${frame.event}) is not one JSON object`;
      continue;
    }
    switch (frame.event) {
      case "message_start": {
        if (started) orderDetail ??= "message_start came twice";
        else if (i !== 0) orderDetail ??= "message_start was not the first event";
        started = true;
        if (isRecord(data.message) && isRecord(data.message.usage)) inputTokens = numberOrNull2(data.message.usage.input_tokens);
        break;
      }
      case "content_block_start": {
        if (!started) orderDetail ??= "content_block_start came before message_start";
        const index = numberOrNull2(data.index);
        if (index === null) {
          shapeDetail ??= "content_block_start names no index";
          break;
        }
        if (open.has(index) || closed.has(index)) orderDetail ??= `content block ${index} started twice`;
        open.add(index);
        break;
      }
      case "content_block_delta": {
        if (!started) orderDetail ??= "content_block_delta came before message_start";
        const index = numberOrNull2(data.index);
        if (index === null) {
          shapeDetail ??= "content_block_delta names no index";
          break;
        }
        if (!open.has(index)) orderDetail ??= `content_block_delta for block ${index}, which is not open`;
        if (isRecord(data.delta) && data.delta.type === "text_delta" && typeof data.delta.text === "string") text += data.delta.text;
        break;
      }
      case "content_block_stop": {
        const index = numberOrNull2(data.index);
        if (index === null) {
          shapeDetail ??= "content_block_stop names no index";
          break;
        }
        if (!open.has(index)) orderDetail ??= `content_block_stop for block ${index}, which is not open`;
        open.delete(index);
        closed.add(index);
        break;
      }
      case "message_delta": {
        if (!started) orderDetail ??= "message_delta came before message_start";
        if (open.size > 0) orderDetail ??= "message_delta came while a content block was open";
        sawDelta = true;
        if (isRecord(data.delta) && typeof data.delta.stop_reason === "string") stopReason = data.delta.stop_reason;
        if (isRecord(data.usage)) outputTokens = numberOrNull2(data.usage.output_tokens);
        break;
      }
      case "message_stop": {
        if (!sawDelta) orderDetail ??= "message_stop came before message_delta";
        stopped = true;
        break;
      }
      case "ping":
        break;
      case "error":
        shapeDetail ??= "the stream carried an error event";
        break;
      default:
        shapeDetail ??= `unknown event ${frame.event}`;
        break;
    }
  }
  if (!started) orderDetail ??= "the stream carried no message_start";
  if (!stopped) orderDetail ??= "the stream did not end with message_stop";
  if (frames.length === 0) shapeDetail ??= "the answer carried no SSE events";
  return {
    shapeOk: shapeDetail === null,
    shapeDetail: shapeDetail ?? "a well-formed anthropic event stream",
    streamOrder: { ok: orderDetail === null, detail: orderDetail ?? "the anthropic events are in order and end with message_stop" },
    text,
    usage: inputTokens === null && outputTokens === null ? null : { input: inputTokens, output: outputTokens },
    stopReason
  };
}
function parseResponse(api, stream, response) {
  if (!response.delivered || response.body === null) return noAnswer(response.error ?? "the entry did not answer", stream);
  if (stream) {
    const frames = parseSseFrames(response.body);
    return api === "openai" ? openAIStream(frames) : anthropicStream(frames);
  }
  return api === "openai" ? openAIJson(response.body) : anthropicJson(response.body);
}
var STOP_FAMILIES = /* @__PURE__ */ new Map([
  ["stop", 0],
  ["end_turn", 0],
  ["STOP", 0],
  ["length", 1],
  ["max_tokens", 1],
  ["MAX_TOKENS", 1],
  ["tool_calls", 2],
  ["function_call", 2],
  ["tool_use", 2],
  ["content_filter", 3],
  ["refusal", 3],
  ["SAFETY", 3]
]);
function stopFamily(reason) {
  return reason === null ? null : STOP_FAMILIES.get(reason) ?? null;
}
function safeModelRow(provider, model) {
  try {
    return modelRow(provider, model);
  } catch {
    return null;
  }
}
function safeFree(provider, model) {
  try {
    return isFree(provider, model);
  } catch {
    return null;
  }
}
function evaluate(input) {
  const { request, response, calls } = input;
  const expected = parseClientEcho(request.api, input.sent);
  const parsed = parseResponse(request.api, request.stream, response);
  const echo = echoFromText(parsed.text);
  const successful = calls.filter((c) => c.status >= 200 && c.status < 300 && c.model !== null);
  const provider = successful.length > 0 ? successful[successful.length - 1] : null;
  const servedRow = provider === null ? null : safeModelRow(provider.provider, provider.model);
  const checks = [];
  const deliveryDetail = response.delivered ? `the entry answered HTTP ${response.status}` : response.error ?? "the entry did not answer";
  checks.push(check("http", response.delivered && response.status >= 200 && response.status < 300, deliveryDetail));
  checks.push(check("shape", parsed.shapeOk, parsed.shapeDetail));
  if (request.stream) checks.push(check("stream_order", parsed.streamOrder?.ok === true, parsed.streamOrder?.detail ?? "the request is not a stream"));
  checks.push(check("content", echo !== null, echo === null ? "the response did not carry the whole ANSWER text" : "the ANSWER text arrived whole"));
  const echoProblem = (detail) => echo === null ? "the response carried no echo" : detail;
  if (expected === null) {
    checks.push(check("echo_user", false, `the client body is not one ${request.api} request`));
    checks.push(check("echo_max_tokens", false, `the client body is not one ${request.api} request`));
  } else {
    if (expected.system_present) {
      checks.push(check("echo_system", echo !== null && echo.system_present && echo.system_sha8 === expected.system_sha8, echoProblem(`the provider echoed system ${echo?.system_sha8 ?? "none"}, the client sent ${expected.system_sha8 ?? "none"}`)));
    }
    checks.push(check("echo_user", echo !== null && echo.user_sha8 === expected.user_sha8, echoProblem(`the provider echoed user_sha8 ${echo?.user_sha8 ?? "none"}, the client sent ${expected.user_sha8}`)));
    if (expected.tools.length > 0) {
      checks.push(check("echo_tools", echo !== null && sameStrings(echo.tools, expected.tools), echoProblem(`the provider echoed tools [${echo?.tools.join(", ") ?? ""}], the client sent [${expected.tools.join(", ")}]`)));
    }
    checks.push(check("echo_max_tokens", echo !== null && echo.max_tokens === expected.max_tokens, echoProblem(`the provider echoed max_tokens ${String(echo?.max_tokens ?? "none")}, the client sent ${String(expected.max_tokens)}`)));
    if (expected.stops.length > 0) {
      checks.push(check("echo_stop", echo !== null && sameStrings(echo.stops, expected.stops), echoProblem(`the provider echoed stops ${JSON.stringify(echo?.stops ?? [])}, the client sent ${JSON.stringify(expected.stops)}`)));
    }
    if (expected.image_sha8 !== null) {
      checks.push(check("echo_image", echo !== null && echo.image_sha8 === expected.image_sha8, echoProblem(`the provider echoed image ${echo?.image_sha8 ?? "none"}, the client sent ${expected.image_sha8}`)));
    }
    if (expected.json_mode) {
      checks.push(check("echo_json", echo !== null && echo.json_mode === expected.json_mode, echoProblem(`the provider echoed json_mode ${String(echo?.json_mode ?? "none")}, the client asked for JSON mode`)));
    }
  }
  const clientFamily = stopFamily(parsed.stopReason);
  const providerFamily = stopFamily(provider?.stop ?? null);
  checks.push(
    check(
      "stop_reason",
      clientFamily !== null && providerFamily !== null && clientFamily === providerFamily,
      provider === null ? "no provider call answered the request" : `the entry reported ${parsed.stopReason ?? "no stop reason"}, the provider answered ${provider.stop ?? "none"}`
    )
  );
  const usageOk = (() => {
    if (provider === null || provider.usage === null || parsed.usage === null) return false;
    if (request.api === "anthropic" && request.stream) return parsed.usage.output === provider.usage.output;
    return parsed.usage.input === provider.usage.input && parsed.usage.output === provider.usage.output;
  })();
  const usageDetail = provider === null || provider.usage === null ? "no provider call answered the request" : parsed.usage === null ? "the response carried no final usage" : `the entry reported ${String(parsed.usage.input)} input and ${String(parsed.usage.output)} output tokens, the provider ${provider.usage.input} and ${provider.usage.output}`;
  checks.push(check("usage", usageOk, usageDetail));
  const freeOk = provider !== null && safeFree(provider.provider, provider.model) === true;
  checks.push(check("free_model", freeOk, provider === null ? "no provider call answered the request" : `${provider.provider}/${provider.model} is ${freeOk ? "free" : "not free"}`));
  checks.push(check("one_provider", successful.length === 1, successful.length === 1 ? "one provider call answered the request" : `${successful.length} provider calls answered the request`));
  const requirementsOk = servedRow !== null && meetsRequirements(servedRow, request.requires);
  checks.push(
    check(
      "requirements",
      requirementsOk,
      servedRow === null || provider === null ? "no provider call answered the request" : `${provider.provider}/${provider.model} ${requirementsOk ? "meets" : "does not meet"} the request's requirements`
    )
  );
  return checks;
}

// src/server/driver.ts
var REQUEST_TIMEOUT_MS = 3e4;
var VERIFY_TIMEOUT_MS = 5e3;
var MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
var CLIENT_KEY = "makefun-client";
var IN_FLIGHT_ERROR = "the trial ended while this request was in flight";
var TrialObservations = class extends Map {
  /** Null when the warm-up never ran (no peer to dial); else each header's answer, null where it was no model list. */
  catalogRoute;
  constructor(entries, catalogRoute) {
    super(entries);
    this.catalogRoute = catalogRoute;
  }
};
function isRecord2(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}
function freeModelIdsIn(text) {
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return null;
  }
  if (!isRecord2(body) || !Array.isArray(body.data)) return null;
  const ids = [];
  for (const item of body.data) {
    if (!isRecord2(item) || typeof item.id !== "string" || item.id === "") return null;
    if (item.free === false) continue;
    if (item.free !== void 0 && typeof item.free !== "boolean") return null;
    ids.push(item.id);
  }
  return ids;
}
var AnswerTooLarge = class extends Error {
  constructor() {
    super("too large");
  }
};
var AnswerError = class extends Error {
  status;
  constructor(status, message) {
    super(message);
    this.status = status;
  }
};
function urlHost(host) {
  return host.includes(":") ? `[${host}]` : host;
}
function normalizePeer(address) {
  if (address === void 0 || address === "") return null;
  if (address.startsWith("::ffff:") && address.includes(".")) return address.slice("::ffff:".length);
  return address;
}
async function readCapped(response, controller) {
  if (response.body === null) return "";
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    for (; ; ) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = Buffer.from(value);
      size += chunk.length;
      if (size > MAX_RESPONSE_BYTES) {
        controller.abort();
        throw new AnswerTooLarge();
      }
      chunks.push(chunk);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks).toString("utf8");
}
var Driver = class {
  #workload;
  #providers;
  #observations = /* @__PURE__ */ new Map();
  #begun = false;
  #aborted = false;
  #done = false;
  #index = 0;
  #peer = null;
  #port = 0;
  #inFlight = null;
  /** The warm-up's two route answers; null until the warm-up asks, and what its answers listed after. */
  #catalogRoute = null;
  constructor(workload, providers) {
    this.#workload = workload;
    this.#providers = providers;
  }
  /** Start the run against the registering entry; only the first call does anything. */
  begin(peer, port) {
    if (this.#begun) return;
    this.#begun = true;
    this.#peer = peer;
    this.#port = port;
    void this.#run().catch((err) => {
      process.stderr.write(`free-model-aggregator-01 env: the driver stopped: ${err.message}
`);
      this.#done = true;
      this.#inFlight = null;
    });
  }
  /** GET /work's answer: the request being sent (or about to be) until every one has gone. */
  work() {
    const manifest = this.#workload.manifest;
    if (this.#done || manifest.length === 0) return { done: true };
    const index = Math.min(this.#index, manifest.length - 1);
    return { done: false, next: manifest[index].id, pending: manifest.length - this.#index };
  }
  /** The trial's observations, by id, with the in-flight request as a record of its own and the route answers beside them. */
  observations() {
    const out = new TrialObservations(this.#observations, this.#catalogRoute);
    const inFlight = this.#inFlight;
    if (inFlight !== null && !out.has(inFlight.id)) {
      out.set(inFlight.id, { id: inFlight.id, sent: true, delivered: false, status: 0, error: IN_FLIGHT_ERROR, calls: this.#providers.calls().slice(inFlight.callsBefore), checks: [] });
    }
    return out;
  }
  /** Stop sending further requests (SIGTERM): the export writes what was observed so far. */
  abort() {
    this.#aborted = true;
  }
  async #run() {
    await this.#verify();
    const manifest = this.#workload.manifest;
    for (let i = 0; i < manifest.length; i++) {
      if (this.#aborted) break;
      this.#index = i;
      const request = manifest[i];
      const sent = this.#workload.bodies[request.id];
      const callsBefore = this.#providers.calls().length;
      this.#inFlight = { id: request.id, callsBefore };
      let delivered = false;
      let status = 0;
      let text = null;
      let error = null;
      try {
        const answer = await this.#send(request, sent);
        delivered = true;
        status = answer.status;
        text = answer.body;
      } catch (err) {
        if (err instanceof AnswerError) {
          delivered = true;
          status = err.status;
        }
        error = err.message;
      }
      const calls = this.#providers.calls().slice(callsBefore);
      const checks = evaluate({ request, sent, response: { delivered, status, body: text, error }, calls });
      this.#observations.set(request.id, { id: request.id, sent: true, delivered, status, error, calls, checks });
      this.#inFlight = null;
    }
    this.#index = manifest.length;
    this.#inFlight = null;
    this.#done = true;
  }
  /**
   * The brief's warm-up: GET /v1/models twice, once with an OpenAI auth header and once with an Anthropic
   * one (the Messages wire the client sends carries anthropic-version, so this does too), each answer read
   * for the free model ids it lists. Never a gate and never scored here: an answer that is missing, not 2xx,
   * over the cap or no model list is null, and the workload goes on.
   */
  async #verify() {
    const peer = this.#peer;
    if (peer === null) return;
    const url = `http://${urlHost(peer)}:${this.#port}/v1/models`;
    const answers = { openai: null, anthropic: null };
    this.#catalogRoute = answers;
    const asked = [
      ["openai", { authorization: `Bearer ${CLIENT_KEY}` }],
      ["anthropic", { "x-api-key": CLIENT_KEY, "anthropic-version": "2023-06-01" }]
    ];
    for (const [header, headers] of asked) {
      try {
        answers[header] = await this.#routeAnswer(url, headers);
      } catch {
        answers[header] = null;
      }
      const listed = answers[header];
      process.stderr.write(`free-model-aggregator-01 env: GET /v1/models with ${header === "openai" ? "Authorization: Bearer" : "x-api-key"} listed ${listed === null ? "no model list" : `${listed.length} free models`}
`);
    }
  }
  /** One GET /v1/models answer's free model ids, or null: unreachable, not 2xx, over the cap, or no model list. */
  async #routeAnswer(url, headers) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);
    try {
      let response;
      try {
        response = await fetch(url, { headers, signal: controller.signal });
      } catch {
        return null;
      }
      if (response.status < 200 || response.status >= 300) {
        try {
          await response.arrayBuffer();
        } catch {
        }
        return null;
      }
      try {
        return freeModelIdsIn(await readCapped(response, controller));
      } catch {
        return null;
      }
    } finally {
      clearTimeout(timer);
    }
  }
  /** One manifest request to the entry; the answer's status and text, or a normalized delivery error. */
  async #send(request, body) {
    const peer = this.#peer;
    if (peer === null) throw new Error("the entry is not registered");
    const path = request.api === "openai" ? "/v1/chat/completions" : "/v1/messages";
    const headers = { "content-type": "application/json" };
    if (request.api === "openai") {
      headers.authorization = `Bearer ${CLIENT_KEY}`;
    } else {
      headers["x-api-key"] = CLIENT_KEY;
      headers["anthropic-version"] = "2023-06-01";
    }
    if (request.stream) headers.accept = "text/event-stream";
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, REQUEST_TIMEOUT_MS);
    try {
      let response;
      try {
        response = await fetch(`http://${urlHost(peer)}:${this.#port}${path}`, { method: "POST", headers, body: JSON.stringify(body), signal: controller.signal });
      } catch {
        if (timedOut) throw new Error(`the entry did not answer within ${REQUEST_TIMEOUT_MS} ms`);
        throw new Error("the entry could not be reached");
      }
      try {
        const text = await readCapped(response, controller);
        return { status: response.status, body: text };
      } catch (err) {
        if (err instanceof AnswerTooLarge) throw new AnswerError(response.status, `the entry answered more than ${MAX_RESPONSE_BYTES} bytes`);
        if (timedOut) throw new AnswerError(response.status, `the entry did not answer within ${REQUEST_TIMEOUT_MS} ms`);
        throw new AnswerError(response.status, "the entry could not be reached");
      }
    } finally {
      clearTimeout(timer);
    }
  }
};

// src/server/state.ts
var NOT_SENT_ERROR = "the trial ended before this request was sent";
function failedCall(call) {
  return call.status === 402 || call.status === 429 || call.status >= 500;
}
function succeeded(call) {
  return call.status >= 200 && call.status < 300 && call.model !== null;
}
function recordOf(request, observation) {
  if (observation === void 0) {
    return {
      id: request.id,
      delivered: false,
      status: 0,
      valid: false,
      provider: null,
      model: null,
      rating_milli: 0,
      upstream_calls: 0,
      failures: [],
      checks: [],
      error: NOT_SENT_ERROR
    };
  }
  const firstCall = observation.calls[0] ?? null;
  const failures = firstCall !== null && failedCall(firstCall) ? [{ provider: firstCall.provider, model: firstCall.model, status: firstCall.status, code: firstCall.code ?? "" }] : [];
  const answered = observation.calls.filter(succeeded);
  const last = answered.length > 0 ? answered[answered.length - 1] : null;
  const lastCall = observation.calls.length > 0 ? observation.calls[observation.calls.length - 1] : null;
  const provider = last !== null ? last.provider : lastCall?.provider ?? null;
  const model = last !== null ? `${last.provider}/${last.model}` : null;
  const ratingMilli = last !== null ? modelRow(last.provider, last.model).rating_milli : 0;
  const valid = observation.checks.length > 0 && observation.checks.every((c) => c.pass);
  const failedCheck = observation.checks.find((c) => !c.pass);
  return {
    id: request.id,
    delivered: observation.delivered,
    status: observation.status,
    valid,
    provider,
    model,
    rating_milli: ratingMilli,
    upstream_calls: observation.calls.length,
    failures,
    checks: observation.checks,
    error: valid ? null : failedCheck?.detail ?? observation.error ?? "the request did not pass a check"
  };
}
function pathSuffixOf(baseUrl, path) {
  if (typeof baseUrl !== "string") return baseUrl;
  const at = baseUrl.indexOf(path);
  return at === -1 ? path : baseUrl.slice(at);
}
function normalizedCatalog(catalog) {
  if (catalog === null) return null;
  const providers = catalog.providers;
  if (!Array.isArray(providers)) return catalog;
  const normalized = providers.map((raw) => {
    if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return raw;
    const entry = raw;
    if (typeof entry.id !== "string") return raw;
    let path;
    try {
      path = providerById(entry.id).path;
    } catch {
      return raw;
    }
    return { ...entry, base_url: pathSuffixOf(entry.base_url, path) };
  });
  return { ...catalog, providers: normalized };
}
function freeModelIdsOf(catalog) {
  if (catalog === null) return null;
  const providers = catalog.providers;
  if (!Array.isArray(providers)) return null;
  const ids = [];
  for (const raw of providers) {
    if (raw === null || typeof raw !== "object" || Array.isArray(raw)) continue;
    const models = raw.models;
    if (!Array.isArray(models)) continue;
    for (const model of models) {
      if (model === null || typeof model !== "object" || Array.isArray(model)) continue;
      const entry = model;
      if (entry.free === true && typeof entry.id === "string") ids.push(entry.id);
    }
  }
  return ids;
}
function sameIdSet(a, b) {
  const got = new Set(a);
  const want = new Set(b);
  if (got.size !== want.size) return false;
  for (const id of got) if (!want.has(id)) return false;
  return true;
}
function catalogRouteOf(catalog, observations) {
  const answers = observations instanceof TrialObservations ? observations.catalogRoute : null;
  if (answers === null) return null;
  const free = freeModelIdsOf(catalog);
  const matched = (ids) => ids !== null && free !== null && sameIdSet(ids, free);
  return { openai: matched(answers.openai), anthropic: matched(answers.anthropic) };
}
function buildTrialState(o) {
  const requests = o.manifest.map((request) => recordOf(request, o.observations.get(request.id)));
  const checks = requests.reduce((n, r) => n + r.checks.length, 0);
  const checksPassed = requests.reduce((n, r) => n + r.checks.filter((c) => c.pass).length, 0);
  const totals = {
    requests: requests.length,
    delivered: requests.filter((r) => r.delivered).length,
    valid: requests.filter((r) => r.valid).length,
    upstream_calls: requests.reduce((n, r) => n + r.upstream_calls, 0),
    checks,
    checks_passed: checksPassed,
    failover_requests: requests.filter((r) => r.failures.length > 0).length,
    failover_handled: requests.filter((r) => r.failures.length > 0 && r.valid).length
  };
  return { schema: STATE_SCHEMA, requests, catalog: normalizedCatalog(o.catalog), catalog_route: catalogRouteOf(o.catalog, o.observations), totals };
}

// src/server/main.ts
var MAX_BODY_BYTES = 2 * 1024 * 1024;
var MAX_NAME = 200;
var isRecord3 = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
function fail(where, why) {
  throw new Error(`${where} ${why}`);
}
function recordOf2(where, value) {
  if (!isRecord3(value)) fail(where, "is not one JSON object");
  return value;
}
function exactKeys(where, o, keys) {
  const got = Object.keys(o).sort();
  const want = [...keys].sort();
  if (got.join(",") !== want.join(",")) fail(where, `holds the keys ${got.join(", ") || "none"}, not ${want.join(", ")}`);
}
function textOf(where, value) {
  if (typeof value !== "string") fail(where, "is not a string");
  return value;
}
function nameOf(where, value) {
  if (typeof value !== "string" || value === "" || value.length > MAX_NAME) fail(where, `is not a non-empty string of at most ${MAX_NAME} characters`);
  return value;
}
function intOf(where, value, min, max) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < min || value > max) fail(where, `is not an integer from ${min} to ${max}`);
  return value;
}
function boolOf(where, value) {
  if (typeof value !== "boolean") fail(where, "is not a boolean");
  return value;
}
function listOf(where, value) {
  if (!Array.isArray(value)) fail(where, "is not an array");
  return value;
}
function jsonFile(where, source) {
  let value;
  try {
    value = JSON.parse(source);
  } catch (err) {
    fail(where, `is not JSON: ${err.message}`);
  }
  return recordOf2(where, value);
}
function wireOf(where, value) {
  if (value !== "openai" && value !== "anthropic" && value !== "gemini") fail(where, `is not one of openai, anthropic or gemini`);
  return value;
}
function authOf(where, value) {
  if (value !== "bearer" && value !== "x-api-key" && value !== "x-goog-api-key" && value !== "none") fail(where, "is not a known auth scheme");
  return value;
}
function modelOfJson(where, value) {
  const o = recordOf2(where, value);
  exactKeys(where, o, ["id", "free", "context_length", "tools", "vision", "json", "rating_milli"]);
  return {
    id: nameOf(`${where}.id`, o.id),
    free: boolOf(`${where}.free`, o.free),
    context_length: intOf(`${where}.context_length`, o.context_length, 1, 1e8),
    tools: boolOf(`${where}.tools`, o.tools),
    vision: boolOf(`${where}.vision`, o.vision),
    json: boolOf(`${where}.json`, o.json),
    rating_milli: intOf(`${where}.rating_milli`, o.rating_milli, 0, 2e3)
  };
}
function providerEntryOf(where, value) {
  const o = recordOf2(where, value);
  exactKeys(where, o, ["id", "name", "wire", "auth", "path", "key_env", "key", "budget", "concurrency", "fail_calls", "outage_from", "models"]);
  const path = textOf(`${where}.path`, o.path);
  if (!/^\/p\/[A-Za-z0-9._-]+$/.test(path)) fail(`${where}.path`, "is not /p/<id>");
  return {
    id: nameOf(`${where}.id`, o.id),
    name: textOf(`${where}.name`, o.name),
    wire: wireOf(`${where}.wire`, o.wire),
    auth: authOf(`${where}.auth`, o.auth),
    path,
    key_env: textOf(`${where}.key_env`, o.key_env),
    key: textOf(`${where}.key`, o.key),
    budget: intOf(`${where}.budget`, o.budget, 1, 1e6),
    concurrency: intOf(`${where}.concurrency`, o.concurrency, 0, 1e3),
    fail_calls: listOf(`${where}.fail_calls`, o.fail_calls).map((v, i) => intOf(`${where}.fail_calls[${i}]`, v, 1, 1e6)),
    outage_from: o.outage_from === null ? null : intOf(`${where}.outage_from`, o.outage_from, 1, 1e6),
    models: listOf(`${where}.models`, o.models).map((m, i) => modelOfJson(`${where}.models[${i}]`, m))
  };
}
function parseProvidersFile(source) {
  const o = jsonFile(PROVIDERS_FILE, source);
  exactKeys(PROVIDERS_FILE, o, ["schema", "providers"]);
  if (o.schema !== PROVIDERS_SCHEMA) fail(PROVIDERS_FILE, `schema is not ${PROVIDERS_SCHEMA}`);
  const providers = listOf(`${PROVIDERS_FILE}: providers`, o.providers).map((raw, i) => providerEntryOf(`${PROVIDERS_FILE}: providers[${i}]`, raw));
  const seen = /* @__PURE__ */ new Set();
  for (const entry of providers) {
    if (seen.has(entry.id)) fail(PROVIDERS_FILE, `names the provider ${entry.id} twice`);
    seen.add(entry.id);
    try {
      providerById(entry.id);
    } catch (err) {
      fail(PROVIDERS_FILE, err.message);
    }
    for (const model of entry.models) {
      try {
        modelRow(entry.id, model.id);
      } catch (err) {
        fail(PROVIDERS_FILE, err.message);
      }
    }
  }
  return { schema: PROVIDERS_SCHEMA, providers };
}
function requirementOf(where, value) {
  if (value === void 0) return {};
  const o = recordOf2(where, value);
  for (const key of Object.keys(o)) if (key !== "tools" && key !== "vision" && key !== "json" && key !== "min_context") fail(where, `has an unknown key ${key}`);
  const requires = {};
  if (o.tools !== void 0) requires.tools = boolOf(`${where}.tools`, o.tools);
  if (o.vision !== void 0) requires.vision = boolOf(`${where}.vision`, o.vision);
  if (o.json !== void 0) requires.json = boolOf(`${where}.json`, o.json);
  if (o.min_context !== void 0) requires.min_context = intOf(`${where}.min_context`, o.min_context, 1, 1e8);
  return requires;
}
function workloadRequestOf(where, value) {
  const o = recordOf2(where, value);
  exactKeys(where, o, ["id", "api", "stream", "weight", "requires"]);
  const api = o.api === "openai" || o.api === "anthropic" ? o.api : fail(`${where}.api`, "is not openai or anthropic");
  const weight = intOf(`${where}.weight`, o.weight, 1, 2);
  return {
    id: nameOf(`${where}.id`, o.id),
    api,
    stream: boolOf(`${where}.stream`, o.stream),
    weight: weight === 2 ? 2 : 1,
    requires: requirementOf(`${where}.requires`, o.requires)
  };
}
function parseWorkloadFile(source) {
  const o = jsonFile(WORKLOAD_FILE, source);
  exactKeys(WORKLOAD_FILE, o, ["schema", "manifest", "bodies"]);
  if (o.schema !== WORKLOAD_SCHEMA) fail(WORKLOAD_FILE, `schema is not ${WORKLOAD_SCHEMA}`);
  const manifest = listOf(`${WORKLOAD_FILE}: manifest`, o.manifest).map((raw, i) => workloadRequestOf(`${WORKLOAD_FILE}: manifest[${i}]`, raw));
  const bodiesRaw = recordOf2(`${WORKLOAD_FILE}: bodies`, o.bodies);
  const bodies = {};
  const seen = /* @__PURE__ */ new Set();
  for (const request of manifest) {
    if (seen.has(request.id)) fail(WORKLOAD_FILE, `names the request ${request.id} twice`);
    seen.add(request.id);
    if (!Object.hasOwn(bodiesRaw, request.id)) fail(`${WORKLOAD_FILE}: bodies`, `holds no body for ${request.id}`);
    const body = recordOf2(`${WORKLOAD_FILE}: bodies.${request.id}`, bodiesRaw[request.id]);
    if (body.stream === true !== request.stream) fail(`${WORKLOAD_FILE}: bodies.${request.id}`, `is ${body.stream === true ? "a stream" : "not a stream"}, and the manifest says ${request.stream ? "stream" : "not stream"}`);
    bodies[request.id] = body;
  }
  return { schema: WORKLOAD_SCHEMA, manifest, bodies };
}
function jsonText(value) {
  return `${JSON.stringify(value, null, 2)}
`;
}
function replyOf(status, value) {
  const body = Buffer.from(`${JSON.stringify(value)}
`);
  return { status, headers: { "content-type": "application/json" }, body };
}
function writeAtomic(file, text) {
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, text);
  renameSync(tmp, file);
}
function sendReply(res, reply) {
  res.writeHead(reply.status, { ...reply.headers, "content-length": String(reply.body.length) });
  res.end(reply.body);
}
function urlHost2(host) {
  return host.includes(":") ? `[${host}]` : host;
}
function start() {
  const env = process.env;
  const processDriver = env.MAKEFUN_STATE_DIR !== void 0 && env.MAKEFUN_STATE_DIR !== "";
  const dataDir = env.MAKEFUN_ENV_DATA_DIR || "/env-data";
  const stateDir = processDriver ? env.MAKEFUN_STATE_DIR : "/state";
  const providersFile = parseProvidersFile(readFileSync(join(dataDir, PROVIDERS_FILE), "utf8"));
  const workload = parseWorkloadFile(readFileSync(join(dataDir, WORKLOAD_FILE), "utf8"));
  const providers = new Providers(providersFile);
  const driver = new Driver(workload, providers);
  mkdirSync(stateDir, { recursive: true });
  const callLog = join(stateDir, "calls.ndjson");
  writeFileSync(callLog, "");
  let seq = 0;
  let catalog = null;
  let control = Promise.resolve();
  let bound = { host: "", port: 0 };
  const logCall = (method, path, status) => {
    seq += 1;
    appendFileSync(callLog, `${JSON.stringify({ seq, method, path, status })}
`);
  };
  const register = (peer, method, raw, tooLarge) => {
    if (method !== "POST") return replyOf(405, { error: "method_not_allowed", message: `${REGISTER_PATH} takes POST` });
    if (tooLarge || raw === null) return replyOf(413, { error: "too_large", message: `a request body holds at most ${MAX_BODY_BYTES} bytes` });
    let value;
    try {
      value = JSON.parse(raw.toString("utf8"));
    } catch {
      return replyOf(400, { error: "bad_register", message: "the body is not JSON" });
    }
    const o = isRecord3(value) ? value : null;
    if (o === null) return replyOf(400, { error: "bad_register", message: "the body is not one JSON object" });
    const port = o.port;
    if (typeof port !== "number" || !Number.isSafeInteger(port) || port < 1 || port > 65535) return replyOf(400, { error: "bad_register", message: "port is not a port" });
    const address = normalizePeer(peer);
    if (address !== null) driver.begin(address, port);
    if (o.protocol_version !== PROTOCOL_VERSION) return replyOf(400, { error: "bad_register", message: `protocol_version is not ${PROTOCOL_VERSION}` });
    if (!isRecord3(o.catalog)) return replyOf(400, { error: "bad_register", message: "catalog is not one JSON object" });
    if (catalog === null) catalog = o.catalog;
    return replyOf(200, { ok: true, requests: workload.manifest.length });
  };
  const work = (method) => {
    if (method !== "GET") return replyOf(405, { error: "method_not_allowed", message: `${WORK_PATH} takes GET` });
    return replyOf(200, driver.work());
  };
  const instance = (method, hostHeader) => {
    if (method !== "GET") return replyOf(405, { error: "method_not_allowed", message: `${INSTANCE_PATH} takes GET` });
    const fallback = `${urlHost2(bound.host === "" || bound.host === "0.0.0.0" ? "127.0.0.1" : bound.host)}:${bound.port}`;
    const host = hostHeader !== void 0 && hostHeader !== "" ? hostHeader : fallback;
    const base = `http://${host}`;
    return replyOf(200, {
      schema: PROVIDERS_SCHEMA,
      providers: providersFile.providers.map((p) => ({ id: p.id, name: p.name, wire: p.wire, auth: p.auth, key_env: p.key_env, key: p.key, base_url: `${base}${p.path}` })),
      workload: { schema: WORKLOAD_SCHEMA, manifest: workload.manifest }
    });
  };
  const server = createServer((req, res) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size <= MAX_BODY_BYTES) chunks.push(chunk);
    });
    req.on("end", () => {
      const method = req.method ?? "GET";
      const url = new URL(req.url ?? "/", "http://env");
      const path = url.pathname;
      const raw = size > MAX_BODY_BYTES ? null : Buffer.concat(chunks);
      const tooLarge = size > MAX_BODY_BYTES;
      const reply = (status, value) => {
        const answer = replyOf(status, value);
        logCall(method, path, answer.status);
        try {
          sendReply(res, answer);
        } catch {
        }
      };
      try {
        if (path === REGISTER_PATH || path === WORK_PATH) {
          control = control.then(() => {
            let answer;
            try {
              answer = path === REGISTER_PATH ? register(req.socket.remoteAddress ?? "", method, raw, tooLarge) : work(method);
            } catch (err) {
              answer = replyOf(500, { error: "internal", message: err.message });
            }
            logCall(method, path, answer.status);
            try {
              sendReply(res, answer);
            } catch {
            }
          }).catch(() => void 0);
          return;
        }
        if (path === INSTANCE_PATH) {
          const answer = instance(method, req.headers.host);
          logCall(method, path, answer.status);
          sendReply(res, answer);
          return;
        }
        if (path.startsWith("/p/")) {
          const id = path.slice("/p/".length).split("/")[0] ?? "";
          void providers.handle(id, { method, path, headers: req.headers, query: url.searchParams, body: raw, bodyTooLarge: tooLarge }).then((answer) => {
            logCall(method, path, answer.status);
            try {
              sendReply(res, answer);
            } catch {
            }
          }).catch((err) => reply(500, { error: "internal", message: err.message }));
          return;
        }
        reply(404, { error: "not_found", message: `no route ${method} ${path}: POST ${REGISTER_PATH}, GET ${WORK_PATH}, GET ${INSTANCE_PATH} or a provider under /p/<id>/` });
      } catch (err) {
        reply(500, { error: "internal", message: err.message });
      }
    });
  });
  process.on("SIGTERM", () => {
    driver.abort();
    try {
      const exportDir = join(stateDir, "export");
      mkdirSync(exportDir, { recursive: true });
      writeAtomic(join(exportDir, STATE_FILE), jsonText(buildTrialState({ manifest: workload.manifest, observations: driver.observations(), catalog })));
    } catch (err) {
      process.stderr.write(`free-model-aggregator-01 env: the export failed: ${err.message}
`);
      process.exit(1);
    }
    server.close();
    process.exit(0);
  });
  envListen(server, env).then((at) => {
    bound = at;
    writeAtomic(join(stateDir, "ready"), `${JSON.stringify({ schema: READY_SCHEMA, host: at.host, port: at.port })}
`);
    process.stdout.write(`free-model-aggregator-01 env: ${providersFile.providers.length} providers and ${workload.manifest.length} requests on ${at.host}:${at.port}
`);
  }).catch((err) => {
    process.stderr.write(`${err.message}
`);
    process.exit(1);
  });
}
try {
  start();
} catch (err) {
  process.stderr.write(`${err.message}
`);
  process.exit(1);
}
export {
  parseProvidersFile,
  parseWorkloadFile
};
