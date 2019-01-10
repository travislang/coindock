const express = require('express');
require('dotenv').config();

const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');
const WebSocket = require('ws');
const io = require('socket.io')(server);
const moment = require('moment');
const pool = require('./modules/pool');
const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const authRouter = require('./routes/auth.router');
const cryptoRouter = require('./routes/crypto.router');
const portfolioRouter = require('./routes/portfolio.router');
const alertsRouter = require('./routes/alerts.router');
const pushRouter = require('./routes/push.router');

//module to handle monitoring all alerts to send notifications
const monitorAlerts = require('./monitorAlerts');



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

//placeholder for incoming binance tickers
let allTickers;

// Serve static files
app.use(express.static('build'));

/* WebSockets */
binanceAllTickers(); // starts all tickers stream
monitorAlerts.monitorAlerts(); // starts stream to monitor prices against alerts

//**SOCKET.IO FOR CLIENT/SERVER COMMUNICATION**//
io.on('connection', function (socket) {
    let intClear;
    console.log('a user connected');
    //joins room for alltickers stream
    socket.on('joinAllTickers', () => {
        socket.join('allTickers');
    })
    //leaves room when data isnt needed on client side
    socket.on('leaveAllTickers', () => {
        socket.leave('allTickers');
    })
    socket.on('portfolioStream', (data) => {
        if(data.length > 0) {
            startPortfolioStream(data, socket);
            console.log(socket.id, 'started portfolio stream');
        }
        else {
            console.log(socket.id, 'no symbols in this portfolio');
            return;
        }
        
    })
    socket.on('disconnect', function (reason) {
        console.log('a user disconnected, reason:', reason)
        clearInterval(intClear);
    })
});

// starts socket for portfolio symbols
function startPortfolioStream(coins, socket) {
    //placeholder to store symbols that will be sent by socket to client
    const symbolsToSend = [];
    let btcPrice;
    let ethPrice;
    const intervialId = setInterval(() => {
        socket.emit('portfolioUpdate', { msg: symbolsToSend, btc: btcPrice, eth: ethPrice })
    }, 3000);
    //get symbols out of obj
    let portfolioSymbols = coins.map(item => {
        return `${item.symbol.toLowerCase()}@ticker`
    })
    //join together in a way binance socket can use
    portfolioSymbols = portfolioSymbols.join('/');

    //open new socket and pass in symbols we need
    let ws = portfolioSymbols ? new WebSocket(`wss://stream.binance.com:9443/stream?streams=${portfolioSymbols}/btcusdt@ticker/ethbtc@ticker`) : new WebSocket(`wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethbtc@ticker`);
    ws.on('open', () => {
        console.log('binance portfolio symbols stream open');
    });
    ws.on('ping', heartbeat);
    //listen for data stream
    ws.on('message', (data) => {
        const dataObj = JSON.parse(data)
        let foundIndex = symbolsToSend.findIndex( el => {
            return el.data.s === dataObj.data.s
        })
        if (foundIndex !== -1) {
            symbolsToSend[foundIndex] = dataObj
        }
        else {
            console.log('in else');
            symbolsToSend.push(dataObj);
        }
        if (dataObj.data.s === 'BTCUSDT') {
            btcPrice = dataObj.data.c
        }
        else if (dataObj.data.s === 'ETHBTC') {
            ethPrice = dataObj.data.c
        }
    })
    //need to close socket and start new one on button click event portfolio change client side
    socket.on('closePortfolioWs', () => {
        console.log('recieved the close portfolio emit');
        ws.close();
        clearInterval(intervialId);
    })
    ws.on('close', function() {
        console.log('portfolio ws closed');
    });
    ws.on('error', (err) => {
        console.log('error in ws,', err);
        
    })
    
}

//**WEBSOCKET FOR API DATA**//
// function to make sure socket is still connected
function heartbeat() {
    console.log('recieved ping from server');
}

//gets all symbols that have changed every second in an array
function binanceAllTickers() {
    let ws = new WebSocket(`wss://stream.binance.com:9443/ws/!ticker@arr`);
    ws.on('open', () => {
        console.log('binance all symbols stream open');
    });
    ws.on('ping', heartbeat);
    //listen for data stream
    ws.on('message', function (data) {
        // let time = moment(JSON.parse(data).E).format('h:mm:ss a')
        // console.log(time);
        // console.log(data);
        // console.log('data', JSON.parse(data).stream);
        // io.emit('priceUpdate', { data })
        allTickers = data;
    });
    //sends out updated data every 3 seconds to 'allTickers' socket room
    const intervalClear = setInterval(() => {
        console.log('sending update on alltickers', allTickers[0]);
        
        io.to('allTickers').emit('allTickers', {msg: allTickers})
    }, 3000);
}

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen - need server not app for ws **/
server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

module.exports = io;
