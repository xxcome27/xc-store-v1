/* ===============================
   XC-STORE PWA
   AUTO UPDATE LEVEL 3
   =============================== */

const CACHE_NAME = "xc-store-v2"; // NAIKKAN SETIAP ADA UPDATE
const STATIC_CACHE = "xc-static-v2";

const ASSETS = [
  "./style.css",
  "./script.js",
  "./manifest.json",

  // icons
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",

  // external
  "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
];

/* ===============================
   INSTALL (PAKSA UPDATE)
   =============================== */
self.addEventListener("install", event => {
  self.skipWaiting(); // 🔥 LEVEL 3
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(ASSETS))
  );
});

/* ===============================
   ACTIVATE (AMBIL ALIH LANGSUNG)
   =============================== */
self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // 🔥 LEVEL 3
      caches.keys().then(keys =>
        Promise.all(
          keys
            .filter(k => k !== STATIC_CACHE)
            .map(k => caches.delete(k))
        )
      )
    ])
  );
});

/* ===============================
   FETCH STRATEGY
   =============================== */
self.addEventListener("fetch", event => {

  // 1️⃣ HTML → SELALU AMBIL TERBARU
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // 2️⃣ STATIC FILE → CACHE FIRST
  event.respondWith(
    caches.match(event.request).then(res => {
      return (
        res ||
        fetch(event.request).then(fetchRes => {
          return caches.open(STATIC_CACHE).then(cache => {
            cache.put(event.request, fetchRes.clone());
            return fetchRes;
          });
        })
      );
    })
  );
});