/* AI Web Studio — Service Worker
 * Strategy:
 *   - HTML / prompts.json: network-first（更新を素早く取り込む）→ 失敗時はキャッシュ
 *   - CDN (fonts, scripts): stale-while-revalidate（キャッシュ即返却 + 裏で更新）
 *   - その他: cache-first
 * 注意: 単一ファイル運用なので、ハッシュ付きURLは持たない。バージョンアップ時はCACHE_NAMEを上げる。
 */
const CACHE_NAME = 'ai-web-studio-v3-3-tabs-skills-models-v29-2-doc-policy-aligned';
const APP_SHELL = [
    './',
    './index.html',
    './prompts.json',
    './docs/PRINCIPLE.md',
    './docs/DEVELOPMENT_RULES.md',
    './docs/SYSTEM_DESIGN.md',
    './docs/FAILURE_LOG.md',
    './docs/HANDOVER.md',
    './tasks/todo.md',
    './tasks/lessons.md',
    './models/models.json',
    './js/ai-feedback-view-logic.js',
    './js/ai-task-priority-logic.js',
    './js/ai-verify-logic.js',
    './js/ai-bug-analysis-logic.js',
    './js/ai-task-runner.js',
    './js/ai-chat-logic.js',
    './js/ai-code-logic.js',
    './js/ai-debug-logic.js',
    './skills/admin-skills.json',
    './skills/admin-skills.index.json'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL).catch(() => {}))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        // 古いキャッシュを掃除
        const keys = await caches.keys();
        await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
        await self.clients.claim();
    })());
});

function isAppShell(url) {
    return APP_SHELL.some(p => url.pathname.endsWith(p.replace('./', '/')) || url.pathname === '/' || url.pathname === '/index.html');
}

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);

    // 1) AI API / 自前 Worker などのオンライン必須URLは触らない
    const onlineOnlyHosts = [
        'generativelanguage.googleapis.com',
        'api.openai.com',
        'api.anthropic.com',
        'api.x.ai',
        'api.groq.com',
        'api.github.com',
        'green-credit-a6fb.ikymbiz.workers.dev'
    ];
    if (onlineOnlyHosts.includes(url.host)) return;

    // 2) App Shell（HTML / prompts.json）: network-first
    if (url.origin === self.location.origin && isAppShell(url)) {
        event.respondWith(networkFirst(req));
        return;
    }

    // 3) CDN（fonts, jsDelivr など）: stale-while-revalidate
    if (url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com' ||
        url.host === 'cdn.jsdelivr.net' || url.host === 'esm.sh') {
        event.respondWith(staleWhileRevalidate(req));
        return;
    }

    // 4) その他同一オリジンリソース: cache-first
    if (url.origin === self.location.origin) {
        event.respondWith(cacheFirst(req));
    }
});

async function networkFirst(request) {
    try {
        const res = await fetch(request);
        if (res && res.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, res.clone());
        }
        return res;
    } catch (e) {
        const cached = await caches.match(request);
        if (cached) return cached;
        return new Response('Offline and no cache available', { status: 503, statusText: 'Service Unavailable' });
    }
}

async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
        const res = await fetch(request);
        if (res && res.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, res.clone());
        }
        return res;
    } catch (e) {
        return new Response('Offline', { status: 503 });
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    const fetchPromise = fetch(request).then(res => {
        if (res && res.ok) cache.put(request, res.clone());
        return res;
    }).catch(() => cached);
    return cached || fetchPromise;
}

// ページからのメッセージ受信（任意：手動でキャッシュクリアなど）
self.addEventListener('message', (event) => {
    if (!event.data) return;
    if (event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME).then(() => {
            event.ports[0]?.postMessage({ ok: true });
        });
    }
});
