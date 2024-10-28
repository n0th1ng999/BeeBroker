const packetTypes = [
	{
		code: 1,
		type: "CONNECT",
		requiredParams: ["password", "username", "clientType"],
	},
	{
		code: 2,
		type: "CONNACK",
		requiredParams: ["authState", "responseCode", "responseDetails"],
	},
	{
		code: 3,
		type: "PUBLISH",
		requiredParams: ["topic", "value"],
	},
	{
		code: 4,
		type: "PUBACK",
		requiredParams: ["topic", "responseCode", "responseDetails"],
	},
	{
		code: 8,
		type: "SUBSCRIBE",
		requiredParams: ["topic"],
	},
	{
		code: 9,
		type: "SUBACK",
		requiredParams: ["topic", "value", "responseCode", "responseDetails"],
	},
];

class MqttPacket {
	//Transform into JSON
	toJson() {
		return JSON.stringify(this.payload);
	}

	/**
	 * @param {{topic: Boolean,
	 * value: Number,
	 *  authState:Boolean,
	 *  responseCode:Number,
	 * responseDetails: String}} payload
	 */
	constructor(payload) {
		this.payload = payload;
		this.packetType = this.getPacketType(payload.code);
		this.validate();
	}

	// Find the packet type based on the packet code
	getPacketType(code) {
		const packetType = packetTypes.find((packet) => packet.code === code);
		if (!packetType) {
			throw new Error(`Unknown packet code: ${code}`);
		}
		return packetType;
	}

	// Validate that the packet contains all required parameters
	validate() {
		if (!this.packetType) {
			throw new Error("Packet type is not defined.");
		}

		const { requiredParams } = this.packetType;
		for (const param of requiredParams) {
			const missingParamList = [];

			if (!this.payload.hasOwnProperty(param)) {
				missingParamList.push(param);
			}

			if (missingParamList.length > 0) {
				throw new Error(
					`Missing required parameter(s): ${missingParamList.join(", ")}`
				);
			}
		}

		//console.log(`Packet of type ${this.packetType.type} is valid.`);
	}
}

module.exports = MqttPacket;
