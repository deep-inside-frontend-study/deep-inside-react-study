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

function buildNotificationPayload(data) {
  if (!data) {
    return {
      title: "Inside React Study",
      body: "새로운 업데이트가 도착했습니다.",
      url: appUrl("/"),
    };
  }

  try {
    const text = data.text();
    const parsed = JSON.parse(text);
    return {
      title: parsed.title || "Inside React Study",
      body: parsed.body || "새로운 업데이트가 도착했습니다.",
      url: parsed.url || appUrl("/"),
      tag: parsed.tag || "study-update",
    };
  } catch {
    return {
      title: "Inside React Study",
      body: data.text() || "새로운 업데이트가 도착했습니다.",
      url: appUrl("/"),
    };
  }
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

self.addEventListener("push", (event) => {
  const payload = buildNotificationPayload(event.data);

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      tag: payload.tag || "study-update",
      icon: iconUrl("pwa-192x192.png"),
      badge: iconUrl("pwa-badge.png"),
      data: {
        url: payload.url || appUrl("/"),
      },
    }),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "SHOW_NOTIFICATION") {
    return;
  }

  const payload = event.data.payload || {};
  event.waitUntil(
    self.registration.showNotification(
      payload.title || "Inside React Study",
      {
        body: payload.body || "새로운 업데이트가 도착했습니다.",
        tag: payload.tag || "study-message",
        icon: iconUrl("pwa-192x192.png"),
        badge: iconUrl("pwa-badge.png"),
        data: {
          url: payload.url || appUrl("/"),
        },
      },
    ),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    (async () => {
      const targetUrl = new URL(
        event.notification.data?.url || appUrl("/"),
        self.location.origin,
      ).href;
      const windowClients = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of windowClients) {
        if (client.url === targetUrl && "focus" in client) {
          await client.focus();
          return;
        }
      }

      if (windowClients[0] && "navigate" in windowClients[0]) {
        const client = windowClients[0];
        await client.navigate(targetUrl);
        await client.focus();
        return;
      }

      await clients.openWindow(targetUrl);
    })(),
  );
});
