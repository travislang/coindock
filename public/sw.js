self.addEventListener('install', event => {
    console.log('Service worker installing...');
    // Add a call to skipWaiting here
});

self.addEventListener('activate', event => {
    console.log('Service worker activating...');
});


self.addEventListener('push', function (event) {
    const promiseChain = self.registration.showNotification('Hello, World.');
    console.log('in push sw', event)
    event.waitUntil(promiseChain);
});

// self.addEventListener('fetch', event => {
//     console.log('Fetching:', event.request.url);
// });