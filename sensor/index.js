const net = require("net");
require("dotenv").config();
const MqttPacket = require("../packetFormatter");

// Função que mostra os dados do paciente a cada segundo
function displayData() {
	console.log(heartbeat, bloodGlucose, bloodPressure, bodyTemperature, breathingRate, oxygenSaturation)
}
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
				username: "Nurse 1",
				password: "password",
				patientId: 5,
			}).toJson()
		);

		setInterval(
			() =>
				client.write(
					new MqttPacket({
						code: 3,
						topic: "patients/5",
						value: {
							heartbeat: Math.floor(Math.random() *111) + 50,
							bloodGlucose: Math.floor(Math.random() *110) + 60,
							bloodPressure: Math.floor(Math.random() *131) +70,
							bodyTemperature: Math.floor(Math.random() *42) +34,
							breathingRate: Math.floor(Math.random() *30) +8,
							oxygenSaturation: Math.floor(Math.random() * 101) +77,
						},
					}).toJson()
				),
			displayData, 1000
		);

		client.on("data", (data) => {
			console.log(data.toString());
		});

		client.on("end", () => {
			console.log("Disconnected");
		});
	}
);
