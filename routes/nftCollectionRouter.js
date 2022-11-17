const express =require("express")
const router=express.Router()
const {
    addOrUpdateNftCollection,
    getAllNftCollection,
    getMyNftCollection,
    getMyNftByTokenAddressAndTokenId,
    updateNftNameOrDescription,
    getNftByTokenAddressAndTokenId
} =require('../controllers/nftCollectionController');
const {verifyToken}=require('../middleware/auth');

router.post("/addOrUpdate",verifyToken,addOrUpdateNftCollection);
router.put("/updateNftNameOrDescription",verifyToken,updateNftNameOrDescription)
router.get("/getAllNft",getAllNftCollection);
router.get("/getNftByTokenAddressAndTokenId",getNftByTokenAddressAndTokenId)
router.get("/getMyNft",verifyToken,getMyNftCollection);
router.get("/getMyNftByTokenAddressAndTokenId",verifyToken,getMyNftByTokenAddressAndTokenId)

module.exports=router