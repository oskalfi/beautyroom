import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const origin = 'https://beautyroom.test';
const handlers = {};
const store = new Map();
const requests = [];
let offline = false;
const cache = {
  async put(key, response) { store.set(new URL(key, origin).href, response); },
  async match(key) { return store.get(new URL(typeof key === 'string' ? key : key.url, origin).href)?.clone(); },
  async addAll(keys) { for (const key of keys) await this.put(key, await fetchMock(key)); },
};
async function fetchMock(input) {
  const url = new URL(typeof input === 'string' ? input : input.url, origin);
  requests.push(url.pathname);
  if (offline) throw new Error('offline');
  if (url.pathname.endsWith('/connection')) return new Response(`<html><head><link rel="stylesheet" href="/shared.css"></head><body>${url.pathname}<script>hydrate()</script></body></html>`);
  if (url.pathname === '/shared.css') return new Response('@font-face{src:url(/fonts/Montserrat.woff2)}.icon{background:url(/not-found/connection.svg)}');
  return new Response('asset');
}
vm.runInNewContext(fs.readFileSync('public/connection-sw.js', 'utf8'), {
  self: { location: { origin }, addEventListener: (name, fn) => handlers[name] = fn, skipWaiting: async () => {}, clients: { claim: async () => {} } },
  caches: { open: async () => cache, keys: async () => [], delete: async () => true },
  fetch: fetchMock, URL, Response, AbortController, setTimeout, clearTimeout,
});
let pending;
handlers.install({ waitUntil: task => pending = task });
await pending;
assert.ok(requests.includes('/connection') && requests.includes('/en/connection') && requests.includes('/ru/connection'));
assert.ok(!requests.some(url => /\.(woff2?|ttf)$/.test(url)), 'offline setup must not download fonts');
assert.ok(!requests.includes('/he/connection'), 'default Hebrew route has no prefix');
for (const path of ['/connection', '/en/connection', '/ru/connection']) {
  const html = await (await cache.match(path)).text();
  assert.ok(!html.includes('hydrate()'));
  assert.ok(html.includes('font-family:Arial'));
}
offline = true;
for (const [path, expected] of [['/treatments/5','/connection'],['/en/treatments/5','/en/connection'],['/ru/contacts','/ru/connection']]) {
  handlers.fetch({ request: { url: origin + path, method: 'GET', mode: 'navigate' }, respondWith: task => pending = task });
  const response = await pending;
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex');
  assert.ok((await response.text()).includes(`<body>${expected}`));
}
let intercepted = false;
handlers.fetch({ request: { url: origin + '/api/connection', method:'POST', mode:'cors' }, respondWith: () => intercepted = true });
assert.equal(intercepted, false);
console.log('Offline checks passed: 3 languages, no font downloads, script-free fallback, 503/noindex, POST untouched.');
