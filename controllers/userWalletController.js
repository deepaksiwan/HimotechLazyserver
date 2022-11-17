 const { default: mongoose } = require("mongoose");
const profileModel = require("../models/profileModel");
const userWalletModel =require("../models/userWalletModel");

 const addWallet=async (req,res)=>{
    try{
        const user= await profileModel.findOne({_id: req.userId})
        const {networkName,address}=req.body
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const wallet= await userWalletModel.findOne({userId:user._id}).populate("userId")
            if(wallet){
                const check= await userWalletModel.findOne({$and:[{userId:user._id},{"wallets.networkName":networkName},{"wallets.address":address}]})
                if(check){
                    res.status(200).json({success:false,message:"This wallet already added"});
                }else{
                const updateWallet=  await userWalletModel.findByIdAndUpdate({_id:wallet._id},{$push:{wallets:{networkName:networkName,address:address}}},{new:true});
                res.status(200).json({success:true,message:"Wallet Added successfully",updateWallet:updateWallet})
                }
            }else{
            const walletCreate= await new userWalletModel({userId:user._id,wallets:{networkName:networkName,address:address}}).save();
            res.status(200).json({success:true,message:"Wallet created successfully",walletCreate:walletCreate})
            }
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }

 }

 const getAllWallet=async(req,res)=>{
    try{
        const user= await profileModel.findOne({_id: req.userId})
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
             const wallets=await  userWalletModel.find({userId:user._id}).select("wallets -_id");
            res.status(200).json({success:true,message:"wallets fetch successfully",responseResult:wallets})
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }
 }


 const removeWallet=async (req,res)=>{
    try{
        const user= await profileModel.findOne({_id: req.userId})
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const wallet=await  userWalletModel.findOne({"wallets._id":req.query.id});
            if(wallet){
               await  userWalletModel.updateOne({"wallets._id":req.query.id},{$pull:{"wallets":{"_id":req.query.id}}},{safe: true});
                res.status(200).json({success:true,message:"wallet remove successfully"})
            }else{
                res.status(404).json({success:true,message:"wallet not found",})
            }
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }
 }



 module.exports={addWallet,removeWallet,getAllWallet}