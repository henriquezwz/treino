// Caderno de Treino: sempre busca a versão nova na rede (sem cache); sem internet, abre a última guardada.
const CACHE = "treino-v1";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url); if (u.origin !== location.origin) return;
  const fresco = r.mode === "navigate" || /\/(index\.html)?$|version\.json$/.test(u.pathname);
  e.respondWith(fetch(fresco ? new Request(r.url, {cache: "no-store", credentials: "same-origin"}) : r)
    .then(res => { if (res.ok && r.mode === "navigate") { const c = res.clone(); caches.open(CACHE).then(k => k.put("./", c)); } return res; })
    .catch(() => caches.match(r).then(x => x || caches.match("./"))));
});
