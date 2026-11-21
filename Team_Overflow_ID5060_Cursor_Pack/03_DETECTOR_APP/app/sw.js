// Minimal offline cache so the app opens in the kitchen without network.
const C = "ubaal-v2", FILES = ["./", "./index.html", "./style.css", "./app.js", "./core.js", "./alerts.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => e.waitUntil(caches.open(C).then(c => c.addAll(FILES))));
self.addEventListener("fetch", e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
