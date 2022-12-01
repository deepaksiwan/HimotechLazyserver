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
            const wallet= await userWalletModel.findOne({userId:user._id}).select("wallets").populate("userId").limit(1);
            if(wallet){
                const check= await userWalletModel.findOne({$and:[{"wallets.networkName":networkName},{"wallets.address":address}]}).populate("userId")
                if(check){
                    res.status(200).json({success:false,message:"This wallet already added by other user"});
                }else{
                await userWalletModel.updateOne({_id:wallet._id},{$push:{wallets:req.body}});
                res.status(200).json({success:true,message:"Wallet Added successfully"})
                }
            }else{
            await new userWalletModel({userId:user._id,wallets:req.body}).save();
            res.status(200).json({success:true,message:"Wallet created successfully"})
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