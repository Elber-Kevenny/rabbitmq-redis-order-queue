import express from 'express';
import { router } from './routes/orderRouter.js';

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router)


app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})