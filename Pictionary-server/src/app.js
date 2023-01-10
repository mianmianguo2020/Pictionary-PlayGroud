const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);

require('./rest')(app);
require('./websocket')(server);

server.listen(3000, () => {
    console.log('listening on *:3000');
});