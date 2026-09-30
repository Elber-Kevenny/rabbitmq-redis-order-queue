import express from 'express';
import amqp, { Channel, Connection } from 'amqplib';

const PORT = 3001;

const app = express();

export interface Drink {
  latte: number,
  coffe: number,
  cappuccine: number,
  [key: string]: number
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let connection: Connection;
let channel: Channel;

const drinkMap: Drink = { latte: 0, coffe: 0, cappuccine: 0 };


async function connectQueue() {
  try {
    connection = await amqp.connect('amqp://localhost:5672');
    channel = await connection.createChannel();
    await channel.assertQueue('analytics');

    channel.consume('analytics', async (data) => {
        const { content } = data;
      const { order, customer } = JSON.parse(content.toString());
      if (drinkMap[order] !== undefined) {
        drinkMap[order]++;
      }
      console.log(`${order} being analyzed for ${customer}`);
      channel.ack(data!);
      
    })
    
  } catch (e) {
    console.error(e);
}
} 

function processDrinkAnalytics() {
  const FIVE_MINUTES_IN_MILLISECONDS = 5 * 60 * 1000;
  const TEN_SECONDS_IN_MILLISECONDS = 10000;

  setInterval(() => {
    const drinkNames = Object.keys(drinkMap);

    const totalDrinkCount = drinkNames.reduce((total, drinkName) => {
      return total + drinkMap[drinkName]
    }, 0);

    const drinkPercentages = drinkNames.map((drinkName) => {
      const percentage = Math.floor((drinkMap[drinkName] / totalDrinkCount) * 100) || 0;
      return `${drinkName}: ${percentage}%`;
    });

    console.log(`Drink orders: ${drinkPercentages}`);

    setTimeout(() => {
      drinkNames.forEach((drinkName) => {
        drinkMap[drinkName] = 0;
      });
    }, FIVE_MINUTES_IN_MILLISECONDS)
  }, TEN_SECONDS_IN_MILLISECONDS)
}

connectQueue();
processDrinkAnalytics();

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
