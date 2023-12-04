import express from 'express'
import Order from '../models/Order'
import mongoose from 'mongoose';
import Product from '../models/Product';
import multer from 'multer';
const upload = multer({
    dest: '/uploads/'
});

const express = express();
const router = express.Router();



router.get('/', (req, res, next) => {
    Product
        .find()
        .select("product quantity id")
        .populate('product')
        .exec()
        .then(docs => { 

            const response = {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        quantity: doc.quantity,
                        id: doc.id,
                        request: {
                            type: "GET",
                            url: 'http://localhost/orders/' + doc.id,

                        }
                    }
                }),
            }

            if(docs.length >= 0) {
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: "No entries found"
                })
            }

            console.log(docs)
        })
        .catch(err => console.log(err));
    // res.status(200).json({
    //     message: 'Handling GET requests to /products'
    // });
});


router.post('/', (req, res, next) => {
    
    const orderData = {
        id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
    };
    

    Product.findById(req.body.productId)
        .then(doc => {
            console.log(doc);
        })
        .catch(err => {
            res.status(500).json({
                message: "Product not found"
            })
        })


    const order = new Order(orderData);
    order
        .save()
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));

    res.status(201).json({
        message: 'handling POST requests to /products',
        createdProduct: {
            quantity: result.quantity,
            id: result.id,
            request: {
                type: "GET",
                url: 'http://localhost/orders/' + result.id,
            }
        },
    });
});


router.get("/:orderId", (req, res, next) => {
    const id = req.body.orderId;
    Order.findById(id).exec().then((doc) => {
        console.log(doc)
        if(doc) {
            res.status(200).json({
                order: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost/order/' + doc.id,
                }
            });
        } else {
            res.status(404).json({
                message: "No valid entry found for provided ID",
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err,
        })
    });


    // if(id === "special") {
    //     res
    //         .status(200)
    //         .json({
    //             message: "You discovered the special ID",
    //             id: id,
    //         });
    // } else {
    //     res.status(200).json({
    //         message: "You passed an ID",
    //     });
    // }
});


router.patch("/:orderid", (req, res, next) => {
    const id = req.params.orderid;
    
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    
    // $set: {
    //     name: req.body.name,
    //     price: req.body.price,
    // }

    Order.update({id: id}, {$set: {updateOps}})
        .then(result => {
            console.log(result);
            res.status(200).json({
                result,
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            })
        });
});

router.delete("/:orderId", (req, res, next) => {
    const id = req.params.orderid;
    Order.remove({
        id: id,
    }).exec().then(result => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: "POST",
                url: 'http://localhost/orders/' + doc.id,
                body: {
                    productId: "Moongose.Types.ObjectId",
                    quantify: "Number",
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: err,
        })
    });
});


export default router;