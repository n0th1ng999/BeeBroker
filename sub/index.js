const net = require("net");
require("dotenv").config();
const MqttPacket = require("../packetFormatter");

// Import the WebSocket library
const WebSocket = require('ws');
const http = require('http')

// Most recent message
let MQTT_RECENT_PACKAGE = {}

// Criar uma socket para comunicar com o servidor

//Adicionar node Args support

//* Client MQTT
const client = net.createConnection(
	{
		port: process.env.MQTT_BROKER_PORT,
		host: process.env.MQTT_BROKER_HOST,
		reconnectTimeoutMs: 2000,
		keepAlive: 10,
		retryDelay: 2 * 1000,
	},
	() => {
		console.log("Connected");

		client.write(
			new MqttPacket({
				code: 1,
				username: "Nurse 1",
				password: "password",
			}).toJson()
		);

		client.write(
			new MqttPacket({
				code: 8,
				topic: "patients/#",
			}).toJson()
		);

		client.on("data", (data) => {
			//console.log(data.toString());
			MQTT_RECENT_PACKAGE = data.toString()
		});

		client.on("end", () => {
			console.log("Disconnected");
		});
	}
);

//* Server Websocket

// Create a WebSocket server on port 8080
const WebSocketServer = new WebSocket.Server({ port: 8080 });

let wsInterval

// Event handler for when a client connects
WebSocketServer.on('connection', (clientSocket) => {
  console.log('A client connected'); // Log when a client connects

  // Event handler for when the server receives a message from a client
  clientSocket.on('message', (message) => {
	/* if (message == 'recievePackage') {
		console.log(`Received: ${message}`); // Log the received message
    	clientSocket.send(JSON.stringify(MQTT_RECENT_PACKAGE)); // Send a response to the client
	} */
    
  });

  let wsInterval = setInterval(() => {
	clientSocket.send(JSON.stringify(MQTT_RECENT_PACKAGE));
  }, 1000);

  // Event handler for when a client disconnects
  clientSocket.on('close', () => {
    console.log('Client disconnected'); // Log when a client disconnects
  });
});