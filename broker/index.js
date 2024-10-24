const net = require("net");
require("dotenv").config();

const mqttBroker = net.createServer((socket) => {
	console.log("a client connected");

	socket.on("data", (clientData) => {
		console.log(`client sent ${clientData}`);
	});

	socket.on("end", () => {
		console.log("Client disconnected");
	});
});

mqttBroker.listen(3000, "localhost", () => {
	console.log(`listening on ${process.env.MQTT_BROKER_PORT}`);
});
