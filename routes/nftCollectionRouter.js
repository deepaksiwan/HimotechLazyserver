const express =require("express")
const router=express.Router()
const {
    addOrUpdateNftCollection,
    getAllNftCollection,
    getAllNftByChainName,
    getMyNftCollection,
    getNftCollectionByChainNameAndUserName,
    updateNftNameOrDescription,
    getNftByNftCollectionId,
    toggleLikeNft,
    mostLikeNft,
    mostViewNft,
    recentlyListedNft,
    hideToggleNft,
    getAllHideNft,
    pinnedToggleNft,
    getAllPinnedNftByUserName,
    getAllNftByUserName
} =require('../controllers/nftCollectionController');
const {verifyToken}=require('../middleware/auth');

router.get("/addOrUpdate",addOrUpdateNftCollection);
router.put("/updateNftNameOrDescription",verifyToken,updateNftNameOrDescription)
router.get("/getAllNft",getAllNftCollection);
router.get("/getAllNftByChainName",getAllNftByChainName);
router.get("/getNftByNftCollectionId",getNftByNftCollectionId);
router.get("/getAllNftByUserName",getAllNftByUserName)
router.get("/getMyNft",verifyToken,getMyNftCollection);
router.get("/getNftCollectionByChainNameAndUserName",getNftCollectionByChainNameAndUserName);
router.put("/toggleLike",verifyToken,toggleLikeNft)
router.get("/mostLikeNft",mostLikeNft);
router.get("/mostViewNft",mostViewNft);
router.get("/recentlyListedNft",recentlyListedNft);
router.put("/hideToggleNft",verifyToken,hideToggleNft)
router.get("/getAllHideNft",verifyToken,getAllHideNft),
router.put("/pinnedToggleNft",verifyToken,pinnedToggleNft);
router.get("/getAllPinnedNftByUserName",getAllPinnedNftByUserName)

module.exports=router