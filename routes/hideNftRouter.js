const express =require("express")
const router=express.Router()
const {
    hideNft,
    unhideNft,
    getAllHideNfts
} =require('../controllers/hideNftController');
const {verifyToken}=require('../middleware/auth');

router.post("/hide",verifyToken,hideNft);
router.delete("/unhide",verifyToken,unhideNft);
router.get("/getAllHideNft",verifyToken,getAllHideNfts);

module.exports=router