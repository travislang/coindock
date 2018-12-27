const express = require('express');
const app = express();
const server = require('http').Server(app);

const WebSocket = require('ws');
const io = require('socket.io')(server);

const moment = require('moment');

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

let ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@miniTicker');
//<symbol>@miniTicker
//!miniTicker@arr
ws.on('open', () => {
    console.log('binance stream open');
});

ws.on('ping', heartbeat);

//listening for data stream
ws.on('message', function (data) {
    let time = moment(JSON.parse(data).E).format('h:mm:ss a')
    console.log(time);
    io.emit('priceUpdate', { data: JSON.parse(data), time: time })
});