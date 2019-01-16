const express = require('express');
require('dotenv').config();

const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');
const io = require('socket.io')(server, {
    pingTimeout: 60000,
});

// Route includes
const userRouter = require('./routes/user.router');
const authRouter = require('./routes/auth.router');
const cryptoRouter = require('./routes/crypto.router');
const portfolioRouter = require('./routes/portfolio.router');
const alertsRouter = require('./routes/alerts.router');
const pushRouter = require('./routes/push.router');

//webSocket includes
//module to handle monitoring all alerts to send notifications
const monitorAlerts = require('./webSockets/monitorAlerts');
//module to handle websocket connections -- passing in the io socket 
const webSockets = require('./webSockets/webSockets');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/crypto', cryptoRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/push', pushRouter);

//passes in passport auth user to socketIo
io.use(function (socket, next) {
    // Wrap the express middleware
    sessionMiddleware(socket.request, {}, next);
})

// Serve static files
app.use(express.static('build'));

// WebSockets - these always need to be running
webSockets.binanceAllTickers(io); // starts all tickers stream
monitorAlerts.monitorAlerts(io); // starts stream to monitor prices against alerts

// App Set //
const PORT = process.env.PORT || 5000;

// test to see what clients are connected
// setInterval(() => {
//     io.clients((error, clients) => {
//         if (error) throw error;
//         console.log('clients connected', clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD]
//     });
// }, 5000);

io.on('connection', function (socket) {
    console.log('a user connected to server');
    // the user id is coming from the socketIo middleware that accesses passport
    const userId = socket.request.session.passport.user;
    // save socket id to DB for later use by the monitorAlerts function
    webSockets.saveSocket(socket.id, userId)
    //joins room for alltickers stream
    socket.on('joinAllTickers', () => {
        socket.join('allTickers');
    })
    //leaves room when data isnt needed on client side
    socket.on('leaveAllTickers', () => {
        socket.leave('allTickers');
    })
    socket.on('portfolioStream', (data) => {
        if (data.length > 0) {
            webSockets.startPortfolioStream(data, socket);
            console.log(socket.id, 'started portfolio stream');
        }
        else {
            console.log(socket.id, 'no symbols in this portfolio');
            return;
        }
    })
    socket.on('disconnect', function (reason) {
        console.log('a user disconnected, reason:', reason)
    })
});

/** Listen - need server not app for ws **/
server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

module.exports = io;
