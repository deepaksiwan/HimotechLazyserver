const { default: mongoose } = require("mongoose");
const nftCollectionModel = require("../models/NftCollectionModel");
const profileModel = require("../models/profileModel");
const pinnedNftModel=require("../models/PinnedNftModel")


 const pinnedNft=async (req,res)=>{
    try{
        const {tokenAddress,tokenId}=req.body
        const user= await profileModel.findOne({_id: req.userId})
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const nft= await nftCollectionModel.findOne({$and:[{userId:user._id},{"nfts.tokenAddress":tokenAddress},{"nfts.tokenId":tokenId},{"nfts.status":"SHOW"},{$ne:"HIDE"}]}).populate("userId","nfts")
            if(nft){
                const check1= await pinnedNftModel.findOne({nftCollectionId:nft._id})
                if(check1){
                    const check2= await pinnedNftModel.findOne({$and:[{nftCollectionId:nft._id},{"pinnedNfts.tokenAddress":tokenAddress},{"pinnedNfts.tokenId":tokenId}]}).populate("nftCollectionId")
                    if(check2){
                        res.status(200).json({success:false,message:"This Nft already pinned"})
                    }else{
                       await pinnedNftModel.findOneAndUpdate({_id:check1._id},{$push:{pinnedNfts:req.body}});
                    res.status(200).json({success:true,message:"Nft pinned successfully"})
                    }
                }else{
                await new pinnedNftModel({nftCollectionId:nft._id,pinnedNfts:req.body}).save();
                res.status(200).json({success:true,message:"Nft pinned successfully"})
                }

            }else{
            res.status(404).json({success:false,message:"Nft not available",responseResult:[]})
            }
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }

 }

 const unpinnedNft=async (req,res)=>{
    try{
        const user= await profileModel.findOne({_id: req.userId})
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const nft=await  nftCollectionModel.findOne({userId:user._id}).populate("userId","nfts");
            if(nft){
               await  pinnedNftModel.updateOne({nftCollectionId:nft._id},{$pull:{"pinnedNfts":{$and:[{"tokenAddress":req.query.tokenAddress},{"tokenId":req.query.tokenId}]}}},{safe: true});
                res.status(200).json({success:true,message:"Nft unpinned successfully"})
            }else{
                res.status(404).json({success:true,message:"pinnedNft not found",})
            }
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }
 }

 const getAllPinnedNfts=async (req,res)=>{
    try{
        const user= await profileModel.findOne({_id: req.userId})
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const nfts=await nftCollectionModel.findOne({userId:user._id})
            if(nfts){
                const pinnedNft= await pinnedNftModel.findOne({nftCollectionId:nfts._id},{pinnedNfts:{$slice:-8}}).populate("nftCollectionId","pinnedNfts");
                res.status(200).json({success:true,message:"Your pinnedNfts fetched successfully",responseResult:pinnedNft})
            }else{
                res.status(404).json({success:true,message:"pinnedNft not found"})
            }
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }
 }



 module.exports={pinnedNft,unpinnedNft,getAllPinnedNfts}