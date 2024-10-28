const net = require("net");
require("dotenv").config();
const MqttPacket = require("../packetFormatter");

// Criar uma socket para comunicar com o servidor

//Adicionar node Args support

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
				username: "tiago",
				password: "pass",
				clientType: "Nurse",
			}).toJson()
		);
		setInterval(
			() =>
				client.write(
					new MqttPacket({
						code: 3,
						topic: "Pacients/3/Something",
						value: 120,
					}).toJson()
				),
			1000
		);

		client.on("data", (data) => {
			console.log(data.toString());
		});

		client.on("end", () => {
			console.log("Disconnected");
		});
	}
);
