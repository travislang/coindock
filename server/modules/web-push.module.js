const webpush = require('web-push');
require('dotenv').config();

const vapidKeys = {
    publicKey: process.env.PUBLIC_VAPID_KEY,
    privateKey: process.env.PRIVATE_VAPID_KEY
};

webpush.setVapidDetails(
    'mailto:lang40cal@hotmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

module.exports = webpush;