import { Request, Response } from 'express'; 
import { sendOrderData } from '../index.js';
import { publisher } from '../services/inventory/index.js';
import { client } from '../services/inventory/index.js';
import { Order } from '../types/typpe.js';
import { ApiError } from '../errors/apiError.js';


export interface drinkOr {
  drinkOrder: string
}

const coffeeQueue: drinkOr[] = []

//simulate a slow order queue
const ped = async (request: Request, response: Response) => {
  const { drinkOrder } = request.body;

  for (let i = 0; i < 10000000000; i++) {
  }
  console.log('ORDER PLACED');
  response.send(`Drink order added to queue: ${drinkOrder}`);
}

const getOrder = async (_request: Request, response: Response) => {
  response.render('orders.hbs');

}

const order = async (request: Request, response: Response) => {
  const { drinkOrder: order, quantity, customer } = request.body;
  if (!order || !quantity || !customer) {
    throw ApiError.badRequest('Fields order, quantity, and customer are required.');
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    throw ApiError.badRequest('Quantity must be a positive number.', {errors: 'negative stock error'});
  }

  const data: Order = {
    order,
    quantity,
    customer,
  }
  await sendOrderData(data)
  await publisher.publish('drink-order', JSON.stringify(data))
  console.log(`Drink: ${order} is being processed for ${customer}`)
  response.send(`Order processing`)

}

const getDashboard = async (_request: Request, response: Response) => {
  response.render('dashBoard.hbs');
}

const getInventory= async (_request: Request, response: Response) => {
  const inventory = await client.hGetAll('inventory');

  if (!inventory || Object.keys(inventory).length === 0) {
    throw ApiError.notFound({errors: 'No inventory data found.'});
  }

  return response.json(inventory);
}

const getCount = async (_request: Request, response: Response) => {
  response.send(`${coffeeQueue.length} drink orders in queue`)
}

export default {
  ped,
  order,
  getInventory,
  getDashboard,
  getOrder,
  getCount
}
