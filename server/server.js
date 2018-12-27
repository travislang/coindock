const express = require('express');
require('dotenv').config();

const app = express();
const server = require('http').Server(app);
const cors = require('cors')
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

//cors middleware
// const corsOptions = {
//     credentials: true,
// };
// app.use(cors(corsOptions));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/crypto', cryptoRouter);
app.use('/auth', authRouter);

// Serve static files
app.use(express.static('build'));

/* WebSockets */
//**SOCKET.IO FOR CLIENT/SERVER COMMUNICATION**//
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected')
    })
});

//**WEBSOCKET FOR API DATA**//
// function to make sure socket is still connected
function heartbeat() {
    console.log('recieved ping from server');
}

//query symbols fom db and start data streams for each symbol
function binanceStream() {
    //get symbols
    pool.query(`SELECT "symbol" FROM "symbols";`)
    .then( (result) => {
        console.log(result.rows);
        //make sure there is a response
        if( result && result.rows ) {
            //map symbols to format needed for stream
            let tradingSymbols = result.rows.map(symbol => {
                return `${symbol.symbol.toLowerCase()}@ticker`
            })
            console.log(tradingSymbols.join('/'));
            //open new websocket and pass in symbols 
            let ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${tradingSymbols.join('/')}`);
            ws.on('open', () => {
                console.log('binance stream open');
            });
            //listen for data stream
            ws.on('message', function (data) {
            // let time = moment(JSON.parse(data).E).format('h:mm:ss a')
            // console.log(time);
            // console.log(data);
            
            // console.log('data', JSON.parse(data).stream);
            io.emit('priceUpdate', { data })
            });
        }
        
        // let ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@miniTicker');
        // //<symbol>@miniTicker
        // //!miniTicker@arr
        // ws.on('open', () => {
        //     console.log('binance stream open');
        // });

        // ws.on('ping', heartbeat);

        // //listening for data stream
        // ws.on('message', function (data) {
        //     let time = moment(JSON.parse(data).E).format('h:mm:ss a')
        //     console.log(time);
        //     io.emit('priceUpdate', { data: JSON.parse(data), time: time })
        // });
    }).catch( err => {
        console.log('error in binanceStream db query:', err);
    })
}
// binanceStream();

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen - need server not app for ws **/
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
