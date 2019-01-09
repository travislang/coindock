const WebSocket = require('ws');
const io = require('../server');

const moment = require('moment');

//**SOCKET.IO FOR CLIENT/SERVER COMMUNICATION**//


//**WEBSOCKET FOR API DATA**//

// function to make sure socket is still connected


//query symbols fom db and start data streams for each symbol


//listening for data stream
// ws.on('message', function (data) {
//     let time = moment(JSON.parse(data).E).format('h:mm:ss a')
//     console.log(time);
//     io.emit('priceUpdate', { data: JSON.parse(data), time: time })
// });