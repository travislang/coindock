## CoinDock

A cryptocurrency tracking application

Seamlessly check real-time cryptocurrency price data on mobile or desktop, create multiple different portfolios to organize different cryptocurrencies, and receive push notifications on dynamically generated price alerts.

## Screen Shot
![screenshot](/public/images/main-coindock.png)

## Built With

- Node
- Express
- PostgreSQL
- React
- Redux
- Sagas
- Material-UI
- webSockets API's
- Socket.io
- Nivo (charts)
- Web Push API
- Service Workers

## Demo

To view a live demo of the app please visit [https://coindock.herokuapp.com](https://coindock.herokuapp.com)

It is hosted on heroku's free tier so please allow a few moments for the heroku server to spin up.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. *In Progress*


### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [postgreSQL](https://www.postgresql.org/)
- a database instance with the name 'coin-dock'

## Setting up the environment

copy the contents of the ```database.sql``` file into an sql query to generate the needed database tables.

Next you will need to create an ```.env``` file that has the following fields:

- SERVER_SESSION_SECRET={YOUR_SECRET_KEY}
- CMC_API_KEY={YOUR_KEY}
- PUBLIC_VAPID_KEY={YOUR_KEY}
- PRIVATE_VAPID_KEY={YOUR_KEY}

```CMC_API_KEY``` is a coin market cap api key that you will need to generate.

The public and private VAPID KEYS are needed for web push authentication with service workers.
Whne you install web-push run ```npm install web-push -g``` if you install it globally you can create these keys from the command line by typing ```web-push generate-vapid-keys [--json]``` into your command line at the project directory.

the below fields are only needed if using facebook authentication

- FACEBOOK_APP_ID={YOUR_KEY}
- FACEBOOK_APP_SECRET={YOUR_KEY}
- FB_AUTH={YOUR_KEY}
- FB_AUTH_REDIRECT={YOUR_KEY}


### Completed Features

- [x] real time streaming price data
- [x] Installation of service worker and subscription to Push Notifications
- [x] Infinite scroll loading of cryptocurrencies
- [x] create/delete portfolios
- [x] create price alerts and toggle them on/off


### Next Steps

- [ ] work on improving code performance
- [ ] Add Twilio for notifications backup in case browser doesn't support Push



## Author

* Travis Lang


## Acknowledgments

* Thanks to all of the developers of the open source software that was used

