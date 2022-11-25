const express =require("express")
const router=express.Router()
const {
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
    getAllPinnedNft,
    getAllNftByUserName
} =require('../controllers/nftCollectionController');
const {verifyToken}=require('../middleware/auth');

router.post("/addOrUpdate",verifyToken,addOrUpdateNftCollection);
router.put("/updateNftNameOrDescription",verifyToken,updateNftNameOrDescription)
router.get("/getAllNft",getAllNftCollection);
router.get("/getNftByNftCollectionId",getNftByNftCollectionId);
router.get("/getAllNftByUserName",getAllNftByUserName)
router.get("/getMyNft",verifyToken,getMyNftCollection);
router.put("/toggleLike",verifyToken,toggleLikeNft)
router.get("/mostLikeNft",mostLikeNft);
router.get("/mostViewNft",mostViewNft);
router.get("/recentlyListedNft",recentlyListedNft);
router.put("/hideToggleNft",verifyToken,hideToggleNft)
router.get("/getAllHideNft",verifyToken,getAllHideNft),
router.put("/pinnedToggleNft",verifyToken,pinnedToggleNft);
router.get("/getAllPinnedNft",verifyToken,getAllPinnedNft)

module.exports=router