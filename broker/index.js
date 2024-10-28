const net = require("net");
const { handlePacket } = require("./packetHandlers");
const mongoose = require("mongoose");
require("dotenv").config();

//connect to mongoose server
mongoose.connect("mongodb://localhost:27017/beebroker");

//Parse data
const parseData = (jsonString) => JSON.parse(jsonString);

// MQTT Routes
// topics are stored in memory with the their respective values and subtopics
// They have a nested structure that contains the following properties

const topics = [
	{ topic: "Pacients/1/Pulse", value: 115 },
	{ topic: "Pacients/2/Pulse", value: 100 },
	{ topic: "Pacients/2/Glucose", value: 120 },
];

//Server setup
const mqttBroker = net.createServer((socket) => {
	//CUSTOM EVENTS: CONNECT, CONNACK, SUBSCRIBE, SUBACK, PUBLISH, PUBACK
	let auth = { publish: false, subcribe: false };

	//Handle incoming data
	socket.on("data", (packet) => handlePacket(packet, auth, socket, topics));

	//Handle closing of connection
	socket.on("end", () => {
		console.log(topics);
		console.log("TCP connection ended");
	});

	socket.on("error", (err) => {
		console.error(err);
		socket.end();
	});
});

mqttBroker.listen(
	process.env.MQTT_BROKER_PORT,
	process.env.MQTT_BROKER_HOST,
	() => {
		console.log(`listening on ${process.env.MQTT_BROKER_PORT}`);
	}
);
