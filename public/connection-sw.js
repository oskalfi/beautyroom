/* Offline fallback only: normal pages and API responses are never cached here. */
const CACHE = "beauty-connection-v1";
const PAGES = ["/connection", "/ru/connection", "/he/connection"];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const assets = new Set(["/not-found/connection.svg", "/not-found/topLeaf.svg", "/not-found/bottomLeaf.svg"]);
    for (const path of PAGES) {
      const response = await fetch(path, { cache: "reload" });
      if (!response.ok) throw new Error("Cannot prepare offline page");
      let html = await response.text();
      for (const match of html.matchAll(/href="([^" ]+\.css(?:\?[^" ]*)?)"/g)) {
        const url = new URL(match[1].replaceAll("&amp;", "&"), self.location.origin);
        if (url.origin === self.location.origin) assets.add(url.pathname + url.search);
      }
      // The saved fallback works without React hydration or a network connection.
      html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<link\b[^>]*\bas="script"[^>]*>/gi, "");
      html = html.replace("</head>", '<style>body > :is(button,dialog), body > div:not(#site-content), body > a {display:none!important}</style></head>');
      html = html.replace("</body>", `<script>
        const retry = document.querySelector('[data-connection-error] a:last-child');
        if (retry) retry.addEventListener('click', event => { event.preventDefault(); location.reload(); });
        let checking = false;
        async function check() {
          if (!navigator.onLine || checking) return;
          checking = true;
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);
          try { const response = await fetch('/api/connection', {cache:'no-store', signal:controller.signal}); if (response.status === 204) location.reload(); }
          catch {} finally { clearTimeout(timeout); checking = false; }
        }
        addEventListener('online', check);
        setInterval(check, 10000);
      </script></body>`);
      await cache.put(path, new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } }));
    }
    for (const asset of [...assets]) {
      if (!asset.includes(".css")) continue;
      const response = await fetch(asset, { cache: "reload" });
      if (!response.ok) throw new Error("Cannot prepare offline styles");
      await cache.put(asset, response.clone());
      const css = await response.text();
      for (const match of css.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)) {
        const url = new URL(match[1], new URL(asset, self.location.origin));
        if (url.origin === self.location.origin && /\.(woff2?|svg)(?:\?|$)/.test(url.pathname)) assets.add(url.pathname + url.search);
      }
    }
    await cache.addAll([...assets]);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith("beauty-connection-") && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try { return await fetch(request, { signal: controller.signal }); }
      catch {
        const locale = url.pathname.split('/')[1];
        const path = locale === "ru" || locale === "he" ? `/${locale}/connection` : "/connection";
        const cached = await (await caches.open(CACHE)).match(path);
        return cached ? new Response(await cached.text(), { status: 503, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } }) : Response.error();
      } finally { clearTimeout(timeout); }
    })());
  } else if (request.destination === "style" || request.destination === "font" || url.pathname.startsWith("/not-found/")) {
    event.respondWith((async () => (await (await caches.open(CACHE)).match(request)) || fetch(request))());
  }
});
