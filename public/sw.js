self.addEventListener('install', event => {
    console.log('Service worker installing...');
    // Add a call to skipWaiting here
});

self.addEventListener('activate', event => {
    console.log('Service worker activating...');
});


self.addEventListener('push', function (event) {
    const response = event.data.json();
    const title = `${response.coin} is ${response.direction} $${response.threshold}`;
    const promiseChain = self.registration.showNotification(title, {
        icon: '/images/coindockicon.png'
    }
    );
    console.log('in push sw', event.data.json())
    event.waitUntil(promiseChain);
});

// self.addEventListener('fetch', event => {
//     console.log('Fetching:', event.request.url);
// });