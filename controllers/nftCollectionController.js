const { default: mongoose } = require("mongoose");
const nftCollectionModel = require("../models/NftCollectionModel");
const profileModel = require("../models/profileModel");
const userWalletModel = require("../models/userWalletModel")
const ethers = require("ethers");
const { WOLFPUPS_NFT_address, WOLFPUPS_NFT_address_BSC } = require('../utils/config');
const WOLFPUPS_NFT_ABI = require("../utils/WOLFPUPS_NFT_ABI.json")
const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth")
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


const getStats =  async (req,res) => {
    try{

    const profiles = await profileModel.find();
    const wallets = await userWalletModel.find();
    const nfts = await nftCollectionModel.find();
    const nftsNamed = await nftCollectionModel.find({lazyName : {$ne : ""} });

    res.status(200).json({ success: true, count : {profiles : profiles.length ,wallets : wallets.length, nfts: nfts.length , nftsNamed : nftsNamed.length} ,  message: "Found Result" })
}
catch(e){
    res.status(200).json({ success: true, count : {profiles : 0 ,wallets : 0 , nfts: 0 , nftsNamed: 0 } , message: "Not Found Result"})

}


}

const checkMasterCollector =  async (req,res) => {
    // const userWallets = await userWalletModel.find({ userId: user._id ,syncing : false }).populate("userId");

    try {
        // const getAllback = await nftCollectionModel.find({ attributes: {$elemMatch : { trait_type: "Back" ,value: "Grey" } } });
        // console.log(getAllback.length)
        console.log(req.query)

        let _userName = req.query.userName
        const userId = await profileModel.findOne({userName: _userName}).select("_id");
        console.log(userId)
        const getNfts = await nftCollectionModel.find({   "userId": userId._id });
        let backAttr = ["wood" , "earth" , "metal" , "water" , "fire"]; 
        let backAttrFound = []
        getNfts.map((v,i) => {
            // console.log(v.metadata)
            let _elm = v.metadata.attributes[0].value.toString();
            _elm = _elm.replace("Light " , "");
            _elm = _elm.replace("Medium " , "");
            _elm = _elm.replace("Dark " , "");
            // console.log(_elm)
            _elm = _elm.toLowerCase();
            if(!backAttrFound.includes(_elm)){
                backAttrFound.push(_elm);
            }
        })

        if(backAttrFound.length == backAttr.length){
            res.status(200).json({ success: true, isMaster : true ,  message: "Found Result: "+backAttrFound.length, responseResult: backAttrFound })

        }
        else{
          
                res.status(200).json({ success: true, isMaster : false , message: "Not Found Result: "+backAttrFound.length, responseResult: backAttrFound })
    
       
        }

        


    }
    catch(e){
        res.status(500).json({ success: false, isMaster : false , message: "Query Error", responseResult: e })

    }

    

}



const checkGrandMasterCollector =  async (req,res) => {
    // const userWallets = await userWalletModel.find({ userId: user._id ,syncing : false }).populate("userId");

    try {
        // const getAllback = await nftCollectionModel.find({ attributes: {$elemMatch : { trait_type: "Back" ,value: "Grey" } } });
        // console.log(getAllback.length)

        let _userName = req.query.userName
        const userId = await profileModel.findOne({userName: _userName}).select("_id");
        console.log(req.body)
        const getNfts = await nftCollectionModel.find({   "userId": userId._id });
        let backAttr = ["wood" , "earth" , "metal" , "water" , "fire"]; 

        let backAttrFound = []
        let greyBack = [] ; 
        getNfts.map((v,i) => {
            // console.log(v.metadata)
            let _elm = v.metadata.attributes[0].value.toString();
            _elm = _elm.replace("Light " , "");
            _elm = _elm.replace("Medium " , "");
            _elm = _elm.replace("Dark " , "");
            // console.log(_elm)
            _elm = _elm.toLowerCase();
           
            if(!backAttrFound.includes(_elm)){
                backAttrFound.push(_elm);
            }
            if(!greyBack.includes(_elm)){
                if(v.metadata.attributes[1].value == "Grey" || v.metadata.attributes[1].value == "grey"){
                    greyBack.push(_elm);
                }
            }
        })

        if(greyBack.length == backAttr.length){
            res.status(200).json({ success: true, isGrandMaster : true , message: "Found Result: "+greyBack.length, responseResult: greyBack })

        }
        else{
          
                res.status(200).json({ success: true,isGrandMaster : false , message: "Not Found Result: "+greyBack.length, responseResult: greyBack })
    
       
        }

        


    }
    catch(e){
        res.status(500).json({ success: false,isGrandMaster : false , message: "Query Error", responseResult: e })

    }

    

}


const addOrUpdateNftCollectionUser = async (_userId) => {
    // console.log("hi");
     
 

    try {
        const users = await profileModel.find({_id: _userId}).select("_id");
        // console.log(users);

        if (users.length <= 0) {
            console.log("No any user Added Yet");
        

        return null;

        } else {
            
            const userDetail = await Promise.all(users.map(async (user) => {
                // console.log(user._id);
               
                const userWallets = await userWalletModel.find({ userId: user._id }).populate("userId");
                let w = 0 

                await Promise.all(userWallets.map(async (wallets) => {
                    // console.log(wallets);
                const checkSync = await userWalletModel.find({ userId: user._id , address : wallets.address , networkName: wallets.networkName }).select("syncing");
                w++ ;
                // console.log("data fetched for" , user._id , checkSync )
                
                if(!checkSync[0].syncing){
                console.log("syncing" , user._id , wallets.address )

                await userWalletModel.findOneAndUpdate({  userId: user._id , address : wallets.address , networkName: wallets.networkName }, { $set: {syncing:true,synced: false} }, { new: true });
                await nftCollectionModel.updateMany({ userId: user._id , tokenOwner:  wallets.address , chainName:wallets.networkName }, { $set: {exist:false} }, { new: true });
 

                        // console.log(wallets[i]);
                        let _wallet = wallets;
                        if (_wallet.networkName === "BSC Testnet") {
                            const contract = getContract(WOLFPUPS_NFT_address_BSC, WOLFPUPS_NFT_ABI, bscprovider);
                            // console.log(contract);
                            const balanceOf = await contract.balanceOf(_wallet.address);
                            console.log(parseInt(balanceOf),"ggg");
                            let ac = 0 ;

                            for (let i = 0; i < parseInt(balanceOf); i++) {
                                ac++

                                const tokenId = await contract.tokenOfOwnerByIndex(_wallet.address, i);
                                // console.log(tokenId.toString(),"tokenId");
                              
                                // console.log(metadata.data);
                                // entry in db
                                const nft = await nftCollectionModel.find({ $and: [{ userId: user._id }, { tokenAddress: WOLFPUPS_NFT_address_BSC}, { tokenId: tokenId }] }).populate("userId")
                                if (nft.length > 0) {
                                    // console.log("This nft already added");
                                console.log("Excluded:", i);
                                  await nftCollectionModel.findOneAndUpdate({ $and: [{ userId: user._id }, { tokenAddress: WOLFPUPS_NFT_address_BSC}, { tokenId: tokenId }]}, { $set: {exist:true} }, { new: true });

                                } else {
                                    const tokenUri = await contract.tokenURI(tokenId);
                                    // console.log(tokenUri,"tokenUri");
                                    const metadata = await getUserNFTByTokenURI(tokenUri);
                                    console.log(metadata);
                                    const obj={
                                        userId: user._id, 
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

                                if(ac == parseInt(balanceOf)){
                                    await userWalletModel.findOneAndUpdate({  userId: user._id , address : _wallet.address , networkName : "BSC Testnet"}, { $set: {syncing:false,synced: true} }, { new: true });
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
                                const nft = await nftCollectionModel.find({ $and: [{ userId: user._id }, { tokenAddress: WOLFPUPS_NFT_address}, { tokenId: tokenId }] }).populate("userId")
                                if (nft.length > 0) {
                                    // console.log("This nft already added");
                                    // console.log("Excluded:", i);

                                    await nftCollectionModel.findOneAndUpdate({ $and: [{ userId: user._id }, { tokenAddress: WOLFPUPS_NFT_address}, { tokenId: tokenId }]}, { $set: {exist:true} }, { new: true });


                                } else {
                                    const tokenUri = await contract.tokenURI(tokenId);
                                    const metadata = await getUserNFTByTokenURI(tokenUri);
                                // console.log(metadata);

                                    const obj={
                                        userId: user._id, 
                                        tokenAddress:WOLFPUPS_NFT_address,
                                        tokenId:tokenId,
                                        tokenOwner:_wallet.address,
                                        chainName:_wallet.networkName,
                                        exist : true,
                                        metadata:metadata.data
                                    }
                                // console.log(i);
                                  
                                    await new nftCollectionModel(obj).save();

                                }
                                if(ac == parseInt(balanceOf)){
                                    await userWalletModel.findOneAndUpdate({  userId: user._id, address : _wallet.address , networkName : "Ethereum"}, { $set: {syncing:false,synced: true} }, { new: true });
                                    console.log("synced", user._id)

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

const addOrUpdateNftCollection = async () => {
    // console.log("hi");
     
    // await userWalletModel.updateMany({syncing : true}, { $set: { syncing: false } })
 

    try {
        const users = await profileModel.find().select("_id");
        // console.log(users);

        if (users.length <= 0) {
            console.log("No any user Added Yet");
        

        return null;

        } else {
            
            const userDetail = await Promise.all(users.map(async (user) => {
                // console.log(user._id);
               
                const userWallets = await userWalletModel.find({ userId: user._id ,syncing : false }).populate("userId");
                let w = 0 

                await Promise.all(userWallets.map(async (wallets) => {
                    // console.log(wallets);
                // const checkSync = await userWalletModel.find({ userId: user._id , address : wallets.address , networkName: wallets.networkName }).select("syncing");
                w++ ;
                // console.log("data fetched for" , user._id , checkSync )
                
                // if(!checkSync[0].syncing){
                console.log("syncing" , user._id , wallets.address )

                await userWalletModel.findOneAndUpdate({  userId: user._id , address : wallets.address , networkName: wallets.networkName }, { $set: {syncing:true,synced: false} }, { new: true });
                await nftCollectionModel.updateMany({ userId: user._id , tokenOwner:  wallets.address , chainName:wallets.networkName }, { $set: {exist:false} }, { new: true });
 

                        // console.log(wallets[i]);
                        let _wallet = wallets;
                        if (_wallet.networkName === "BSC Testnet") {

                            try{
                                const contract = getContract(WOLFPUPS_NFT_address_BSC, WOLFPUPS_NFT_ABI, bscprovider);
                                // console.log(contract);
                                const balanceOf = await contract.balanceOf(_wallet.address);
                                console.log(parseInt(balanceOf),"ggg");
                                let ac = 0 ;
    
                                for (let i = 0; i < parseInt(balanceOf); i++) {
                                    ac++
                                    try{
                                    const tokenId = await contract.tokenOfOwnerByIndex(_wallet.address, i);
                                    // console.log(tokenId.toString(),"tokenId");
                                  
                                    // console.log(metadata.data);
                                    // entry in db
                                    const nft = await nftCollectionModel.find({ $and: [{ userId: user._id }, { tokenAddress: WOLFPUPS_NFT_address_BSC}, { tokenId: tokenId }] }).populate("userId")
                                    if (nft.length > 0) {
                                        // console.log("This nft already added");
                                    console.log("Excluded:", i);
                                      await nftCollectionModel.findOneAndUpdate({ $and: [{ userId: user._id }, { tokenAddress: WOLFPUPS_NFT_address_BSC}, { tokenId: tokenId }]}, { $set: {exist:true} }, { new: true });
    
                                    } else {
                                        const tokenUri = await contract.tokenURI(tokenId);
                                        // console.log(tokenUri,"tokenUri");
                                        const metadata = await getUserNFTByTokenURI(tokenUri);
                                        console.log(metadata);
                                        const obj={
                                            userId: user._id, 
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
    
                                    if(ac == parseInt(balanceOf)){
                                        await userWalletModel.findOneAndUpdate({  userId: user._id , address : _wallet.address , networkName : "BSC Testnet"}, { $set: {syncing:false,synced: true} }, { new: true });
                                        console.log("synced", user._id)
    
                                    }
                                }
                                    catch{
                                        await userWalletModel.findOneAndUpdate({  userId: user._id , address : _wallet.address , networkName : "BSC Testnet"}, { $set: {syncing:false,synced: true} }, { new: true });
                                          }
                                }
                            }
                           catch{
                            await userWalletModel.findOneAndUpdate({  userId: user._id , address : _wallet.address , networkName : "BSC Testnet"}, { $set: {syncing:false,synced: true} }, { new: true });
                              }
                            

                        }
                        if (_wallet.networkName === "Ethereum") {

                            try{
                            const contract = getContract(WOLFPUPS_NFT_address, WOLFPUPS_NFT_ABI, provider);

                            const balanceOf = await contract.balanceOf(_wallet.address);
                            let ac= 0;
                            for (let i = 0; i < parseInt(balanceOf); i++) {
                                ac++
                                 try{
                                const tokenId = await contract.tokenOfOwnerByIndex(_wallet.address, i);
                           
                                // entry in db
                                      
                                // console.log(metadata)
                                const nft = await nftCollectionModel.find({ $and: [{ userId: user._id }, { tokenAddress: WOLFPUPS_NFT_address}, { tokenId: tokenId }] }).populate("userId")
                                if (nft.length > 0) {
                                    // console.log("This nft already added");
                                    // console.log("Excluded:", i);

                                    await nftCollectionModel.findOneAndUpdate({ $and: [{ userId: user._id }, { tokenAddress: WOLFPUPS_NFT_address}, { tokenId: tokenId }]}, { $set: {exist:true} }, { new: true });


                                } else {
                                    const tokenUri = await contract.tokenURI(tokenId);
                                    const metadata = await getUserNFTByTokenURI(tokenUri);
                                // console.log(metadata);

                                    const obj={
                                        userId: user._id, 
                                        tokenAddress:WOLFPUPS_NFT_address,
                                        tokenId:tokenId,
                                        tokenOwner:_wallet.address,
                                        chainName:_wallet.networkName,
                                        exist : true,
                                        metadata:metadata.data
                                    }
                                // console.log(i);
                                  
                                    await new nftCollectionModel(obj).save();

                                }
                                if(ac == parseInt(balanceOf)){
                                    await userWalletModel.findOneAndUpdate({  userId: user._id, address : _wallet.address , networkName : "Ethereum"}, { $set: {syncing:false,synced: true} }, { new: true });
                                    console.log("synced", user._id)

                                }
                            }
                            catch{
                                await userWalletModel.findOneAndUpdate({  userId: user._id , address : _wallet.address , networkName : "Ethereum"}, { $set: {syncing:false,synced: true} }, { new: true });
                                  }
                        }
                        }
                        catch{
                         await userWalletModel.findOneAndUpdate({  userId: user._id , address : _wallet.address , networkName : "Ethereum"}, { $set: {syncing:false,synced: true} }, { new: true });
                           }
                        }

                        

                // }

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


const getAllNftCollection = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        console.log("limit", limit)

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
        const limit = parseInt(req.query.limit) || 10;
        console.log("limit", limit)

        let _sort = { createdAt: -1 }
        if(req.query.filter == 2) {
            _sort =  {"viewsCount": -1}

        }
        else if(req.query.filter == 3) {
            _sort =  {likesCount: -1}
        }
         const nfts = await nftCollectionModel.find({ chainName: req.query.chainName, status: "SHOW" , exist : true }).sort(_sort).skip((page - 1) * limit).populate("userId", "-password").limit(limit);
         
        // const nfts =await nftCollectionModel.aggregate([
        //     {$match:{chainName: req.query.chainName, status: "SHOW" , exist : true}},
        //     {
        //         '$set': {
        //           'likesCount': {
        //             '$size': '$likes'
        //           }, 

        //         }
        //       },
        //     {
        //         "$sort": _sort
        //     },
        //     {"$skip":((page - 1) * limit)},
        //     {
        //         "$limit": limit
        //     },
        //     // {
        //     //     "$lookup": {
        //     //         "from": "NftCollection",
        //     //         "localField": "userId",
        //     //         "foreignField": "Profiles",
        //     //         "as": "userId"
        //     //     }
        //     // }
        // ])

        if (nfts.length > 0) {
            console.log("nft", nft)
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
                '$set': {
                  'likes': {
                    '$size': '$likes'
                  }, 

                }
              },
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
            // console.log(nfts);
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
    getAllNftByUserName,
   addOrUpdateNftCollectionUser,
   checkMasterCollector,
   checkGrandMasterCollector,
   getStats

}