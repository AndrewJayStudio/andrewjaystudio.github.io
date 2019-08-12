console.log('sw top');
var CACHE_NAME = 'AJSOF-0.1.0-alpha-4';
var urlsToCache = [
	'/dev/AJSOF',
	'/dev/css/AJSOF.css',
	'/dev/images/logo-icon.svg',
	'/dev/js/AJSOF.js'
];
console.log('sw pre install');

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

console.log('sw post install');

self.addEventListener('fetch', function (event) {
	console.log('ServiceWorker fetching ', event.request.url, '.');
	event.respondWith(fromNetwork(event.request, 10000).catch(function () {
		return fromCache(event.request);
	}));
});

console.log('sw post fetch');

function fromNetwork(request, timeout) {
	return new Promise(function (resolve, reject) {
		var timeoutId = setTimeout(reject, timeout);
		fetch(request).then(function (response) {
			if (!response || response.status !== 200 || response.type !== 'basic') {
				clearTimeout(timeoutId);
				reject;
			}
			var responseToCache = response.clone();
			console.log('urlsToCache: ', urlsToCache);
			caches.open(CACHE_NAME)
				.then(function (cache) {
					console.log('ServiceWorker updated ', responseToCache.url, ' to cache.');
					cache.put(request, responseToCache);
				});
			clearTimeout(timeoutId);
			console.log('ServiceWorker fetched ', response.url, ' from network.');
			resolve(response);
		}, reject);
	});
}

console.log('sw post fromNetwork');

function fromCache(request) {
	console.log('ServiceWorker fetched ', request.url, ' from cache.');
	return caches.open(CACHE_NAME).then(function (cache) {
		return cache.match(request).then(function (response) {
			return response || Promise.reject('no-match');
		});
	});
}

console.log('sw post fromCache');

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

console.log('sw end');