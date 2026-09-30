import express from 'express';
import orderController from '../controllers/orderController.js'


export const router = express.Router();


router.post('/slow-order', orderController.ped)
router.post('/order', orderController.order)
router.get('/process-order', orderController.getOrder)
router.get('/order-count', orderController.getCount)
