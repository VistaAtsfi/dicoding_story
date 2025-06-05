importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

self.__WB_MANIFEST;

workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
        cacheName: 'app-shell',
        plugins: [new workbox.expiration.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 })],
    })
);

workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/images/') || url.pathname === '/leaflet/images/pin-map.png',
    new workbox.strategies.CacheFirst({
        cacheName: 'images',
        plugins: [new workbox.expiration.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 })],
    })
);

workbox.routing.registerRoute(
    ({ url }) => url.origin.includes('tile.openstreetmap.org'),
    new workbox.strategies.CacheFirst({
        cacheName: 'map-tiles',
        plugins: [new workbox.expiration.ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 })],
    })
);

workbox.routing.registerRoute(
    ({ url }) => url.pathname.includes('/v1/stories'),
    new workbox.strategies.NetworkFirst({
        cacheName: 'api-stories',
        plugins: [new workbox.expiration.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 })],
    })
);

workbox.routing.registerRoute(
    ({ request }) => request.destination === 'script' || request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'static-resources',
        plugins: [new workbox.expiration.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 })],
    })
);

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('push', event => {
    const data = event.data?.json() || { title: 'Dicoding Stories', body: 'Ada cerita baru!' };
    const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(clients.openWindow('/#/'));
});