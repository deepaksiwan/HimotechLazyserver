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
router.put("/updateNftNameOrDescription",verifyToken,updateNftNameOrDescription);
router.get("/getAllNft",getAllNftCollection);
/**
 * @swagger
 * /api/v1/nftCollection/getAllNftByChainName:
 *   get:
 *     tags:
 *       - NftCollections
 *     description: get your all nft collection by chainName
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: chainName
 *         description: chainName required.
 *         in: formData
 *     responses:
 *       200:
 *         description: Thanks,Your nft fetch successfully.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
router.get("/getAllNftByChainName",getAllNftByChainName);
router.get("/getNftByNftCollectionId",getNftByNftCollectionId);
router.get("/getAllNftByUserName",getAllNftByUserName)
router.get("/getMyNft",verifyToken,getMyNftCollection);
router.get("/getNftCollectionByChainNameAndUserName",getNftCollectionByChainNameAndUserName);
router.put("/toggleLike",verifyToken,toggleLikeNft)
router.get("/mostLikeNft",mostLikeNft);
router.get("/mostViewNft",mostViewNft);
router.get("/recentlyListedNft",recentlyListedNft);
router.put("/hideToggleNft",verifyToken,hideToggleNft);
/**
 * @swagger
 * /api/v1/nftCollection/getAllHideNft:
 *   get:
 *     tags:
 *       - NftCollections
 *     description: get your all hide nft collection
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Thanks,Your nft fetch successfully.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
router.get("/getAllHideNft",verifyToken,getAllHideNft);
router.put("/pinnedToggleNft",verifyToken,pinnedToggleNft);
router.get("/getAllPinnedNftByUserName",getAllPinnedNftByUserName)

module.exports=router