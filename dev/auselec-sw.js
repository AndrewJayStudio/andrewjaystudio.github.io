var CACHE_NAME = 'auselec-cache-v0-s1';
var urlsToCache = [
	'/dev/auselec',
	'/dev/css/auselec.css',
	'/dev/css/fonts/crimson-text.woff2',
	'/dev/images/austin-icon.svg'
];

self.addEventListener('install', function (event) {
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function (cache) {
				console.log('Opened cache');
				return cache.addAll(urlsToCache);
			})
	);
});

self.addEventListener('fetch', function (event) {
    event.respondWith(fromNetwork(event.request, 3000).catch(function () {
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
            cache.put(request, responseToCache);
          });
          clearTimeout(timeoutId);
          resolve(response);
      }, reject);
  });
}

function fromCache(request) {
  return caches.open(CACHE_NAME).then(function (cache) {
    return cache.match(request).then(function (response) {
      return response || Promise.reject('no-match');
    });
  });
}

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});