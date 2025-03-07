# BeeBroker 🐝  
Um projeto académico que pretende reproduzir um sistema MQTT e todos os seus componentes.  

O projeto é baseado num **Servidor TCP em Node.js** e num **Servidor WebSocket**, que gerem a comunicação entre sensores simulados e uma aplicação web. Os **sensores simulados** são ficheiros de script em Node.js que interagem com o servidor TCP através de **pacotes MQTT**, utilizando a biblioteca `mqtt.js`. Por outro lado, a **aplicação web** conecta-se ao servidor WebSocket, adquirindo dados dos pacientes em tempo real através de **canais subscritos**.  

Este sistema permite a monitorização biométrica 💻⚕️ de pacientes hospitalares, possibilitando o acompanhamento em tempo real de sinais vitais como batimentos cardíacos, pressão arterial, nível de glicemia, temperatura corporal, frequência respiratória e saturação de oxigénio.  

## Configuração ⚙️  
`npm install` - Instalar os módulos NPM  

## Comandos 💻  
*Executar em terminais separados!*  

`npm run dev -broker` - Executar o Broker MQTT  

`npm run dev -sensor` - Executar a emulação de sensores  

`npm run dev -webapp` - Executar a WebApp
