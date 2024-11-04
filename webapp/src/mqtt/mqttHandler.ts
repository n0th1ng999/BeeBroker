const mqtt = require('mqtt')

const MQTT_URL = "mqtt://test.mosquitto.org"

const MQTT_OPTIONS = {
    // Clean session
    clean: true,
    connectTimeout: 4000,
    // Authentication
    clientId: 'web_client_test',
    //username: 'emqx_test',
    //password: 'emqx_test',
}

const client = mqtt.connect(MQTT_URL, MQTT_OPTIONS)

client.on('connect', function () {
    console.log('Connected')
    // Subscribe to a topic
    client.subscribe('test', function (err) {
        if (!err) {
            // Publish a message to a topic
            client.publish('test', 'Hello mqtt')
        }
    })
})

// Receive messages
client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
    client.end()
})