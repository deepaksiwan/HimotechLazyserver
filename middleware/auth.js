const jwt = require('jsonwebtoken');
const profileModel = require('../models/profileModel');
require("dotenv").config()

const verifyToken=(req, res, next) =>{
    const { authorization } = req.headers
        try {
            if (authorization && authorization.startsWith('Bearer')) {
                      // Get Token from header
                const token = authorization.split(' ')[1]
                jwt.verify(token, process.env.JWT_SECRET_KEY, (err, result) => {
                    if (err) {
                        if (err.name == "TokenExpiredError") {
                            return res.status(440).send({responseCode: 440,responseMessage: "Session Expired, Please login again.",});
                        }
                        else {
                            return res.status(440).send({responseCode: 440,responseMessage: "Unauthroised Person  .",});
                        }
                    }
                    else {
                        profileModel.findOne({ _id: result.userId }, (error, result2) => {
                            // console.log(result.userId);
                            if (error) {
                                
                                return next(error)
                            }
                            else if (!result2) {
                                
                                return res.status(404).json({ responseCode: 404, responseMessage: "USER NOT FOUND" })
                            }
                            else {

                                req.userId = result2._id;
                                next();

                            }
                        })
                    }
                })
            } else {
                return res.send({ responsecode: 409, responseMessage: "No Token Found" });
            }
        } catch (error) {
            return res.send({ responsecode: 501, responseMessage: "Something went Wrong", responseResult: error.message });

        }
}


module.exports = {verifyToken}











