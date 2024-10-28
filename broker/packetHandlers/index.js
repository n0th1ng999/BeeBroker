const MqttPacket = require("../../packetFormatter");

// -----Helper functions --------------------------------

const routeFinderIndex = (uri, serverTopics) => {
	// Convert the `uri` pattern to a regular expression

	const regex = new RegExp(
		"^" +
			uri
				.replace(/\//g, "\\/") // Escape slashes
				.replace(/\+/g, "[^\\/]+") // `+` matches one segment
				.replace(/#/g, ".*") // `#` matches any segments after
	);

	// Collect indices of serverTopics that match the regex
	const foundIndexes = serverTopics
		.map((item, index) => (regex.test(item.topic) ? index : -1))
		.filter((index) => index !== -1); // Filter out non-matching indices

	return foundIndexes;
};

//Parse the packet to string and check if it is JSON formatted
const packetParser = (packet, socket) => {
	let parsedPacket = null;

	try {
		parsedPacket = packet.toString();

		parsedPacket = JSON.parse(packet);

		return parsedPacket;
	} catch {
		socket.write("Invalid packet format! Make sure it is JSON formatted");

		console.error("Invalid packet format! Make sure it is JSON formatted");

		return parsedPacket;
	}
};
// -----Helper functions --------------------------------

// The handler functions for packet communication with clients
const packetHandlers = [
	{
		type: "CONNECTION",
		code: 1,
		function: (
			{ clientType, username, password },
			auth,
			serverTopics,
			socket
		) => {
			try {
				//Search for user and password

				if (clientType && username && password) {
					// TODO: Check if user and password exist in database
					// TODO: Verify client type and return appropriate response
					auth.subscribe = true;
					auth.publish = true;
				}

				// IN CASE OF SUCCESS IN CONNECTION

				if (auth.publish === true) {
					// TODO: Change for packet CONNACK

					//Initialize mqtt packet
					const connack = new MqttPacket({
						authState: true,
						responseCode: 0,
						responseDetails: "Successfully connected",
						code: 2,
					});

					// console.log(connack.toJson());
					socket.write(connack.toJson());

					return;
				}

				// IN CASE OF FAILED CONNECTION
			} catch (error) {
				const connackError = new MqttPacket({
					code: 2,
					authState: false,
					responseCode: 0,
					responseDetails: `erorr : ${error.message}`,
				});

				// TODO: Change for packet CONNACK
				socket.write(connackError.toJson());
				socket.end();
			}
		},
	},
	{
		type: "PUBLISH",
		code: 3,
		function: ({ topic, value }, auth, serverTopics, socket) => {
			// Description: Change data of topic or create new one

			// Inicialize a default error packet
			let puback = new MqttPacket({
				code: 4,
				topic,
				value,
				responseCode: 0,
				responseDetails: `Error: Server error!`,
			});

			try {
				if (auth.publish === false) {
					// Inicialize a auth error packet
					puback = new MqttPacket({
						code: 4,
						topic,
						value,
						responseCode: 0,
						responseDetails: `Error: not authorized! 
						Please Connect first with the
						correct username and password to publish.`,
					});

					socket.write(puback.toJson());
					return;
				}

				// TODO add an error if client is trying to publish
				// in a route that is not theirs
				// for example if pacient 1 is trying to publish in Pacients/2
				// an error will be returned

				const topicsIndexes = routeFinderIndex(topic, serverTopics);

				// Add a new route to the route stack if no wildcard is used and route does not exist
				if (topicsIndexes.length == 0) {
					if (topic.includes("#") || topic.includes("+")) {
						puback = new MqttPacket({
							code: 4,
							topic,
							value,
							responseCode: 0,
							responseDetails: `Error: No topic matches the expression "${topic}"`,
						});
						socket.write(puback.toJson());
						return;
					}
					//todo: emit publish to subscribed channels
					puback = new MqttPacket({
						code: 4,
						topic,
						value,
						responseCode: 0,
						responseDetails: `Data published successfully! New topic created.`,
					});

					serverTopics.push({ topic, value });
					socket.write(puback.toJson());
					return;
				}

				for (const topicIndex of topicsIndexes) {
					serverTopics[topicIndex].value = value;
				}

				puback = new MqttPacket({
					code: 4,
					topic,
					value,
					responseCode: 0,
					responseDetails: `Data published successfully!`,
				});
				//todo: emit publish to subscribed channels
				socket.write(puback.toJson());
			} catch (error) {
				socket.write(puback.toJson());
			}
		},
	},
	{
		type: "SUBSCRIBE",
		code: 8,
		function: ({ topic }, auth, serverTopics, socket) => {
			let suback = new MqttPacket({
				code: 9,
				topic,
				value: undefined,
				responseCode: 0,
				responseDetails: `Error: Server Error.`,
			});

			try {
				// Inicialize a default error packet

				if (auth.subscribe === false) {
					// Inicialize a auth error packet
					suback = new MqttPacket({
						code: 9,
						value: undefined,
						topic,
						responseCode: 0,
						responseDetails: `Error: not authorized! 
                        Please Connect first with the
                        correct username and password to subscribe.`,
					});

					socket.write(suback.toJson());
					return;
				}

				// SUCCESS RESPONSE TO SUBSCRIBE
				suback = new MqttPacket({
					code: 9,
					topic,
					value: null,
					responseCode: 0,
					responseDetails: `Subscribed with success.`,
				});

				socket.write(suback.toJson());

				// SEND DATA EACH TIME IT'S DATA IS PUBLISHED IN SUBSCRIBED CHANNELS
				let topicsIndexes = routeFinderIndex(topic, serverTopics);

				let oldSubscribedTopics = JSON.stringify(
					topicsIndexes.map((topicIndex) => serverTopics[topicIndex])
				);

				setInterval(() => {
					topicsIndexes = routeFinderIndex(topic, serverTopics);

					const newSubscribedTopics = JSON.stringify(
						topicsIndexes.map((topicIndex) => serverTopics[topicIndex])
					);

					if (oldSubscribedTopics !== newSubscribedTopics) {
						oldSubscribedTopics = newSubscribedTopics;

						const publish = new MqttPacket({
							code: 3,
							topic,
							value: newSubscribedTopics,
							responseCode: 0,
							responseDetails: `Subscribed topics updated!`,
						});

						socket.write(publish.toJson());
					}
				}, 1000);
			} catch (error) {
				console.error(error);
				socket.write(suback.toJson());
				return;
			}
		},
	},
];

//Packets parsed and handled according to the packet type
/** Initialize packet handling logic
 * @param {*} packet payload of the packet
 * @param {{publish: boolean , subscribe:boolean}} auth authorization state for publish and subscribe
 * @param {*} socket tcp socket handling
 * @param {*} serverTopics current server topics
 * @returns
 */
exports.handlePacket = (packet, auth, socket, serverTopics) => {
	// Try to transform buffer into packet
	// If it doesn't return an object then return and end connection
	packet = packetParser(packet, socket);
	if (!packet) {
		socket.end();
		return;
	}

	//Find packet handler for packet type
	const packetHandler = packetHandlers.find(
		(packetHandler) => packetHandler.code == packet?.code // in case message has no code
	);

	//Throw error if packet handler not found
	if (!packetHandler) throw new Error("Packet Type is not supported");

	// Call packet handler function with packet data
	// Throw error if packet handler function throws an error
	packetHandler.function(packet, auth, serverTopics, socket); // Pass through the serverTopics and socket
};
