# BeeBroker 🐝  
An academic project aimed at reproducing an MQTT system and all its components.  

The project is built around a **Node.js TCP Server** and a **WebSocket Server**, which handle communication between simulated sensors and a web application. The **simulated sensors** are Node.js script files that interface with the TCP server using **MQTT packets** via the `mqtt.js` library. Meanwhile, the **web application** connects to the WebSocket server, acquiring real-time patient data through **subscribed channels**.  

This system enables biometric monitoring 💻⚕️ for hospital patients, allowing real-time tracking of vital signs such as heart rate, blood pressure, blood glucose levels, body temperature, respiratory rate, and oxygen saturation.  

## Setup ⚙️  
`npm install` - Install NPM modules  

## Commands 💻  
*Run in separate terminals!*  

`npm run dev -broker` - Run the MQTT Broker  

`npm run dev -sensor` - Run sensor emulation  

`npm run dev -webapp` - Run the WebApp
