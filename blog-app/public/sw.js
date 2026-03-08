const CACHE_NAME = "inside-react-study-pwa-v1";

function getBasePath() {
  const scopePath = new URL(self.registration.scope).pathname.replace(/\/$/, "");
  return scopePath === "" || scopePath === "/" ? "" : scopePath;
}

function appUrl(pathname = "/") {
  return `${getBasePath()}${pathname}`;
}

function iconUrl(fileName) {
  return new URL(appUrl(`/${fileName}`), self.location.origin).toString();
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const appShell = [
        appUrl("/"),
        appUrl("/manifest.webmanifest"),
        appUrl("/apple-touch-icon.png"),
        appUrl("/pwa-192x192.png"),
        appUrl("/pwa-512x512.png"),
        iconUrl("favicon.ico"),
      ];

      await Promise.allSettled(
        appShell.map(async (url) => {
          const response = await fetch(url, { cache: "reload" });
          if (response.ok) {
            await cache.put(url, response.clone());
          }
        }),
      );

      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
      await self.clients.claim();
    })(),
  );
});

async function handleNavigationRequest(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return (
      (await cache.match(request)) ||
      (await cache.match(appUrl("/"))) ||
      Response.error()
    );
  }
}

async function handleAssetRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  const networkResponsePromise = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        await cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cachedResponse) {
    return cachedResponse;
  }

  return (await networkResponsePromise) || Response.error();
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(event.request));
    return;
  }

  event.respondWith(handleAssetRequest(event.request));
});
