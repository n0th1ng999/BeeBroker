import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080')

let sendInterval

ws.onopen = (event) => {
    sendInterval = setInterval(() => {
        ws.send("recievePackage");
    }, 1000);
};

ws.onmessage = (event) => {
    console.log(event.data);
};