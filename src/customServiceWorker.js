function askPermission() {
    if (Notification.permission === 'default') {
        return new Promise(function (resolve, reject) {
            const permissionResult = Notification.requestPermission(function (result) {
                resolve(result);
            });

            if (permissionResult) {
                permissionResult.then(resolve, reject);
            }
        })
            .then(function (permissionResult) {
                if (permissionResult !== 'granted') {
                    throw new Error('We weren\'t granted permission.');
                }
                else {
                    console.log('permission granted', permissionResult);
                    subscribeUserToPush();
                }
            });
    }
    else {
        return;
    }
}

function subscribeUserToPush() {
    return navigator.serviceWorker.register('sw.js')
        .then(function (registration) {
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    'BB93CCNqCF3wjTUd_EpHyfcR8mWdlq5EVtOWuXW3pmktWvRMEIZVxGr-J99px-qmtkeoULRRpOyryAtu0EU0t0k'
                )
            };
            return registration.pushManager.subscribe(subscribeOptions);
        })
        .then(function (pushSubscription) {
            console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
            return pushSubscription;
        })
        .then(function (pushSub) {
            sendSubscriptionToBackEnd(pushSub)
        })
        .catch( err => {
            console.log('there was an error subscribing user to push:', err);
            
        })
}

function sendSubscriptionToBackEnd(subscription) {
    return fetch('/api/push/save-subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
    })
        .then(function (response) {
            console.log('back from server');
            return response
        })
        .catch( err => {
            console.log('error in server response', err);
            throw new Error('Bad response from server.');
        })
        // dispatch to user saga to get user info again
}

function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default {
    askPermission: askPermission,
    subscribeUserToPush: subscribeUserToPush
};