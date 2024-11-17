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

// MQTT Routes
// topics are stored in memory with the their respective values
// Insteal of loading  topics
/**
 * topics : [
 *  	{
 * 	topic:String
 * 	value:Any
 * 	publisher:{ip, port, ...}
 * 		}, ...
 * ]
 */
let topics = [];

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
// ? Change to tls
const mqttBroker = net.createServer((socket) => {
	const socketAddress = socket.address();

	try {
		let auth = { publish: false, subscribe: false };
		
		socket.on("data", (packet) => {
			// Temporarily remove the listener to prevent more incoming packets
			socket.pause();
			
			//Handle Events
			//CUSTOM EVENTS: CONNECT, SUBSCRIBE PUBLISH, 
			handlePacket(packet, auth, socket, topics);

			setTimeout(() => {
				socket.resume();// Stop socket communication for 1 second. Impedes overload of requests for the broker.
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
