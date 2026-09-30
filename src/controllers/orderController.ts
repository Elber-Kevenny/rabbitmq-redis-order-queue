import { Request, Response } from 'express'; 
import { sendOrderData } from '../index.js';


export interface Order {
  drinkOrder: string
}

const coffeeQueue: Order[] = []

const ped = async (request: Request, response: Response) => {
  const { drinkOrder } = request.body;

  for (let i = 0; i < 10000000000; i++) {

  }
  console.log('ORDER PLACED');
  response.send(`Drink order added to queue: ${drinkOrder}`);
}

const order = async (request: Request, response: Response) => {
  const { drinkOrder: order, cost, customer } = request.body;
  const data = {
    order,
    customer
  }
  await sendOrderData(data);

  console.log(`Drink: ${order} is being processed for ${customer}`)
  response.send(`Order processing`)
}

const getOrder = async (_request: Request, response: Response) => {
  const nextOrder = coffeeQueue.shift();

  if (nextOrder) {
    response.send({order: nextOrder})
  } else {
    response.send('No drink orders in queue')
  }
  
}

const getCount = async (_request: Request, response: Response) => {
  response.send(`${coffeeQueue.length} drink orders in queue`)
}

export default {
  ped,
  order,
  getOrder,
  getCount
}
