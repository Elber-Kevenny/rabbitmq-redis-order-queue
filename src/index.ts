//index princ
import express from 'express';
import amqp, { Channel, Connection } from 'amqplib';
import { engine } from 'express-handlebars';
import { router } from './routes/orderRouter.js';
import path from 'node:path';
import { Order } from './types/typpe.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

const PORT = 3000;

const app = express();
app.engine('.hbs', engine({ 
  extname: '.hbs', 
  defaultLayout: false 
}));

app.set('view engine', '.hbs');

app.set('views', path.join(process.cwd(), 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router)
app.use('/scripts', express.static(path.join(process.cwd(), 'src', 'scripts')));
app.use('/scripts', express.static(path.join(process.cwd(), 'dist', 'scripts')));
app.use(errorMiddleware)


let connection: Connection;
let channel: Channel;

async function connect() {
  try {
    // @ts-expect-error
    connection = await amqp.connect('amqp://localhost:5672');
    // @ts-expect-error
    channel = await connection.createChannel();
    await channel.assertQueue('drink-order');
  } catch (e) {
    console.error(e);
}
} 
export async function sendOrderData(data: Order) {
  await channel.sendToQueue('drink-order', Buffer.from(JSON.stringify(data)))
}

connect()

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
