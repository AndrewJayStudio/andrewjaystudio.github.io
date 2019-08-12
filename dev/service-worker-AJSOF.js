var CACHE_NAME = 'AJSOF-0.1.0-alpha-3';
var urlsToCache = [
	'/dev/AJSOF',
	'/dev/css/AJSOF.css',
	'/dev/images/logo-icon.svg',
	'/dev/js/AJSOF.js'
];

self.addEventListener('install', function (event) {
	// Perform install steps
	console.log('ServiceWorker installing.');
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function (cache) {
				console.log('ServiceWorker opened ', CACHE_NAME, ' in cache');
				return cache.addAll(urlsToCache);
			})
	);
});

self.addEventListener('fetch', function (event) {
	console.log('ServiceWorker fetching.');
	event.respondWith(fromNetwork(event.request, 10000).catch(function () {
		return fromCache(event.request);
	}));
});

function fromNetwork(request, timeout) {
	return new Promise(function (resolve, reject) {
		var timeoutId = setTimeout(reject, timeout);
		fetch(request).then(function (response) {
			if (!response || response.status !== 200 || response.type !== 'basic') {
				clearTimeout(timeoutId);
				reject;
			}
			var responseToCache = response.clone();
			caches.open(CACHE_NAME)
				.then(function (cache) {
					console.log('ServiceWorker updated ', responseToCache, ' cache.');
					cache.put(request, responseToCache);
				});
			clearTimeout(timeoutId);
			console.log('ServiceWorker fetched ', response, ' from network.');
			resolve(response);
		}, reject);
	});
}

function fromCache(request) {
	console.log('ServiceWorker fetched ', request, ' from cache.');
	return caches.open(CACHE_NAME).then(function (cache) {
		return cache.match(request).then(function (response) {
			return response || Promise.reject('no-match');
		});
	});
}

self.addEventListener('activate', function (event) {
	console.log('serviceWorver activating.');
	var cacheWhitelist = [CACHE_NAME];
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.map(function (cacheName) {
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});