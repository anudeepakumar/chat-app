const express =  require("express");
const http =  require("http");
const webSocket = require("ws");
const url = require("url");

const app = express();
const server = http.createServer(app);
const wss = new webSocket.Server({server: server, verifyClient: verifyClient, handleProtocols: handleProtocols});

function verifyClient(info, callback) {
    console.log("info", info.origin, info.secure, info.req.headers, url.parse(info.req.url, true).query);
    return callback(true, 400, 'name', {'retry':'later'});
}

function handleProtocols(protocols, req) {
    console.log("protocols",protocols);
    return true;
}

wss.on('connection', (ws, req) => {
    // console.log("here", req.headers);
    ws.on('message', (msg)=>{
        console.log('received: %s', msg);
        ws.send(`Hello, you sent -> ${msg}`);
    });
    ws.on('close', (code, reason)=>{
        console.log('close:', code, reason);
        // ws.send(`Hello, you sent -> ${msg}`);
    });
    ws.on('error', (error)=>{
        console.log('error: ', error);
        // ws.send(`Hello, you sent -> ${msg}`);
    });
    ws.on('open', ()=>{
        console.log('open: ');
        // ws.send(`Hello, you sent -> ${msg}`);
    });
});

server.listen(process.env.PORT || 8001, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});