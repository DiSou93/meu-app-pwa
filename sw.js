// Alterar esta versão e APP_VERSION em app.js juntas em cada publicação.
const APP_VERSION = '18.0';
const CACHE_PREFIX = `meu-app-${encodeURIComponent(self.registration.scope)}-`;
const CACHE_NAME = `${CACHE_PREFIX}${APP_VERSION}`;
const ASSETS_TO_CACHE = ['./', './index.html', './style.css', './app.js', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(
    ASSETS_TO_CACHE.map(path => new Request(new URL(path, self.registration.scope), {cache: 'reload'}))
  )));
  // Só fica pronto após download completo; aguarda autorização ou fechamento do app antigo.
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') event.waitUntil(self.skipWaiting());
  if (event.data?.type === 'GET_VERSION') event.ports[0]?.postMessage({version: APP_VERSION});
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const nomes = await caches.keys();
    await Promise.all(nomes.filter(nome => nome.startsWith(CACHE_PREFIX) && nome !== CACHE_NAME).map(nome => caches.delete(nome)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const resposta = await cache.match(event.request);
    if (resposta) return resposta;
    if (event.request.mode === 'navigate' && url.pathname === new URL(self.registration.scope).pathname) {
      const inicio = await cache.match(new URL('./index.html', self.registration.scope).href);
      if (inicio) return inicio;
    }
    return fetch(event.request);
  })());
});
