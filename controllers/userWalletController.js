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
            const wallet= await userWalletModel.findOne({$and:[{networkName:networkName},{address:address}]});
            if(wallet){
                    res.status(200).json({success:false,message:"This wallet is already linked with an account."});
            }else{
                const obj={
                    userId:user._id,
                    networkName:networkName,
                    address:address,
                    synced:false,
                    syncing:false
                }
            await new userWalletModel(obj).save();
            res.status(200).json({success:true,message:"Wallet added successfully"})
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
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 6;
             const wallets=await  userWalletModel.find({userId:user._id}).skip((page - 1) * limit).populate("userId").limit(limit);;
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
            const wallet=await  userWalletModel.findOne({_id:req.query.id});
            if(wallet){
               await  userWalletModel.findByIdAndDelete({_id:req.query.id},{ new: true });
                res.status(200).json({success:true,message:"wallet remove successfully"})
            }else{
                res.status(404).json({success:false,message:"wallet not found",})
            }
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }
 }



 module.exports={addWallet,removeWallet,getAllWallet}