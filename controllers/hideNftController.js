const { default: mongoose } = require("mongoose");
const nftCollectionModel = require("../models/NftCollectionModel");
const profileModel = require("../models/profileModel");
const hideNftModel=require("../models/hideNftModel")


 const hideNft=async (req,res)=>{
    try{
        const {tokenAddress,tokenId}=req.body
        const user= await profileModel.findOne({_id: req.userId})
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const nft= await nftCollectionModel.findOne({$and:[{userId:user._id},{"nfts.tokenAddress":tokenAddress},{"nfts.tokenId":tokenId},{"nfts.status":"SHOW"},{$ne:"HIDE"}]}).populate("userId","nfts")
            if(nft){
                const check1= await hideNftModel.findOne({nftCollectionId:nft._id}).populate("nftCollectionId")
                if(check1){
                    const check2= await hideNftModel.findOne({$and:[{nftCollectionId:nft._id},{"hideNfts.tokenAddress":tokenAddress},{"hideNfts.tokenId":tokenId}]}).populate("nftCollectionId")
                    if(check2){
                        res.status(200).json({success:false,message:"This Nft already Hide"})
                    }else{
                        const hideNft=  await hideNftModel.findByIdAndUpdate({_id:check1._id},{$push:{hideNfts:req.body}},{new:true});
                        const status=await nftCollectionModel.updateOne({$and:[{userId:user._id},{"nfts.tokenAddress":tokenAddress},{"nfts.tokenId":tokenId},{"nfts.status":"SHOW"},{$ne:"HIDE"}]},{$set:{"nfts.$.status":"HIDE"}},{new:true})
                    res.status(200).json({success:true,message:"Nft hide successfully",responseResult:hideNft,status:status})
                    }
                }else{
                const hideNft= await new hideNftModel({nftCollectionId:nft._id,hideNfts:req.body}).save();
                const status=await nftCollectionModel.updateOne({$and:[{userId:user._id},{"nfts.tokenAddress":tokenAddress},{"nfts.tokenId":tokenId},{"nfts.status":"SHOW"},{$ne:"HIDE"}]},{$set:{"nfts.$.status":"HIDE"}},{new:true})
                res.status(200).json({success:true,message:"Nft hide successfully",responseResult:hideNft,status:status})
                }

            }else{
            res.status(404).json({success:false,message:"Nft not available",responseResult:[]})
            }
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }

 }

 const unhideNft=async (req,res)=>{
    try{
        const user= await profileModel.findOne({_id: req.userId})
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const nft=await  nftCollectionModel.findOne({userId:user._id}).populate("userId","nfts");
            if(nft){
               await  hideNftModel.updateOne({nftCollectionId:nft._id},{$pull:{"hideNfts":{$and:[{"tokenAddress":req.query.tokenAddress},{"tokenId":req.query.tokenId}]}}},{safe: true});
               await nftCollectionModel.updateOne({$and:[{userId:user._id},{"nfts.tokenAddress":req.query.tokenAddress},{"nfts.tokenId":req.query.tokenId},{"nfts.status":"HIDE"},{$ne:"SHOW"}]},{$set:{"nfts.$.status":"SHOW"}},{new:true})
                res.status(200).json({success:true,message:"Nft unhide successfully"})
            }else{
                res.status(404).json({success:true,message:"nft not found",})
            }
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }
 }

 const getAllHideNfts=async (req,res)=>{
    try{
        const user= await profileModel.findOne({_id: req.userId})
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const nfts=await nftCollectionModel.find({userId:user._id}).select("nfts -_id");
            if(nfts.length>0){
                const hideNft= await hideNftModel.findOne(nfts._id).select("hideNfts -_id")
                res.status(200).json({success:true,message:"Your Nfts fetched successfully",responseResult:hideNft})
            }else{
                res.status(404).json({success:true,message:"nft not found"})
            }
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }
 }



 module.exports={hideNft,unhideNft,getAllHideNfts}