import express from 'express';
import amqp, { Channel, Connection } from 'amqplib';

const PORT = 3002;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let connection: Connection;
let channel: Channel;

async function connectQueue() {
  try {
    connection = await amqp.connect('amqp://localhost:5672');
  channel = await connection.createChannel();
    await channel.assertQueue('analytics');
    await channel.assertQueue('drink-order');
    channel.consume('drink-order', async (data) => {
      const { content } = data;
      const { order, customer } = JSON.parse(content.toString());
      console.log(`${order} being fulfilled for ${customer}`);
      channel.ack(data!);
      await sendOrderData({order, customer})
    })
  } catch (e) {
    console.error(e);
}
} 

async function sendOrderData(data) {
  await channel.sendToQueue('analytics', Buffer.from(JSON.stringify(data)))
}

connectQueue()

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
