// import { createClient } from 'redis';
// import 'dotenv/config'

// const redisUrl = process.env.REDIS_URL!;

// const client = createClient({
//   url: redisUrl!
// });

// client.on('error', (err) => {
//   console.error('❌ Redis Client Error:', err.message);
// });
// await client.connect()

// export const subscriber = createClient({ url: redisUrl });
// await subscriber.connect();

// export const publisher = createClient({ url: redisUrl });
// await publisher.connect();

// await subscriber.subscribe('drink-order', (drinkOrder: string) => {
//   console.log(`Received a new ${drinkOrder} order`)
// })

