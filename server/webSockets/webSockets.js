const express = require('express');
const pool = require('../modules/pool');
const WebSocket = require('ws');
const server = require('../server');

//placeholder to store symbols that will be sent by socket to client
const symbolsToSend = [];
let btcPrice;
let ethPrice;

// starts socket for portfolio symbols
function startPortfolioStream(coins, socket) {
    socket.emit('portfolioUpdate', {
        msg: symbolsToSend,
        btc: btcPrice,
        eth: ethPrice
    })
    const intervalId = setInterval(() => {
        socket.emit('portfolioUpdate', {
            msg: symbolsToSend,
            btc: btcPrice,
            eth: ethPrice
        })
    }, 3000);
    //get symbols out of obj
    let portfolioSymbols = coins.map(item => {
        return `${item.symbol.toLowerCase()}@ticker`
    })
    //join together in a way binance socket can use
    portfolioSymbols = portfolioSymbols.join('/');

    // open new socket and pass in symbols we need
    // includes BTC and ETH even if portfolioSymbols is empty
    // portfolioSymbols should never be empty at this point because we would
    // have caught that on io connection
    portfolioSocket(portfolioSymbols, intervalId, socket);
}

function portfolioSocket(portfolioSymbols, intervalId, socket) {
    let pingTimeout;
    let didIClose = false;
    let ws = portfolioSymbols ? new WebSocket(`wss://stream.binance.com:9443/stream?streams=${portfolioSymbols}/btcusdt@ticker/ethbtc@ticker`) : new WebSocket(`wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethbtc@ticker`);
    ws.on('open', () => {
        console.log('binance portfolioSymbols stream open');
        // clears heartbeat timeout
        clearTimeout(pingTimeout);
        // starts another heartbeat for 3mins + 10 seconds for latency
        pingTimeout = setTimeout(() => {
            console.log('pingTimeout hit, disconnecting...');
            ws.terminate();
        }, 300000 + 10000);
    });
    ws.on('ping', () => {
        console.log('recieved ping from API in portfolioSymbols stream');
        ws.pong();
        // clears heartbeat timeout
        clearTimeout(pingTimeout);
        // starts another heartbeat for 3mins + 10 seconds for latency
        pingTimeout = setTimeout(() => {
            console.log('pingTimeout hit, disconnecting...');
            ws.terminate();
        }, 300000 + 10000);
    });
    //listen for data stream
    ws.on('message', (data) => {
        const dataObj = JSON.parse(data)
        let foundIndex = symbolsToSend.findIndex(el => {
            return el.data.s === dataObj.data.s
        })
        if (foundIndex !== -1) {
            symbolsToSend[foundIndex] = dataObj
        }
        else {
            symbolsToSend.push(dataObj);
        }
        if (dataObj.data.s === 'BTCUSDT') {
            btcPrice = dataObj.data.c
        }
        else if (dataObj.data.s === 'ETHBTC') {
            ethPrice = dataObj.data.c
        }
    })
    //need to close socket and start new one on button click event/portfolio change from client side
    socket.on('closePortfolioWs', () => {
        console.log('closing portfolioStream webSocket. Sent from client');
        didIClose = true;
        if(ws.readyState === (0 || 1)) {
            ws.close(1000);
        }
        clearInterval(intervalId);
    })
    ws.on('close', function (code, reason) {
        console.log('portfolioStream webSocket closed, code:', code, reason);
        // clears heartbeat interval
        clearInterval(pingTimeout);
        console.log('this is code:', code, reason);
        if(!didIClose) {
            setTimeout(() => {
                console.log('trying to reconnect to portfolioStream stream...');
                portfolioSocket(portfolioSymbols, intervalId, socket);
            }, 1000);
        }
        // clear out ws object
        ws = null;
    });
    ws.on('error', (err) => {
        console.log('error in portfolioStream webSocket,', err);
    })
}

function binanceAllTickers(io) {
    //placeholder for incoming binance tickers
    let allTickers;
    let btcPrice;
    let ethPrice;

    let pingTimeout;
    //opens allTickers stream
    // let ws = new WebSocket(`wss://stream.binance.com:9443/ws/!ticker@arr`);
    let ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethbtc@ticker/!ticker@arr`);
    ws.on('open', (ws) => {
        // clears heartbeat timeout
        clearTimeout(pingTimeout);
        // starts another heartbeat for 3mins + 10 seconds for latency
        pingTimeout = setTimeout(() => {
            console.log('pingTimeout hit, disconnecting...');
            ws.terminate();
        }, 300000 + 10000);
        console.log('binance allTickers stream open');
    });
    ws.on('ping', () => {
        console.log('recieved ping from API in allTickers stream');
        ws.pong();
        // clears heartbeat timeout
        clearTimeout(pingTimeout);
        // starts another heartbeat for 3mins + 10 seconds for latency
        pingTimeout = setTimeout(() => {
            console.log('pingTimeout hit, disconnecting...');
            ws.terminate();
        }, 300000 + 10000);
    });
    //listen for data stream
    ws.on('message', function (data) {
        const dataObj = JSON.parse(data)
        if (dataObj.stream === '!ticker@arr') {
            allTickers = dataObj.data;
        }
        else if (dataObj.stream === 'btcusdt@ticker') {
            btcPrice = dataObj.data.c
        }
        else if (dataObj.stream === 'ethbtc@ticker') {
            ethPrice = dataObj.data.c
        }
    });
    ws.on('close', (code, reason) => {
        console.log('allTickers websocket closed, reason:', code, reason);
        // clears io emit interval
        clearInterval(intervalClear);
        // clears heartbeat interval
        clearInterval(pingTimeout);
        setTimeout(() => {
            console.log('trying to reconnect to allTicker stream...');
            binanceAllTickers(io);
        }, 1000);
        // clear out ws object
        ws = null;
    })
    ws.on('error', (err) => {
        console.log('error in allTickers websocket:', err);
    })
    //sends out updated data every 3 seconds to 'allTickers' socket room
    const intervalClear = setInterval(() => {
        io.to('allTickers').emit('allTickers', {
            msg: allTickers,
            btc: btcPrice,
            eth: ethPrice
        })
    }, 3000);
    io.to('allTickers').emit('allTickers', {
        msg: allTickers,
        btc: btcPrice,
        eth: ethPrice
    })
}

module.exports = {
    binanceAllTickers: binanceAllTickers,
    startPortfolioStream: startPortfolioStream
}