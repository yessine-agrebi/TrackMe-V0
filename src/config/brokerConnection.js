import mqtt from 'mqtt';
import dotenv from 'dotenv'
dotenv.config()
// MQTT broker connection details
const host = process.env.HOST;
const port = process.env.PORT;
const username = process.env.FLESPITOKEN;
const clientId = process.env.CLIENT_ID;

// MQTT topic to subscribe to
const topic = 'flespi/state/gw/devices/#'; // Replace with the topic specific to your GT06N device

// Create MQTT client
const client = mqtt.connect(`wss://${host}:${port}`, {
  clientId: clientId,
  username: username,
  clean: true,
});

// Export the MQTT client object
export const mqttClient = client;

// Function to initialize MQTT client and subscribe to the topic
export function initializeMqtt() {
  client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(topic, (err) => {
      if (err) {
        console.error('Error while subscribing:', err);
      } else {
        console.log('Subscribed to topic:', topic);
      }
    });
  });

  client.on('message', (topic, message) => {
    console.log('Received message:', message.toString());
    // Process the received message as per your requirements
  });

  client.on('error', (err) => {
    console.error('Error:', err);
  });

  client.on('close', () => {
    console.log('Connection closed');
  });
}
