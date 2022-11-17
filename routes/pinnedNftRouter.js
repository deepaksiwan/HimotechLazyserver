const express =require("express")
const router=express.Router()
const {
    pinnedNft,
    unpinnedNft,
    getAllPinnedNfts
} =require('../controllers/pinnedNftController');
const {verifyToken}=require('../middleware/auth');

router.post("/pinned",verifyToken,pinnedNft);
router.delete("/unpinned",verifyToken,unpinnedNft);
router.get("/getAllPinnedNft",verifyToken,getAllPinnedNfts);

module.exports=router