import express from 'express'
import mongoose from 'mongoose';
import multer from 'multer';
import checkAuth from '../middleware/check-auth';
import ProductsController from '../controllers/products';



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString(), file.originalname);
    }
});


const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}



const upload = multer(
    {
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024,
    },
    fileFilter,
});

const express = express();
const router = express.Router();



router.get('/', ProductsController.get_all);
router.post('/', checkAuth, upload.single('productImage'), ProductsController.create);
router.get("/:productId", checkAuth, ProductsController.get_one);
router.patch("/:productId", checkAuth, ProductsController.update);
router.delete("/:productId", checkAuth, ProductsController.delete)

export default router;