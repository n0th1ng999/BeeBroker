const MqttPacket = require("../../packetFormatter");
const Route = require("../models/RouteModel");
const User = require("../models/UserModel");

// -----Helper functions --------------------------------

const routeFinderIndex = (uri, serverTopics) => {
	// Convert the `uri` pattern to a regular expression

	const regex = new RegExp(
		"^" +
			uri
				.replace(/\//g, "\\/") // Escape slashes
				.replace(/\+/g, "[^\\/]+") // `+` matches one segment
				.replace(/#/g, ".*") + // `#` matches any segments after
			"$" // Add $ to enforce end-of-string match
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
		socket.end();

		return parsedPacket;
	}
};
// -----Helper functions --------------------------------

// The handler functions for packet communication with clients
const packetHandlers = [
	{
		type: "CONNECTION",
		code: 1,
		function: async (
			{ username, password, patientId },
			auth,
			serverTopics,
			socket
		) => {
			try {
				//Search for user and password

				if (username && password) {
					const foundUser = await User.findOne({ username, password });

					if (!foundUser) {
						const connack = new MqttPacket({
							authState: auth,
							responseCode: 0,
							responseDetails:
								"Could not connect because user credentials are wrong",
							code: 2,
						});

						socket.write(connack.toJson());
						socket.end();
						return;
					}

					if (foundUser.roles.find((role) => role === "Publisher"))
						auth.publish = true;

					if (foundUser.roles.find((role) => role === "Subscriber"))
						auth.subscribe = true;

					if (patientId) auth.patientId = patientId;

					const connack = new MqttPacket({
						authState: auth,
						responseCode: 0,
						responseDetails: `Successufully Connected, Permissions:
						Subscribe Permission : ${auth.subscribe}
						Publish Permission : ${auth.publish}`,
						code: 2,
					});

					socket.write(connack.toJson());
					return;
				}

				// IN CASE OF FAILED CONNECTION
			} catch (error) {
				const connackError = new MqttPacket({
					code: 2,
					authState: false,
					responseCode: 0,
					responseDetails: `error : ${error.message}`,
				});

				socket.write(connackError.toJson());
				socket.end();
			}
		},
	},
	{
		type: "PUBLISH",
		code: 3,
		function: async ({ topic, value }, auth, serverTopics, socket) => {
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
				if (auth.publish !== true) {
					// Inicialize a auth error packet
					puback = new MqttPacket({
						code: 4,
						topic,
						value,
						responseCode: 0,
						responseDetails: `Error: This account is not authorized to publish data!`,
					});

					socket.write(puback.toJson());
					return;
				}
				const topicsIndexes = routeFinderIndex(topic, serverTopics);

				// Add a new route to the route stack if no wildcard is used and route does not exist
				if (topic.includes("#") || topic.includes("+")) {
					puback = new MqttPacket({
						code: 4,
						topic,
						value,
						responseCode: 0,
						responseDetails: `Error: No wildcars are allowed for publishing "${topic}"`,
					});
					socket.write(puback.toJson());
					socket.end();
					return;
				}

				// If more than one route matches criteria, send an error message
				if (topicsIndexes.length > 1) {
					puback = new MqttPacket({
						code: 4,
						topic,
						value,
						responseCode: 0,
						responseDetails: `Error: More than one route matches criteria "${topic}"`,
					});
					socket.write(puback.toJson());
					socket.end();
					return;
				}

				// Send error if patientId was not given at connection
				if (!auth.patientId) {
					puback = new MqttPacket({
						code: 4,
						topic,
						value,
						responseCode: 0,
						responseDetails: `Error: Patient ID is required for publishing"`,
					});
					socket.write(puback.toJson());
					socket.end();
					return;
				}

				// An error if client is trying to publish
				// in a route that is not theirs
				const topicRegex = /^patients\/(?<patientId>[0-9]+)(?:\/.*)?$/;
				const match = topic.match(topicRegex);

				// If topic does not match patientId, send an error message
				if (!match || match.groups.patientId != auth.patientId) {
					const puback = new MqttPacket({
						code: 4,
						topic,
						value,
						responseCode: 0,
						responseDetails: `Error: Client is not authorized to publish data for this patient: ${auth.patientId}`,
					});
					socket.write(puback.toJson());
					socket.end();
					return;
				}

				//Create new topic and publish data
				if (topicsIndexes.length == 0) {
					puback = new MqttPacket({
						code: 4,
						topic,
						value,
						responseCode: 0,
						responseDetails: `Data published successfully! New topic created.`,
					});

					serverTopics.push({
						topic,
						value,
						publisherAddress: socket.address(),
					});

					const route = await Route.create({ topic, value: { value } });

					await route.save();

					socket.write(puback.toJson());
					return;
				}

				// TODO: When client tries to publish in a route that already has a publisher
				// !Throw error

				//if (topicsIndexes.length == 1) {
				//if(serverTopics[0]?.publisherAddress){}
				//}

				//Publish data to existing topic
				if (topicsIndexes.length == 1) {
					puback = new MqttPacket({
						code: 4,
						topic,
						value,
						responseCode: 0,
						responseDetails: `Data published successfully! New topic created.`,
					});
					serverTopics[0].value = value;
					serverTopics[0].publisherAddress = socket.address();

					const routeToUpdate = await Route.findOne({ topic });

					routeToUpdate.topic = topic;
					routeToUpdate.value.push({ value });

					await routeToUpdate.save();

					//console.log(serverTopics);

					puback = new MqttPacket({
						code: 4,
						topic,
						value,
						responseCode: 0,
						responseDetails: `Data published successfully!`,
					});

					socket.write(puback.toJson());
					return;
				}
			} catch (error) {
				console.error(error);
				socket.write(puback.toJson());
			}
		},
	},
	{
		type: "SUBSCRIBE",
		code: 8,
		function: async ({ topic }, auth, serverTopics, socket) => {
			let suback = new MqttPacket({
				code: 9,
				topic,
				value: undefined,
				responseCode: 0,
				responseDetails: `Error: Server Error.`,
			});

			try {
				// Inicialize a default error packet
				console.log("here !!!");

				if (auth.subscribe !== true) {
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
					socket.end();
					return;
				}

				// SEND DATA EACH TIME IT'S DATA IS PUBLISHED IN SUBSCRIBED CHANNELS
				let topicsIndexes = routeFinderIndex(topic, serverTopics);

				if (topicsIndexes.length <= 0) {
					suback = new MqttPacket({
						code: 9,
						topic,
						value: null,
						responseCode: 0,
						responseDetails: `Topic(s) not found. Subscription failed.`,
					});

					socket.write(suback.toJson());
					socket.end();
					return;
				}

				// SUCCESS RESPONSE TO SUBSCRIBE
				suback = new MqttPacket({
					code: 9,
					topic,
					value: serverTopics[topicsIndexes],
					responseCode: 0,
					responseDetails: `Subscribed with success.`,
				});

				socket.write(suback.toJson());

				let oldSubscribedTopics = JSON.stringify(
					topicsIndexes.map((topicIndex) => serverTopics[topicIndex])
				);

				console.log(topicsIndexes);

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

	//End session if packet handler is not found
	if (!packetHandler) {
		socket.end();
		console.error("Packet Type is not supported");
		return;
	}

	// Call packet handler function with packet data
	// Throw error if packet handler function throws an error
	packetHandler.function(packet, auth, serverTopics, socket); // Pass through the serverTopics and socket
};
