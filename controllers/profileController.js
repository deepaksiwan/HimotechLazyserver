const ProfileModel=require('../models/profileModel')
const Joi=require("joi");
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const responseCodes = require("../utils/responseCodes")
const responseMessage = require("../utils/responseMessage");
const { default: mongoose } = require('mongoose');
const common=require("../utils/common")
require("dotenv").config();

const signup=async (req, res, next) => {
    const validationSchema = {
        email:Joi.string().required(),
        userName:Joi.string().required(),
        password:Joi.string().required()
    }
    try {
    const validatedBody = await Joi.validate(req.body, validationSchema);
    const { email, userName,password } = validatedBody
    // console.log(validatedBody);
    const user = await ProfileModel.findOne({$or:[{ email: email},{userName:userName}]})
    if (user) {
        return res.json({ responseCode: responseCodes.ALREADY_EXIST, responseMessage: responseMessage.USER_ALREADY })
    }else{
            const salt = await bcryptjs.genSalt(10)
            const userSave = await ProfileModel({
                userName:userName,
                email: email,
                password: bcryptjs.hashSync(password,salt),
                walletId:new mongoose.Types.ObjectId()

            });
            await userSave.save();
            if(userSave){
            const token = jwt.sign({ userId: userSave._id },process.env.JWT_SECRET_KEY, { expiresIn: "5d" })
            return res.json({ responseCode: responseCodes.SUCCESS, responseMessage: responseMessage.SIGN_UP,token:token,responseResult: userSave })
            }else{
                return res.json({ responseCode: responseCodes.SOMETHING_WRONG, responseMessage: responseMessage.SOMETHING_WRONG, responseResult: [] })
            }
        }
    
}
catch (error) {
    return res.json({ responseCode: responseCodes.SOMETHING_WRONG, responseMessage: responseMessage.SOMETHING_WRONG, responseResult: error })
}
}


const login=async(req,res)=>{
    const validationSchema = {
        email:Joi.string().required(),
        password:Joi.string().required()
    }
try {
    const validatedBody = await Joi.validate(req.body, validationSchema);
    const { email, password } = validatedBody
    const user = await ProfileModel.findOne({ email: email});

    if (user) {

            const isMatch = await bcryptjs.compareSync(password, user.password)
            if (isMatch == true) {
                const token = jwt.sign({ userId: user._id },
                    process.env.JWT_SECRET_KEY, { expiresIn: "5d" })
                return res.send({ responseCode: responseCodes.SUCCESS, responseMessage: responseMessage.LOG_IN, token: token ,responseResult:user})
            }
            else {
                return res.send({ responseCode: responseCodes.PASSWORD_CONFIRMPASSWORD, responseMessage: responseMessage.PASSWORD_INVALID, responseResult: [] })
            }
        }
        else {
            return res.send({ responseCode: responseCodes.PASSWORD_CONFIRMPASSWORD, responseMessage: responseMessage.UNABLE_LOGIN, responseResult: user })
    }

}
catch (error) {
    return res.send({ responseCode: responseCodes.SOMETHING_WRONG, responseMessage: responseMessage.SOMETHING_WRONG, responseResult: error.message })
}

}




const forgotPassword =async (req, res, next) => {
    const validationSchema = {
        email:Joi.string().required()
    }
    try {
        const validatedBody = await Joi.validate(req.body, validationSchema);
        const { email } = validatedBody
        const user = await ProfileModel.findOne({ email: email })
        if (!user) {
            return res.send({ responseCode: responseCodes.USER_NOT_FOUND, responseMessage: responseMessage.USER_NOT_FOUND })
        }
        else {
            const secret = user._id + process.env.JWT_SECRET_KEY;
            const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '5m' })
            var link = `localhost:3000/reset?id=${user._id}&token=${token}`
            const subject="Lazy NFT - Password Reset Link"
            await common.sendMailing(email,subject,link);
        }
        res.send({ responseCode: responseCodes.SUCCESS, responseMessage: responseMessage.FORGOT_PASSWORD, responseResult: link })
    }
    catch (error) {
        return res.send({ responseCode: responseCodes.SOMETHING_WRONG, responseMessage: responseMessage.SOMETHING_WRONG, responseResult: error })
    }
}


const resetPassword=async (req, res, next) => {
    const validationSchema = {
        newPassword:Joi.string().required(),
        confirmPassword:Joi.string().required(),
    }
    try {
        const validatedBody = await Joi.validate(req.body, validationSchema);
        const { newPassword, confirmPassword } = validatedBody;
        const{id,token}=req.query;
        const user = await ProfileModel.findById(id);
        const new_secret = user._id + process.env.JWT_SECRET_KEY;
        if (!user) {
            return res.send({ responseCode: responseCodes.USER_NOT_FOUND, responseMessage: responseMessage.USER_NOT_FOUND })
        }
        else {
            
               jwt.verify(token,new_secret);
                if (newPassword === confirmPassword) {
                        const salt = await bcryptjs.genSalt(10)
                        const hashnewPassword = await bcryptjs.hashSync(newPassword,salt)
                        const userUpdate = await ProfileModel.findByIdAndUpdate({ _id: user._id }, { $set: { password: hashnewPassword } }, { new: true })
                        return res.send({ responseCode: responseCodes.SUCCESS, responseMessage: responseMessage.RESET_PASSWORD, responseResult: [] })
                    }
                    else {
                        return res.send({ responseCode: responseCodes.PASSWORD_CONFIRMPASSWORD, responseMessage: responseMessage.PASSWORD_NOT_MATCH })
                    }
        }
    }
    catch (error) {
        return res.send({ responseCode: responseCodes.SOMETHING_WRONG, responseMessage: responseMessage.SOMETHING_WRONG, responseResult: error.message })
    }
}



const viewProfile=async (req,res)=>{
    try{
        const data= await ProfileModel.findOne({_id: req.userId}).select("-password -__v")
        if(!data){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            res.status(200).json({success:true,message:"succesfully data fetched",data:data})
        }
    }catch(error){
        res.status(501).json({success:false,message:err})
    }
}




const editProfile=async(req,res)=>{
    const validationSchema = {
        bio: Joi.string().allow("").optional(),
        twitterName:Joi.string().allow("").optional(),
        facebookName:Joi.string().allow("").optional(),
        personalURL:Joi.string().allow("").optional()
    };
    try{
        const validatedBody = await Joi.validate(req.body, validationSchema)
        const user= await ProfileModel.findOne({_id: req.userId})
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const {bio,twitterName,facebookName,personalURL}=validatedBody;
            if(!bio && !twitterName && !facebookName &&  !personalURL){
                res.status(501).json({success:false,message:"No any updated data field"});
            }else{
                let updateData;
                if(bio && twitterName && facebookName &&  personalURL){
                    updateData= await ProfileModel.findByIdAndUpdate({_id: user._id},validatedBody,{new:true}).select("-password")
                }else{
                    if(bio){
                        updateData= await ProfileModel.findByIdAndUpdate({_id: user._id},{$set:{bio:bio}},{new:true}).select("-password")
                    }
                    if(twitterName){
                        updateData= await ProfileModel.findByIdAndUpdate({_id: user._id},{$set:{twitterName:twitterName}},{new:true}).select("-password")
                    }
                    if(facebookName){
                        updateData= await ProfileModel.findByIdAndUpdate({_id: user._id},{$set:{facebookName:facebookName}},{new:true}).select("-password")
                    }if (personalURL) {
                        updateData= await ProfileModel.findByIdAndUpdate({_id: user._id},{$set:{personalURL:personalURL}},{new:true}).select("-password")
                    }
                }
    
                if(updateData){
                    res.status(200).json({success:true,message:"updated successfully",data:updateData})
                }else{
                    res.status(501).json({success:false,message:"something went wrong"})
                }
            }
   
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }
}

const updateProfilePic=async(req,res)=>{
    const validationSchema = {
        profilePic: Joi.string().allow("").optional(),
    };
    try{
        const validatedBody = await Joi.validate(req.body, validationSchema)
        const user= await ProfileModel.findOne({_id: req.userId})
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const updateData= await ProfileModel.findByIdAndUpdate({_id: user._id},validatedBody,{new:true}).select("profilePic -_id")
            res.status(200).json({success:true,message:"updated profile pic successfully",responseResult:updateData,})
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }
}

module.exports={
    login,
    signup,
    forgotPassword,
    resetPassword,
    viewProfile,
    editProfile,
    updateProfilePic
}