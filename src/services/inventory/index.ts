import { createClient } from 'redis';
import 'dotenv/config'



const redisUrl = process.env.REDIS_URL!;

export const client = createClient({
  url: redisUrl!
});

client.on('error', (err) => {
  console.error('❌ Redis Client Error:', err.message);
});
client.on('connect', () => {
  console.log('Redis Client on');
});

await client.connect()

export const subscriber = createClient();
await subscriber.connect();

export const publisher = createClient();
await publisher.connect();

const initRedisInventory = async () => {
  const exists = await client.exists('inventory');
  if (!exists) {
    await client.hSet('inventory', {
      latte: 10,
      coffe: 10,
      cappuccino: 10,
    });
    console.log('📦 Stock initialized in Redis Hash.');
  }
}

await initRedisInventory();

setInterval(async () => {
  try {

    await client.hSet('inventory', {
      latte: 10,
      cappuccino: 10,
      coffe: 10,
    })
    console.log('Stock replenished to the standard value.')
  } catch (e) {
    console.error('Failed to replenish stock in Redis:', e);
    }
  }, 300000)

await subscriber.subscribe('drink-order', async (message: string) => {
  let drinkOrder = message;
  let quantity = 1;

  try {
    const parsed = JSON.parse(drinkOrder);
    if (parsed.order || parsed.drinkOrder) {
      drinkOrder = parsed.order || parsed.drinkOrder;;
      quantity = Math.max(1, parseInt(parsed.quantity, 10) || 1)
    }
   
  } catch { }
  

  const currentStockStr = await client.hGet('inventory', drinkOrder);
  
  if (currentStockStr === null) {
       console.log(`${drinkOrder} it is not in stock.`)
       return
    }
      const currentStock = parseInt(currentStockStr, 10)
    
  if (currentStock < quantity) {
    console.log(`⚠️ Not enough ${drinkOrder} in stock. Available: ${currentStock}, Requested: ${quantity}`);
    return;
  }

  const newStock = await client.hIncrBy('inventory', drinkOrder, -quantity)
  console.log(` Order processed: ${quantity}x ${drinkOrder}. Remaining stock: ${newStock}`);

  if (newStock < 3) {
    console.log(`Low stock for ${drinkOrder}: ${newStock} remaining`);
  }
})



