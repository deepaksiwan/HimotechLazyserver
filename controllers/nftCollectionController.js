const { default: mongoose } = require("mongoose");
const nftCollectionModel = require("../models/NftCollectionModel");
const profileModel = require("../models/profileModel");
const userWalletModel = require("../models/userWalletModel")
const ethers = require("ethers");
const { WOLFPUPS_NFT_address, WOLFPUPS_NFT_address_BSC } = require('../utils/config');
const WOLFPUPS_NFT_ABI = require("../utils/WOLFPUPS_NFT_ABI.json")
const provider = new ethers.providers.WebSocketProvider("wss://mainnet.infura.io/ws/v3/2f2312e7890d42f5b0ba6e29ef50674d")
const bscprovider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s3.binance.org:8545")
const getUserNFTByTokenURI = require("../utils/getUserNFTByTokenURI");
 

const getContract = (contractAddress, contractAbi, signerOrProvider) => {
    const contract = new ethers.Contract(contractAddress, contractAbi, signerOrProvider);
    return contract;
}

// function getIP(req) {
//     // req.connection is deprecated
//     const conRemoteAddress = req.connection.remoteAddress
//     // req.socket is said to replace req.connection
//     const sockRemoteAddress = req.socket.remoteAddress
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
//     return xForwardedForIP || xRealIP || sockRemoteAddress || conRemoteAddress ||req.ip || req.connection.socket.remoteAddress
//   }


// get all user
// loop thorugh user result and get all wallet and network of user 
// loop through each wallet and initialize contract based on network of wallet.
// get balance of wallet from contract
// user tokenOwnerIndex to get token Ids
// for each token id get metadata using tokenUri
// save meta data after checking of entry if already exist then update. (token address , id, wallet and network)

const addOrUpdateNftCollection = async () => {
    // console.log("hi");
     
 

    try {
        const users = await profileModel.find().select("_id");
        // console.log(users);

        if (users.length <= 0) {
            console.log("No any user Added Yet");
        

        return null;

        } else {
            
            const userDetail = await Promise.all(users.map(async (user) => {
               
                const userWallets = await userWalletModel.find({ userId: user._id }).populate("userId");
                // console.log(userWallets);
                 await nftCollectionModel.findOneAndUpdate({ userId: user._id }, { $set: {exist:false} }, { new: true });
                const checkNft = await Promise.all(userWallets.map(async (wallets) => {
                    // console.log(wallets);
                const checkSync = await userWalletModel.find({ userId: user._id }).select("syncing");
                
                if(!checkSync[0].syncing){
                    console.log("syncing" , user._id , checkSync[0] )

                await userWalletModel.findOneAndUpdate({  userId: user._id}, { $set: {syncing:true,synced: false} }, { new: true });
                let w = 0 

                    for (let i = 0; i < wallets.wallets.length; i++) {
                        w++ ;

                        // console.log(wallets[i]);
                        let _wallet = wallets.wallets[i];
                        if (_wallet.networkName === "BSC Testnet") {
                            const contract = getContract(WOLFPUPS_NFT_address_BSC, WOLFPUPS_NFT_ABI, bscprovider);
                            // console.log(contract);
                            const balanceOf = await contract.balanceOf(_wallet.address);
                            // console.log(parseInt(balanceOf),"ggg");
                            let ac = 0 ;

                            for (let i = 0; i < parseInt(balanceOf); i++) {
                                ac++

                                const tokenId = await contract.tokenOfOwnerByIndex(_wallet.address, i);
                                // console.log(tokenId.toString(),"tokenId");
                              
                                // console.log(metadata.data);
                                // entry in db
                                const nft = await nftCollectionModel.find({ $and: [{ userId: wallets.userId._id }, { tokenAddress: WOLFPUPS_NFT_address_BSC}, { tokenId: tokenId }] }).populate("userId")
                                if (nft.length > 0) {
                                    // console.log("This nft already added");
                                console.log("Excluded:", i);
                                  await nftCollectionModel.findOneAndUpdate({ $and: [{ userId: wallets.userId._id }, { tokenAddress: WOLFPUPS_NFT_address_BSC}, { tokenId: tokenId }]}, { $set: {exist:true} }, { new: true });

                                } else {
                                    const tokenUri = await contract.tokenURI(tokenId);
                                    // console.log(tokenUri,"tokenUri");
                                    const metadata = await getUserNFTByTokenURI(tokenUri);
                                    const obj={
                                        userId: wallets.userId._id, 
                                        tokenAddress:WOLFPUPS_NFT_address_BSC,
                                        tokenId:tokenId,
                                        tokenOwner:_wallet.address,
                                        chainName:_wallet.networkName,
                                        exist : true,
                                        metadata: metadata.data
                                    }
                                    await new nftCollectionModel(obj).save();
                                    console.log(i);

                                }

                                if(w ==  wallets.wallets.length && ac == parseInt(balanceOf)){
                                    await userWalletModel.findOneAndUpdate({  userId: user._id}, { $set: {syncing:false,synced: true} }, { new: true });
                                    console.log("synced", user._id)

                                }
                            }

                        }
                        if (_wallet.networkName === "Ethereum") {
                            const contract = getContract(WOLFPUPS_NFT_address, WOLFPUPS_NFT_ABI, provider);

                            const balanceOf = await contract.balanceOf(_wallet.address);
                            let ac= 0;
                            for (let i = 0; i < parseInt(balanceOf); i++) {
                                ac++
                                const tokenId = await contract.tokenOfOwnerByIndex(_wallet.address, i);
                           
                                // entry in db
                                      
                                // console.log(metadata)
                                const nft = await nftCollectionModel.find({ $and: [{ userId: wallets.userId._id }, { tokenAddress: WOLFPUPS_NFT_address}, { tokenId: tokenId }] }).populate("userId")
                                if (nft.length > 0) {
                                    // console.log("This nft already added");
                                    console.log("Excluded:", i);

                                    await nftCollectionModel.findOneAndUpdate({ $and: [{ userId: wallets.userId._id }, { tokenAddress: WOLFPUPS_NFT_address}, { tokenId: tokenId }]}, { $set: {exist:true} }, { new: true });


                                } else {
                                    const tokenUri = await contract.tokenURI(tokenId);
                                    const metadata = await getUserNFTByTokenURI(tokenUri);
                                    const obj={
                                        userId: wallets.userId._id, 
                                        tokenAddress:WOLFPUPS_NFT_address,
                                        tokenId:tokenId,
                                        tokenOwner:_wallet.address,
                                        chainName:_wallet.networkName,
                                        exist : true,
                                        metadata:metadata.data
                                    }
                                console.log(i);
                                  
                                    await new nftCollectionModel(obj).save();

                                }
                                if(w ==  wallets.wallets.length && ac == parseInt(balanceOf)){
                                    await userWalletModel.findOneAndUpdate({  userId: user._id}, { $set: {syncing:false,synced: true} }, { new: true });
                                    console.log("synced", user._id)

                                }
                            }
                        }

                       
                    }

                }

                }))

               
            }))

        return null;
    }

    } catch (err) {
        console.log(err);
    }
}

//  addOrUpdateNftCollection()

//  const addOrUpdateNftCollection=async (req,res)=>{
//     try{
//         const user= await profileModel.findOne({_id: req.userId})
//         const {tokenAddress,tokenId}=req.body
//         if(!user){
//             res.status(404).json({success:false,message:"Profile not found"})
//         }else{
//             const nft= await nftCollectionModel.find({$and:[{userId:req.userId},{tokenAddress:tokenAddress},{tokenId:tokenId}]}).populate("userId")
//             if(nft.length>0){

//                     res.status(200).json({success:false,message:"This nft already added"});
//             }else{
//                 await new nftCollectionModel({userId:req.userId,...req.body}).save();
//                 res.status(200).json({success:true,message:"Nft Added successfully"})
//             }
//         }

//     }catch(err){
//             res.status(501).json({success:false,message:err})
//     }

//  }

const getAllNftCollection = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const nfts = await nftCollectionModel.find({ status: "SHOW" , exist : true }).sort({ createdAt: -1 }).skip((page - 1) * limit).populate("userId", "-password").limit(limit);

        if (nfts.length > 0) {
            res.status(200).json({ success: true, message: "Nfts fetched successfully", responseResult: nfts })
        } else {
            res.status(404).json({ success: true, message: "nft not found" })
        }

    } catch (err) {
        res.status(501).json({ success: false, message: err })
    }
}

const getAllNftByChainName = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const nfts = await nftCollectionModel.find({ chainName: req.query.chainName, status: "SHOW" , exist : true }).sort({ createdAt: -1 }).skip((page - 1) * limit).populate("userId", "-password").limit(limit);

        if (nfts.length > 0) {
            res.status(200).json({ success: true, message: "Nfts fetched successfully", responseResult: nfts })
        } else {
            res.status(404).json({ success: true, message: "nft not found" })
        }

    } catch (err) {
        res.status(501).json({ success: false, message: err })
    }
}



const getMyNftCollection = async (req, res) => {
    try {
        const user = await profileModel.findOne({ _id: req.userId })
        if (!user) {
            res.status(404).json({ success: false, message: "Profile not found" })
        } else {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 6;
            const nfts = await nftCollectionModel.find({ userId: req.userId, status: "SHOW"  , exist : true}).sort({ createdAt: -1 }).skip((page - 1) * limit).populate("userId", "-password").limit(limit);
            if (nfts.length > 0) {
                res.status(200).json({ success: true, message: "Your Nfts fetched successfully", responseResult: nfts })
            } else {
                res.status(404).json({ success: true, message: "nft not found" })
            }
        }

    } catch (err) {
        res.status(501).json({ success: false, message: err })
    }
}

const getNftCollectionByChainNameAndUserName = async (req, res) => {
    try {
        const user = await profileModel.findOne({ userName: req.query.userName })
        if (!user) {
            res.status(404).json({ success: false, message: "Profile not found" })
        } else {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 6;
            const nfts = await nftCollectionModel.find({ userId: user._id, chainName: req.query.chainName, status: "SHOW" , exist : true }).sort({ createdAt: -1 }).skip((page - 1) * limit).populate("userId", "-password").limit(limit);
            if (nfts.length > 0) {
                res.status(200).json({ success: true, message: "Your Nfts fetched successfully", responseResult: nfts })
            } else {
                res.status(404).json({ success: true, message: "nft not found" })
            }
        }

    } catch (err) {
        res.status(501).json({ success: false, message: err })
    }
}

const getNftByNftCollectionId = async (req, res) => {
    try {
        const nfts = await nftCollectionModel.findOne({ _id: req.query.id });
        if (nfts) {
            const data = await nftCollectionModel.findByIdAndUpdate({ _id: req.query.id }, { $inc: { viewsCount: 1 } }, { new: true })
            res.status(200).json({ success: true, message: "Your Nfts fetched successfully", responseResult: data })

        } else {
            res.status(404).json({ success: true, message: "nft not found" })
        }


    } catch (err) {
        res.status(501).json({ success: false, message: err })
    }
}


const getAllNftByUserName = async (req, res) => {
    try {
        const user = await profileModel.findOne({ userName: req.query.userName })
        if (!user) {
            res.status(404).json({ success: false, message: "Profile not found" })
        } else {
            // const page=parseInt(req.query.page)||1;
            // const limit=parseInt(req.query.limit)||10;
            const nfts = await nftCollectionModel.find({ userId: user._id, status: "SHOW"  , exist : true}).sort({ createdAt: -1 }).populate("userId", "-password");
            if (nfts.length > 0) {
                res.status(200).json({ success: true, message: "Your Nfts fetched successfully", responseResult: nfts })
            } else {
                res.status(404).json({ success: true, message: "nft not found" })
            }
        }

    } catch (err) {
        res.status(501).json({ success: false, message: err })
    }
}



const updateNftNameOrDescription = async (req, res) => {
    try {
        const user = await profileModel.findOne({ _id: req.userId })
        const { lazyName, lazyDescription } = req.body;
        if (!user) {
            res.status(404).json({ success: false, message: "Profile not found" })
        } else {
            let updateData
            if (lazyName && lazyDescription) {
                updateData = await nftCollectionModel.findOneAndUpdate({ _id: req.query.id }, { $set: req.body }, { new: true });

            } else if (lazyName || !lazyDescription) {
                updateData = await nftCollectionModel.findOneAndUpdate({ _id: req.query.id }, { $set: { lazyName: lazyName } }, { new: true });
            } else {
                updateData = await nftCollectionModel.findOneAndUpdate({ _id: req.query.id }, { $set: { lazyDescription: lazyDescription } }, { new: true });
            }
            if (updateData) {

                res.status(200).json({ success: true, message: "Nft Updated successfully", responseResult: updateData })
            } else {
                res.status(404).json({ success: false, message: "nft not found" })
            }


        }

    } catch (err) {
        res.status(501).json({ success: false, message: err })
    }
}



const toggleLikeNft = async (req, res) => {
    try {
        const user = await profileModel.findOne({ _id: req.userId })
        if (!user) {
            res.status(404).json({ success: false, message: "Profile not found" })
        } else {
            const nft = await nftCollectionModel.findOne({ _id: req.query.id }).populate("userId")
            // console.log(nft);
            if (nft) {
                console.log(nft.userId._id);
                const unlike = await nftCollectionModel.findOne({ $and: [{ _id: req.query.id }, { likes: req.userId }] }).populate("userId");
                console.log(unlike);
                if (unlike) {
                    const unlikeData = await nftCollectionModel.findByIdAndUpdate({ _id: req.query.id }, { $pull: { likes: req.userId } }, { new: true })

                    res.status(200).json({ success: true, message: "nft unlike successfully", responseResult: unlikeData })

                } else {
                    const likeData = await nftCollectionModel.findByIdAndUpdate({ _id: req.query.id }, { $push: { likes: req.userId } }, { new: true })
                    res.status(200).json({ success: true, message: "nft like successfully", responseResult: likeData })

                }
            } else {
                res.status(501).json({ success: true, message: "Nft no found" })
            }

        }

    } catch (err) {
        res.status(501).json({ success: false, message: err })
    }
}


const mostLikeNft = async (req, res) => {
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
    const limit = parseInt(req.query.limit) || 10
    try {
        nftCollectionModel.aggregate([
            { $match: { status: "SHOW" } },
            {
                "$sort": { "likes": -1 }
            },
            {
                "$limit": limit
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

const mostViewNft = async (req, res) => {
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
    const limit = parseInt(req.query.limit) || 10
    try {
        nftCollectionModel.aggregate([
            { $match: { status: "SHOW" } },
            {
                "$sort": { "viewsCount": -1 }
            },
            {
                "$limit": limit
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

const recentlyListedNft = async (req, res) => {
    const limit = parseInt(req.query.limit) || 9
    try {
        nftCollectionModel.aggregate([
            { $match: { status: "SHOW" } },
            {
                "$sort": { "createdAt": -1 }
            },
            {
                "$limit": limit
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

const hideToggleNft = async (req, res) => {
    try {
        const user = await profileModel.findOne({ _id: req.userId })
        if (!user) {
            res.status(404).json({ success: false, message: "Profile not found" })
        } else {
            const nft = await nftCollectionModel.findOne({ _id: req.query.id }).populate("userId")
            if (nft) {
                const unhide = await nftCollectionModel.findOne({ _id: nft._id, $ne: "SHOW" }).populate("userId");
                if (unhide.status !== "SHOW") {
                    const unhideData = await nftCollectionModel.updateOne({ _id: req.query.id }, { $set: { status: "SHOW" } }, { new: true })
                    console.log(unhideData);
                    res.status(200).json({ success: true, message: "nft unhide successfully" })

                } else {
                    const hideData = await nftCollectionModel.updateOne({ _id: req.query.id }, { $set: { status: "HIDE" } }, { new: true })
                    console.log(hideData);
                    res.status(200).json({ success: true, message: "nft hide successfully" })

                }
            } else {
                res.status(501).json({ success: true, message: "Nft no found" })
            }

        }

    } catch (err) {
        res.status(501).json({ success: false, message: err })
    }
}

const getAllHideNft = async (req, res) => {
    try {
        const user = await profileModel.findOne({ _id: req.userId })
        if (!user) {
            res.status(404).json({ success: false, message: "Profile not found" })
        } else {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const nfts = await nftCollectionModel.find({ userId: req.userId, status: "HIDE" }).sort({ createdAt: -1 }).skip((page - 1) * limit).populate("userId", "-password -_id").limit(limit);
            console.log(nfts);
            if (nfts.length > 0) {
                res.status(200).json({ success: true, message: "Your Nfts fetched successfully", responseResult: nfts })
            } else {
                res.status(404).json({ success: true, message: "nft not found" })
            }
        }

    } catch (err) {
        res.status(501).json({ success: false, message: err })
    }
}

const pinnedToggleNft = async (req, res) => {
    try {
        const user = await profileModel.findOne({ _id: req.userId })
        if (!user) {
            res.status(404).json({ success: false, message: "Profile not found" })
        } else {
            const nft = await nftCollectionModel.findOne({ _id: req.query.id, $ne: "PINNED" }).populate("userId")
            if (nft) {
                const unpinned = await nftCollectionModel.findOne({ _id: nft._id }).populate("userId");
                if (unpinned.pinnedStatus !== "PINNED") {
                    const pinnedData = await nftCollectionModel.updateOne({ _id: req.query.id }, { $set: { pinnedStatus: "PINNED" } }, { new: true })
                    res.status(200).json({ success: true, message: "nft pinned successfully" })

                } else {
                    const unpinnedData = await nftCollectionModel.updateOne({ _id: req.query.id }, { $set: { pinnedStatus: "UNPINNED" } }, { new: true })
                    res.status(200).json({ success: true, message: "nft unpinned successfully" })

                }
            } else {
                res.status(501).json({ success: true, message: "Nft no found" })
            }

        }

    } catch (err) {
        res.status(501).json({ success: false, message: err })
    }
}

const getAllPinnedNftByUserName = async (req, res) => {
    try {
        const user = await profileModel.findOne({ userName: req.query.userName })
        if (!user) {
            res.status(404).json({ success: false, message: "Profile not found" })
        } else {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const nfts = await nftCollectionModel.find({ userId: user._id, status: "SHOW", pinnedStatus: "PINNED" }).sort({ createdAt: -1 }).skip((page - 1) * limit).populate("userId", "-password").limit(limit);
            if (nfts.length > 0) {
                res.status(200).json({ success: true, message: "Your Nfts fetched successfully", responseResult: nfts })
            } else {
                res.status(404).json({ success: true, message: "nft not found" })
            }
        }

    } catch (err) {
        res.status(501).json({ success: false, message: err })
    }
}

module.exports = {
    addOrUpdateNftCollection,
    getAllNftCollection,
    getAllNftByChainName,
    getMyNftCollection,
    updateNftNameOrDescription,
    getNftByNftCollectionId,
    getNftCollectionByChainNameAndUserName,
    toggleLikeNft,
    mostLikeNft,
    mostViewNft,
    recentlyListedNft,
    hideToggleNft,
    getAllHideNft,
    pinnedToggleNft,
    getAllPinnedNftByUserName,
    getAllNftByUserName
}