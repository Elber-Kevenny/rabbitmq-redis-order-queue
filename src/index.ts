import express from 'express';
import amqp, { Channel, Connection } from 'amqplib';
import { router } from './routes/orderRouter.js';

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router)
let connection: Connection;
let channel: Channel;

async function connect() {
  try {
    connection = await amqp.connect('amqp://localhost:5672');
    channel = await connection.createChannel();
    await channel.assertQueue('drink-order');
  } catch (e) {
    console.error(e);
}
} 
export async function sendOrderData(data) {
  await channel.sendToQueue('drink-order', Buffer.from(JSON.stringify(data)))
}

connect()

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
