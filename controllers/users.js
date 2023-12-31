import User from '../models/User'
import bcrypt from 'bcrypt';


export default class UsersController {
    singup (req, res, next) {   
        User.find({
         email: req.body.email
        }).exec().then(user => {
         if(user.length >= 1) {
             return res.status(409).json({
                 message: "Mail exists",
             })
         } else {
             bcrypt.hash(req.body.password, 10, (err, hash) => {
                 if(err) {
                    return res.status(500).json({
                         error: err
                    });
                 } else {
                     const user = new User({
                         id: new mongoose.Types.ObjectId(),
                         email: req.body.email,
                         password: hash,
                     }); 
         
                     user.
                         save()
                         .then(result => {
                             res.status(500).json({
                                 message: "User created",
                                 user: result,
                             });
                         })
                         .catch(err => {
                             console.log(err);
                             res.status(500).json({
                                 error: err,
                             })
                         })
                 }
             })    
         }
        }).catch(err =>  {
             console.log(err);
             res.status(500).json({
                 error: err,
             })
         }
        );
     
    }

    login(req, res, next) {
        User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1) {
                return res.status(404).json({
                    message: 'Auth failed',
                });
            }
    
            bcrypt.compare(req.body.password, user[0].password)
            .then((err, res) => {
                if(err) {
                    return res.status(401).json({
                        message: 'Auth failed',
                    })
                }
                if(res) {
                    json.sign({
                        email: user[0].email,
                        userId: user[0].id,
                    }, process.env.JWT_KEY,
                    {
                        expiresIn: "1h",
                    });
                    return res.status(200).json({
                        message: 'Auth successfuly!',
                        token,
                    })
                }
            });
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
    }

    delete(req, res, next) {
        User.remove({id: req.params.id})
        .exec()
        .then(res => {
            res.status(200).json({
                message: "User deleted",
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
            }      
        );
    }
}

