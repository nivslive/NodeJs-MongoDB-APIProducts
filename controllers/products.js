import Product from "../models/Product";

export default class ProductsController {
    get_all(req, res, next) {
        Product
            .find()
            .select("id name price productImage")
            .exec()
            .then(docs => { 
    
                const response = {
                    count: docs.length,
                    products: docs.map(doc => {
                        return {
                            name: doc.name,
                            price: doc.price,
                            id: doc.id,
                            productImage: doc.productImage,
                            request: {
                                type: "GET",
                                url: 'http://localhost/products/' + doc.id,
    
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
    }
    create(req, res, next) {
    
        const productData = {
            id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            productImage: req.file.path,
        };
        
        const product = new Product(productData);
        product.save()
            .then(result => {
            console.log(result);
        })
            .catch(err => console.log(err));
    
        res.status(201).json({
            message: 'handling POST requests to /products',
            createdProduct: {
                name: result.name,
                price: result.price,
                id: result.id,
                request: {
                    type: "GET",
                    url: 'http://localhost/products/' + result.id,
                }
            },
        });
    }


    get_one(req, res, next) {
        const id = req.body.productId;
        Product.findById(id).exec().then((doc) => {
            console.log(doc)
            if(doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost/products/',
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
    }

    update(req, res, next) {
        const id = req.params.productId;
        
        const updateOps = {};
    
        for (const ops of req.body) {
            updateOps[ops.propName] = ops.value;
        }
        
        // $set: {
        //     name: req.body.name,
        //     price: req.body.price,
        // }
    
        Product.update({id: id}, {$set: {updateOps}})
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
    }

    delete(req, res, next) {
        const id = req.params.productId;
        Product.remove({
            id: id,
        }).exec().then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: "POST",
                    url: 'http://localhost/products/' + doc.id,
                    body: {
                        name: "String",
                        price: "Number",
                    }
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: err,
            })
        });
    }
}