const { default: mongoose } = require("mongoose");
const nftCollectionModel = require("../models/NftCollectionModel");
const profileModel = require("../models/profileModel");


 const addOrUpdateNftCollection=async (req,res)=>{
    try{
        const user= await profileModel.findOne({_id: req.userId})
        const {tokenAddress,tokenId}=req.body
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const nft= await nftCollectionModel.findOne({userId:user._id}).populate("userId")
            if(nft){
                const check= await nftCollectionModel.findOne({$and:[{userId:user._id},{"nfts.tokenAddress":tokenAddress},{"nfts.tokenId":tokenId}]})
                if(check){
                    res.status(200).json({success:false,message:"This nft already added"});
                }else{
                const updateNft=  await nftCollectionModel.findByIdAndUpdate({_id:nft._id},{$push:{nfts:req.body}},{new:true});
                res.status(200).json({success:true,message:"Nft Updated successfully",responseResult:updateNft})
                }
            }else{
            const addNft= await new nftCollectionModel({userId:user._id,nfts:req.body}).save();
            res.status(200).json({success:true,message:"Nft added successfully",responseResult:addNft})
            }
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }

 }

 const getAllNftCollection=async(req,res)=>{
    try{

        const nfts=await  nftCollectionModel.find({"nfts.status":"SHOW"}).select("nfts -_id");
        if(nfts.length>0){
            res.status(200).json({success:true,message:"Nfts fetched successfully",responseResult:nfts})
        }else{
            res.status(404).json({success:true,message:"nft not found"})
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }
 }


 const getMyNftCollection=async (req,res)=>{
    try{
        const user= await profileModel.findOne({_id: req.userId})
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const nfts=await nftCollectionModel.find({userId:user._id}).select("nfts -_id");
            console.log(nfts);
            if(nfts.length>0){
                res.status(200).json({success:true,message:"Your Nfts fetched successfully",responseResult:nfts})
            }else{
                res.status(404).json({success:true,message:"nft not found"})
            }
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }
 }

 const getMyNftByTokenAddressAndTokenId=async(req,res)=>{
    try{
        const {tokenAddress,tokenId}=req.query;
        const user= await profileModel.findOne({_id: req.userId})
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const nfts=await nftCollectionModel.findOne({$and:[{userId:user._id},{"nfts.tokenAddress":tokenAddress},{"nfts.tokenId":tokenId}]},{ 'nfts.$': 1 });
            if(nfts){
                res.status(200).json({success:true,message:"Your Nfts fetched successfully",responseResult:nfts})
            }else{
                res.status(404).json({success:true,message:"nft not found"})
            }
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }
 }


 const updateNftNameOrDescription=async(req,res)=>{
    try{
        const user= await profileModel.findOne({_id: req.userId})
        const {tokenAddress,tokenId,lazyName,lazyDescription}=req.body
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const nft= await nftCollectionModel.findOne({$and:[{userId:user._id},{"nfts.tokenAddress":tokenAddress},{"nfts.tokenId":tokenId}]}).populate("userId")
            if(nft){
                await nftCollectionModel.updateOne({$and:[{_d:nft._id},{"nfts.tokenAddress":tokenAddress},{"nfts.tokenId":tokenId}]},{$set:{"nfts.$.lazyName":lazyName}},{new:true});
                await nftCollectionModel.updateOne({$and:[{_d:nft._id},{"nfts.tokenAddress":tokenAddress},{"nfts.tokenId":tokenId}]},{$set:{"nfts.$.lazyDiscription":lazyDescription}},{new:true});
                res.status(200).json({success:true,message:"Nft Updated successfully"})
                }else{
                    res.status(404).json({success:false,message:"nft not found"})
                }
            
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }
 }

 module.exports={addOrUpdateNftCollection,getAllNftCollection,getMyNftCollection,getMyNftByTokenAddressAndTokenId,updateNftNameOrDescription}