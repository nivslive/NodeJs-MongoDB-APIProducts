import express from 'express'
import Order from '../models/Order'
import mongoose from 'mongoose';
import Product from '../models/Product';
import multer from 'multer';
import OrdersController from '../controllers/orders';
const upload = multer({
    dest: '/uploads/'
});

const express = express();
const router = express.Router();



router.get('/', OrdersController.get_all);
router.post('/', OrdersController.create_order);
router.get("/:orderId", OrdersController.get_one);
router.patch("/:orderid", OrdersController.update);
router.delete("/:orderId", OrdersController.delete);


export default router;