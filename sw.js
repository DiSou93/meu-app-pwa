const CACHE_NAME = "meu-app-v4";
const APP_SHELL = [
    "./",
    "./index.html",
    "./style.css?v=4",
    "./app.js",
    "./manifest.json"
];
const OPTIONAL_ASSETS = [
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        // Os arquivos necessários para abrir e usar o app são obrigatórios.
        await cache.addAll(APP_SHELL);
        // Ícones são complementares e não devem impedir a instalação offline.
        await Promise.all(OPTIONAL_ASSETS.map(async (url) => {
            try {
                await cache.add(url);
            } catch (erro) {
                console.warn("[SW] Ícone não pôde ser armazenado:", url, erro);
            }
        }));
        await self.skipWaiting();
    })());
});

self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {
        const nomes = await caches.keys();
        await Promise.all(nomes.map((nome) => {
            if (nome.startsWith("meu-app-") && nome !== CACHE_NAME) {
                return caches.delete(nome);
            }
        }));
        await self.clients.claim();
    })());
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Deixa requisições externas e operações que não sejam GET fora do cache local.
    if (request.method !== "GET" || url.origin !== self.location.origin) return;

    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const isNavigation = request.mode === "navigate";
        const cacheKey = isNavigation ? "./index.html" : request;
        const cached = await cache.match(cacheKey);
        if (cached) return cached;

        try {
            const response = await fetch(request);
            if (response && response.ok && response.type === "basic") {
                await cache.put(request, response.clone());
            }
            return response;
        } catch (erro) {
            // Se a navegação não estiver no cache exato, abre o shell local do app.
            if (isNavigation) {
                const indexLocal = await cache.match("./index.html");
                if (indexLocal) return indexLocal;
            }
            return new Response("Sem conexão. Abra o aplicativo novamente quando os arquivos estiverem disponíveis no aparelho.", {
                status: 503,
                headers: { "Content-Type": "text/plain; charset=utf-8" }
            });
        }
    })());
});
