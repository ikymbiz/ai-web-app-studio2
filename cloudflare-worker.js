/** AI Web Studio Cloudflare Worker
 * APIキーとシステムプロンプトをサーバー側へ移すための中継Worker。
 * Endpoints: POST /api/ai, GET /api/templates
 */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });
    const url = new URL(request.url);
    if (url.pathname === '/api/templates') return json(readTemplates(env));
    if (url.pathname !== '/api/ai' || request.method !== 'POST') {
      return json({ ok: true, service: 'AI Web Studio Worker', endpoints: ['/api/ai', '/api/templates'] });
    }
    try {
      const body = await request.json();
      const route = parseRoute(body.route || body.model || 'gemini:gemini-2.5-flash');
      const prompt = buildPrompt(body, env);
      const text = await callModel(route, prompt, body.images || [], env);
      return json({ ok: true, text, provider: route.provider, model: route.model });
    } catch (error) {
      return json({ ok: false, error: error.message || String(error) }, 500);
    }
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' }
  });
}
function parseRoute(route) {
  const raw = String(route || '').trim();
  const idx = raw.indexOf(':');
  return { provider: (idx >= 0 ? raw.slice(0, idx) : 'gemini').toLowerCase(), model: idx >= 0 ? raw.slice(idx + 1) : raw };
}
function buildPrompt(body, env) {
  const system = env.SYSTEM_PROMPT || '';
  return system ? `# Server System Prompt\n${system}\n\n# Task Type\n${body.taskType || 'generic'}\n\n# User/Client Prompt\n${body.prompt || ''}` : (body.prompt || '');
}
function readTemplates(env) {
  if (env.TEMPLATE_CATALOG_JSON) {
    try { return JSON.parse(env.TEMPLATE_CATALOG_JSON); } catch (_) {}
  }
  return { templates: [
    { id: 'landing-basic-free', name: 'Landing Basic', icon: '🚀', description: '無料のリモートLPテンプレート', paid: false, files: { 'index.html': '<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Landing</title></head><body><main><h1>Hello AI Web Studio</h1><p>Remote template loaded.</p></main></body></html>' } },
    { id: 'dashboard-pro-paid', name: 'Dashboard Pro', icon: '📊', description: '課金ロック表示の例', paid: true, files: { 'index.html': '<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dashboard Pro</title></head><body><h1>Paid Dashboard</h1></body></html>' } }
  ] };
}
async function callModel(route, prompt, images, env) {
  if (route.provider === 'server') {
    const delegated = parseRoute(env.DEFAULT_MODEL_ROUTE || route.model || 'gemini:gemini-2.5-flash');
    return callModel(delegated, prompt, images, env);
  }
  if (route.provider === 'gemini') return callGemini(route.model, prompt, images, env.GEMINI_API_KEY);
  if (route.provider === 'claude' || route.provider === 'anthropic') return callClaude(route.model, prompt, images, env.ANTHROPIC_API_KEY);
  if (route.provider === 'openai') return callOpenAICompatible('https://api.openai.com/v1/chat/completions', route.model, prompt, images, env.OPENAI_API_KEY);
  if (route.provider === 'xai') return callOpenAICompatible('https://api.x.ai/v1/chat/completions', route.model, prompt, images, env.XAI_API_KEY);
  if (route.provider === 'groq') return callOpenAICompatible('https://api.groq.com/openai/v1/chat/completions', route.model, prompt, images, env.GROQ_API_KEY);
  if (route.provider === 'custom') {
    const base = (env.CUSTOM_BASE_URL || '').replace(/\/$/, '');
    if (!base) throw new Error('CUSTOM_BASE_URL is not set');
    return callOpenAICompatible(`${base}/chat/completions`, route.model, prompt, images, env.CUSTOM_API_KEY);
  }
  throw new Error(`Unsupported provider: ${route.provider}`);
}
async function callGemini(model, prompt, images, key) {
  if (!key) throw new Error('GEMINI_API_KEY is not set');
  const parts = [{ text: prompt }];
  for (const img of images || []) parts.push({ inline_data: { mime_type: img.mime, data: img.base64 } });
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${key}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ role: 'user', parts }] }) });
  if (!res.ok) throw new Error(`Gemini API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
}
async function callClaude(model, prompt, images, key) {
  if (!key) throw new Error('ANTHROPIC_API_KEY is not set');
  const content = [{ type: 'text', text: prompt }];
  for (const img of images || []) content.push({ type: 'image', source: { type: 'base64', media_type: img.mime, data: img.base64 } });
  const res = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model, max_tokens: 8192, messages: [{ role: 'user', content }] }) });
  if (!res.ok) throw new Error(`Claude API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content?.map(p => p.text || '').join('') || '';
}
async function callOpenAICompatible(endpoint, model, prompt, images, key) {
  if (!key) throw new Error('API key is not set');
  const content = images?.length ? [{ type: 'text', text: prompt }, ...images.map(img => ({ type: 'image_url', image_url: { url: `data:${img.mime};base64,${img.base64}` } }))] : prompt;
  const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` }, body: JSON.stringify({ model, messages: [{ role: 'user', content }], temperature: 0.2 }) });
  if (!res.ok) throw new Error(`OpenAI-compatible API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}
