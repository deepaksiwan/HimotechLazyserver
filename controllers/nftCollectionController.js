const { default: mongoose } = require("mongoose");
const nftCollectionModel = require("../models/NftCollectionModel");
const profileModel = require("../models/profileModel");

// function getIP(req) {
//     // req.connection is deprecated
//     const conRemoteAddress = req.connection?.remoteAddress
//     // req.socket is said to replace req.connection
//     const sockRemoteAddress = req.socket?.remoteAddress
//     // some platforms use x-real-ip
//     const xRealIP = req.headers['x-real-ip']
//     // most proxies use x-forwarded-for
//     const xForwardedForIP = (() => {
//       const xForwardedFor = req.headers['x-forwarded-for']
//       if (xForwardedFor) {
//         // The x-forwarded-for header can contain a comma-separated list of
//         // IP's. Further, some are comma separated with spaces, so whitespace is trimmed.
//         const ips = xForwardedFor.split(',').map(ip => ip.trim())
//         return ips[0]
//       }
//     })()
//     // prefer x-forwarded-for and fallback to the others
//     return xForwardedForIP || xRealIP || sockRemoteAddress || conRemoteAddress ||req?.ip || req.connection.socket.remoteAddress
//   }

  

 const addOrUpdateNftCollection=async (req,res)=>{
    try{
        const user= await profileModel.findOne({_id: req.userId})
        const {tokenAddress,tokenId}=req.body
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const nft= await nftCollectionModel.find({$and:[{userId:req.userId},{tokenAddress:tokenAddress},{tokenId:tokenId}]}).populate("userId")
            if(nft.length>0){
 
                    res.status(200).json({success:false,message:"This nft already added"});
            }else{
                await new nftCollectionModel({userId:req.userId,...req.body}).save();
                res.status(200).json({success:true,message:"Nft Added successfully"})
            }
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }

 }

 const getAllNftCollection=async(req,res)=>{
    try{
        const page=parseInt(req.query.page)||1;
        const limit=parseInt(req.query.limit)||10;

        const nfts=await  nftCollectionModel.find({status:"SHOW"}).sort({createdAt:-1}).skip((page-1)*limit).populate("userId","-password").limit(limit);

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
            const page=parseInt(req.query.page)||1;
            const limit=parseInt(req.query.limit)||6;
            const nfts=await  nftCollectionModel.find({userId:req.userId,status:"SHOW"}).sort({createdAt:-1}).skip((page-1)*limit).populate("userId","-password").limit(limit);
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

 const getNftByNftCollectionId=async(req,res)=>{
    try{
            const nfts=await nftCollectionModel.findOne({_id:req.query.id});
            if(nfts){
                const data=await nftCollectionModel.findByIdAndUpdate({_id:req.query.id},{$inc:{viewsCount:1}},{new:true})
                res.status(200).json({success:true,message:"Your Nfts fetched successfully",responseResult:data})

            }else{
                res.status(404).json({success:true,message:"nft not found"})
            }
        
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }
 }



 const updateNftNameOrDescription=async(req,res)=>{
    try{
        const user= await profileModel.findOne({_id: req.userId})
        const {lazyName,lazyDescription}=req.body;
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
                const updateData=await nftCollectionModel.findByIdAndUpdate({_id:req.query.id},{$set:{lazyName:lazyName,lazyDescription:lazyDescription}},{new:true});
                if(updateData){

                    res.status(200).json({success:true,message:"Nft Updated successfully",responseResult:updateData})
                }else{
                    res.status(404).json({success:false,message:"nft not found"})
                }
            
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }
 }



 const toggleLikeNft=async(req,res)=>{
    try{
        const user= await profileModel.findOne({_id: req.userId})
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const nft=await nftCollectionModel.findOne({_id:req.query.id}).populate("userId")
            // console.log(nft);
            if(nft){
                console.log(nft.userId._id);
                    const unlike=await nftCollectionModel.findOne({$and:[{_id:req.query.id},{likes:req.userId}]}).populate("userId");
                    console.log(unlike);
                    if(unlike){
                        const unlikeData=await nftCollectionModel.findByIdAndUpdate({_id:req.query.id},{$pull:{likes:req.userId}},{new:true})

                        res.status(200).json({success:true,message:"nft unlike successfully",responseResult:unlikeData})
  
                    }else{
                        const likeData=await nftCollectionModel.findByIdAndUpdate({_id:req.query.id},{$push:{likes:req.userId}},{new:true})
                        res.status(200).json({success:true,message:"nft like successfully",responseResult:likeData})

                }
            }else{
                res.status(501).json({success:true,message:"Nft no found"})
            }
            
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }
 }


const mostLikeNft=async(req,res)=>{
    // try {
    //     nftCollectionModel.find()
    //       .sort({ likes: -1 })
    //       .limit(10)
    //       .then((nfts) => {
    //         console.log(nfts);
    //         res.status(200).json({
    //           message: "Fetch seccessful",
    //           nfts: nfts,
    //         });
    //       })
    //       .catch(() => {
    //         res.status(500).json({
    //           error: error,
    //         });
    //       });
    //   } catch (error) {
    //     res.status(500).json({
    //       error: error,
    //     });
    //   }


    // 2nd Method using aggregate
    const limit=parseInt(req.query.limit) || 10
    try {
        nftCollectionModel.aggregate([{
            "$sort":{"likes":-1}
        },
        {
            "$limit":limit
        }
    ]).then((nfts) => {
            // console.log(nfts);
            res.status(200).json({
              message: "Fetch seccessful",
              nfts: nfts,
            });
          })
          .catch((error) => {
            res.status(500).json({
              error: error,
            });
          });
      } catch (error) {
        res.status(500).json({
          error: error,
        });
      }
}

const mostViewNft=async(req,res)=>{
    // try {
    //     nftCollectionModel.find()
    //       .sort({ views: -1 })
    //       .limit(10)
    //       .then((nfts) => {
    //         console.log(nfts);
    //         res.status(200).json({
    //           message: "Fetch seccessful",
    //           nfts: nfts,
    //         });
    //       })
    //       .catch(() => {
    //         res.status(500).json({
    //           error: error,
    //         });
    //       });
    //   } catch (error) {
    //     res.status(500).json({
    //       error: error,
    //     });
    //   }

    // 2nd Method using aggregate
    const limit=parseInt(req.query.limit) || 10
    try {
        nftCollectionModel.aggregate([{
            "$sort":{"viewsCount":-1}
        },
        {
            "$limit":limit
        }
    ]).then((nfts) => {
            // console.log(nfts);
            res.status(200).json({
              message: "Fetch seccessful",
              nfts: nfts,
            });
          })
          .catch((error) => {
            res.status(500).json({
              error: error,
            });
          });
      } catch (error) {
        res.status(500).json({
          error: error,
        });
      }
}

const recentlyListedNft=async(req,res)=>{
    const limit=parseInt(req.query.limit) || 6
    try {
        nftCollectionModel.aggregate([{
            "$sort":{"createdAt":-1}
        },
        {
            "$limit":limit
        }
    ]).then((nfts) => {
            // console.log(nfts);
            res.status(200).json({
              message: "Fetch seccessful",
              nfts: nfts,
            });
          })
          .catch((error) => {
            res.status(500).json({
              error: error,
            });
          });
      } catch (error) {
        res.status(500).json({
          error: error,
        });
      }
}

const hideToggleNft=async(req,res)=>{
    try{
        const user= await profileModel.findOne({_id: req.userId})
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const nft=await nftCollectionModel.findOne({_id:req.query.id}).populate("userId")
            if(nft){
                    const unhide=await nftCollectionModel.findOne({_id:nft._id,$ne:"SHOW"}).populate("userId");
                    if(unhide.status!=="SHOW"){
                        const unhideData=await nftCollectionModel.updateOne({_id:req.query.id},{$set:{status:"SHOW"}},{new:true})
                        console.log(unhideData);
                        res.status(200).json({success:true,message:"nft unhide successfully"})
  
                    }else{
                        const hideData=await nftCollectionModel.updateOne({_id:req.query.id},{$set:{status:"HIDE"}},{new:true})
                        console.log(hideData);
                        res.status(200).json({success:true,message:"nft hide successfully"})

                }
            }else{
                res.status(501).json({success:true,message:"Nft no found"})
            }
            
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }
}

const getAllHideNft=async(req,res)=>{
    try{
        const user= await profileModel.findOne({_id: req.userId})
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const page=parseInt(req.query.page)||1;
            const limit=parseInt(req.query.limit)||6;
            const nfts=await  nftCollectionModel.find({userId:req.userId,status:"HIDE"}).sort({createdAt:-1}).skip((page-1)*limit).populate("userId","-password -_id").limit(limit);
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

const pinnedToggleNft=async(req,res)=>{
    try{
        const user= await profileModel.findOne({_id: req.userId})
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const nft=await nftCollectionModel.findOne({_id:req.query.id,$ne:"PINNED"}).populate("userId")
            if(nft){
                    const unpinned=await nftCollectionModel.findOne({_id:nft._id}).populate("userId");
                    if(unpinned.pinnedStatus!=="PINNED"){
                        const pinnedData=await nftCollectionModel.updateOne({_id:req.query.id},{$set:{pinnedStatus:"PINNED"}},{new:true})
                        res.status(200).json({success:true,message:"nft pinned successfully"})
  
                    }else{
                        const unpinnedData=await nftCollectionModel.updateOne({_id:req.query.id},{$set:{pinnedStatus:"UNPINNED"}},{new:true})
                        res.status(200).json({success:true,message:"nft unpinned successfully"})

                }
            }else{
                res.status(501).json({success:true,message:"Nft no found"})
            }
            
        }
        
    }catch(err){
            res.status(501).json({success:false,message:err})
    }
}

const getAllPinnedNft=async(req,res)=>{
    try{
        const user= await profileModel.findOne({_id: req.userId})
        if(!user){
            res.status(404).json({success:false,message:"Profile not found"})
        }else{
            const page=parseInt(req.query.page)||1;
            const limit=parseInt(req.query.limit)||6;
            const nfts=await  nftCollectionModel.find({userId:req.userId,pinnedStatus:"PINNED"}).sort({createdAt:-1}).skip((page-1)*limit).populate("userId","-password -_id").limit(limit);
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

 module.exports={
    addOrUpdateNftCollection,
    getAllNftCollection,
    getMyNftCollection,
    updateNftNameOrDescription,
    getNftByNftCollectionId,
    toggleLikeNft,
    mostLikeNft,
    mostViewNft,
    recentlyListedNft,
    hideToggleNft,
    getAllHideNft,
    pinnedToggleNft,
    getAllPinnedNft
}