const CACHE_PREFIX = "jieya-app-shell-";
const CACHE_NAME = "jieya-app-shell-beb5826e19755938";
const ROOT_PATH = "/Project-JIEYA-Preview/";
const PRECACHE_PATHS = Object.freeze(["/Project-JIEYA-Preview/","/Project-JIEYA-Preview/index.html","/Project-JIEYA-Preview/manifest.webmanifest","/Project-JIEYA-Preview/jieya-icon.svg","/Project-JIEYA-Preview/jieya-icon-192.png","/Project-JIEYA-Preview/jieya-icon-512.png","/Project-JIEYA-Preview/assets/Phosphor-DtdjzkpE.woff2","/Project-JIEYA-Preview/assets/index-32vrOc1h.js","/Project-JIEYA-Preview/assets/index-CWOGoLpn.css"]);
const PRECACHE_PATH_SET = new Set(PRECACHE_PATHS);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.all(
          PRECACHE_PATHS.map((path) =>
            cache.add(new URL(path, self.location.origin).href),
          ),
        ),
      )
      .then(() => self.skipWaiting())
      .catch(async (error) => {
        await caches.delete(CACHE_NAME);
        throw error;
      }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter(
              (name) =>
                name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME,
            )
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    if (url.pathname !== ROOT_PATH) {
      return;
    }
    event.respondWith(
      fetch(request).catch(() =>
        caches
          .match(new URL(ROOT_PATH, self.location.origin).href)
          .then((response) => response ?? Response.error()),
      ),
    );
    return;
  }

  if (url.search !== "" || !PRECACHE_PATH_SET.has(url.pathname)) {
    return;
  }
  event.respondWith(
    caches
      .match(url.href)
      .then((response) => response ?? fetch(request)),
  );
});
