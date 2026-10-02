import express from 'express';
import amqp, { Channel, Connection } from 'amqplib';

const PORT = 3002;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let connection: Connection;
let channel: Channel;
// let orderCount = 0;


async function connectQueue() {
  try {
    // @ts-expect-error
    connection = await amqp.connect('amqp://localhost:5672');
    // @ts-expect-error
  channel = await connection.createChannel();
    await channel.assertQueue('analytics');
    await channel.assertQueue('drink-order');
    channel.consume('drink-order', async (data) => {
      // @ts-expect-error
      const { content } = data;
      const { order, customer } = JSON.parse(content.toString());
      // if (order) {
      //   orderCount++
      // } 
      
      // if (orderCount % 3 === 0) {

      //   const ms
      // g = { message: 'trying again' };
      //   const bufferMsg = Buffer.from(JSON.stringify(msg));
      //   await channel.sendToQueue('analytics', bufferMsg)
      //   console.log('message error send')
      //   channel.nack(data!, false, true)

      //   return
      // }
      console.log(`${order} being fulfilled for ${customer}`);
      channel.ack(data!);
      await sendOrderData({order, customer})
    })
  } catch (e) {
    console.error(e);
}
} 

async function sendOrderData(data: any) {
  await channel.sendToQueue('analytics', Buffer.from(JSON.stringify(data)))
}

connectQueue()

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
