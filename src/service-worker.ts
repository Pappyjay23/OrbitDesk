/// <reference lib="webworker" />

import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;

// Clean old caches
cleanupOutdatedCaches();

// Precache all Vite-built assets
precacheAndRoute(self.__WB_MANIFEST);

// Single install event handler - cache everything at once
self.addEventListener("install", (event) => {
	console.log("Service Worker installing...");
	event.waitUntil(
		Promise.all([
			// Cache offline page and assets
			caches.open("offline-assets").then((cache) => {
				return cache.addAll([
					"/offline.html",
					"/offline-bg.jpg",
					"/fonts/Satoshi/Satoshi-Regular.otf",
					"/fonts/Satoshi/Satoshi-Medium.otf",
					"/fonts/Satoshi/Satoshi-Bold.otf",
					"/fonts/Satoshi/Satoshi-Black.otf",
				]);
			}),
			// Cache music assets
			caches.open("music-audio").then((cache) => {
				console.log("Caching music audio files...");
				return cache.addAll([
					"/music/audio/music-1.mp3",
					"/music/audio/music-2.mp3",
					"/music/audio/music-3.mp3",
					"/music/audio/music-4.mp3",
					"/music/audio/music-5.mp3",
					"/music/audio/music-6.mp3",
					"/music/audio/music-7.mp3",
					"/music/audio/music-8.mp3",
					"/music/audio/music-9.mp3",
					"/music/audio/music-10.mp3",
				]);
			}),
			// Cache music cover images
			caches.open("music-covers").then((cache) => {
				console.log("Caching music cover images...");
				return cache.addAll([
					"/music/img/music-1.webp",
					"/music/img/music-2.webp",
					"/music/img/music-3.webp",
					"/music/img/music-4.webp",
					"/music/img/music-5.webp",
					"/music/img/music-6.webp",
					"/music/img/music-7.webp",
					"/music/img/music-8.webp",
					"/music/img/music-9.webp",
					"/music/img/music-10.webp",
				]);
			}),
		])
	);
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	console.log("Service Worker activated");
	event.waitUntil(Promise.all([self.clients.claim()]));
});

// Cache fonts
registerRoute(
	({ url }) => url.pathname.startsWith("/fonts/Satoshi/"),
	new CacheFirst({
		cacheName: "satoshi-fonts",
		plugins: [
			new ExpirationPlugin({
				maxEntries: 10,
				maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
			}),
			{
				async cacheWillUpdate({ response }) {
					if (!response || response.status !== 200) return null;
					const cloned = response.clone();
					const body = await cloned.blob();
					const headers = new Headers(cloned.headers);

					if (
						!headers.get("Content-Type") ||
						headers.get("Content-Type") === "application/octet-stream"
					) {
						headers.set("Content-Type", "font/otf");
					}

					return new Response(body, {
						status: cloned.status,
						statusText: cloned.statusText,
						headers,
					});
				},
			},
		],
	})
);

// Cache offline assets
registerRoute(
	({ url }) =>
		url.pathname === "/offline.html" || url.pathname === "/offline-bg.jpg",
	new CacheFirst({
		cacheName: "offline-assets",
	})
);

// Cache music audio files - MUST match the cache name used in install
registerRoute(
	({ url }) => url.pathname.startsWith("/music/audio/"),
	new CacheFirst({
		cacheName: "music-audio",
		plugins: [
			new ExpirationPlugin({
				maxEntries: 20,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
			}),
		],
	})
);

// Cache music cover images - MUST match the cache name used in install
registerRoute(
	({ url }) => url.pathname.startsWith("/music/img/"),
	new CacheFirst({
		cacheName: "music-covers",
		plugins: [
			new ExpirationPlugin({
				maxEntries: 20,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
			}),
		],
	})
);

// Cache internal app images
registerRoute(
	({ request, sameOrigin }) => {
		return sameOrigin && request.destination === "image";
	},
	new CacheFirst({
		cacheName: "images",
	})
);

// Cache external images
registerRoute(
	({ request, sameOrigin }) => !sameOrigin && request.destination === "image",
	new CacheFirst({
		cacheName: "external-images",
		plugins: [
			new ExpirationPlugin({
				maxEntries: 50,
				maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
			}),
		],
	})
);

// Network-first navigation route with offline fallback
registerRoute(
	({ request }) => request.mode === "navigate",
	new NetworkFirst({
		cacheName: "navigation",
		networkTimeoutSeconds: 3,
		plugins: [
			{
				handlerDidError: async () => {
					console.log("Network failed, serving offline page");
					const offlinePage = await caches.match("/offline.html");
					return (
						offlinePage ||
						new Response("Offline", {
							status: 503,
							statusText: "Service Unavailable",
						})
					);
				},
			},
		],
	})
);
