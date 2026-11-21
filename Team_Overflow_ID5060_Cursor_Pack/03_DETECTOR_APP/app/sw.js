// Minimal offline cache so the app opens in the kitchen without network.
const C = "ubaal-v1", FILES = ["./", "./index.html", "./style.css", "./app.js", "./core.js", "./manifest.webmanifest"];
self.addEventListener("install", e => e.waitUntil(caches.open(C).then(c => c.addAll(FILES))));
self.addEventListener("fetch", e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
