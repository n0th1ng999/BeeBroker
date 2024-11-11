const net = require("net");
const { handlePacket } = require("./packetHandlers");
const mongoose = require("mongoose");
const Route = require("./models/RouteModel");
require("dotenv").config();

//connect to mongoose server
try {
	mongoose.connect("mongodb://localhost:27017/beeBroker", {});
} catch (error) {
	console.error("Failed to connect to MongoDB:", error);
	process.exit(1);
}

//Parse data
const parseData = (jsonString) => JSON.parse(jsonString);

// MQTT Routes
// topics are stored in memory with the their respective values and subtopics
// They have a nested structure that contains the following properties

// Todo: load topics from mongoDB
// Insteal of loading  topics
let topics = [];

/**
 * Route : {
 * topic:String
 * value:
 * 
 */
Route.aggregate([
	{
		$project: {
			topic: 1,
			value: { $arrayElemAt: ["$value", -1] },
		},
	},
])
	.then((result) => {
		result.map((route) => (route.value = route.value.value));
		topics = [...result];
	})
	.catch((error) => console.error(error));

//Server setup
// TODO Change to tls
const mqttBroker = net.createServer((socket) => {
	const socketAddress = socket.address();

	try {
		//CUSTOM EVENTS: CONNECT, CONNACK, SUBSCRIBE, SUBACK, PUBLISH, PUBACK
		let auth = { publish: false, subscribe: false };

		//Handle incoming data
		socket.on("data", (packet) => {
			// Temporarily remove the listener to prevent more incoming packets
			socket.pause();

			handlePacket(packet, auth, socket, topics);

			setTimeout(() => {
				socket.resume();
			}, 1000);
		});

		//Handle closing of connection
		socket.on("end", () => {
			clearPublishingInfo(socketAddress);
			console.log(topics);
			console.log("TCP connection ended");
		});

		socket.on("error", (err) => {
			clearPublishingInfo(socketAddress);
			console.error(err);
			socket.end();
		});

		socket.on("close", (err) => {
			clearPublishingInfo(socketAddress);
			console.error(err);
			socket.end();
		});
	} catch (err) {
		clearPublishingInfo(socketAddress);
	}
});

mqttBroker.listen(
	process.env.MQTT_BROKER_PORT,
	process.env.MQTT_BROKER_HOST,
	() => {
		console.log(`listening on ${process.env.MQTT_BROKER_PORT}`);
	}
);

const clearPublishingInfo = (publisherAddress) => {
	topics.forEach((topic) => {
		if (
			JSON.stringify(topic.publisherAddress) ===
			JSON.stringify(publisherAddress)
		) {
			console.log(
				JSON.stringify(topic.publisherAddress),
				JSON.stringify(publisherAddress)
			);
			delete topic.publisherAddress;
		}
	});
};
