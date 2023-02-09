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
    getAllNftByUserName,
    checkMasterCollector,
    checkGrandMasterCollector,
    getStats
} =require('../controllers/nftCollectionController');
const {verifyToken}=require('../middleware/auth');

router.get("/checkmaster",checkMasterCollector);
router.get("/stats",getStats);

router.get("/checkgrandmaster",checkGrandMasterCollector);

router.get("/addOrUpdate",addOrUpdateNftCollection);

/**
 * @swagger
 * /api/v1/nftCollection/updateNftNameOrDescription:
 *   put:
 *     tags:
 *       - NftCollections
 *     description: update nft name or description by nftCollectionId
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: nftCollectionId required.
 *         in: formData
 *         required: true
 *       - name: lazyName
 *         description: lazyName.
 *         in: formData
 *       - name: lazyDescription
 *         description: lazyDescription.
 *         in: formData
 *     responses:
 *       200:
 *         description: Nft Updated successfully.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
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
 *         required: true
 *     responses:
 *       200:
 *         description: Thanks,Your nft fetch successfully.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
router.get("/getAllNftByChainName",getAllNftByChainName);

/**
 * @swagger
 * /api/v1/nftCollection/getNftByNftCollectionId:
 *   get:
 *     tags:
 *       - NftCollections
 *     description: get your  nft collection by nftCollectionId
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: nftCollectionId required.
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Thanks,Your nft fetch successfully.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
router.get("/getNftByNftCollectionId",getNftByNftCollectionId);

/**
 * @swagger
 * /api/v1/nftCollection/getAllNftByUserName:
 *   get:
 *     tags:
 *       - NftCollections
 *     description: get your  nft collection by userName
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userName
 *         description: userName required.
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Thanks,Your  all nft fetch successfully.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
router.get("/getAllNftByUserName",getAllNftByUserName)
router.get("/getMyNft",verifyToken,getMyNftCollection);

/**
 * @swagger
 * /api/v1/nftCollection/getNftCollectionByChainNameAndUserName:
 *   get:
 *     tags:
 *       - NftCollections
 *     description: get your  nft collection by chainName and userName
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: chainName
 *         description: chainName required.
 *         in: formData
 *         required: true
 *       - name: userName
 *         description: userName required.
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Thanks,Your  all nft fetch successfully.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
router.get("/getNftCollectionByChainNameAndUserName",getNftCollectionByChainNameAndUserName);

/**
 * @swagger
 * /api/v1/nftCollection/toggleLike:
 *   put:
 *     tags:
 *       - NftCollections
 *     description: like or dislike nft collection by nftCollectionId
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: nftCollectionId required.
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: nft like/dislike successfully.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
router.put("/toggleLike",verifyToken,toggleLikeNft)
router.get("/mostLikeNft",mostLikeNft);
router.get("/mostViewNft",mostViewNft);
router.get("/recentlyListedNft",recentlyListedNft);

/**
 * @swagger
 * /api/v1/nftCollection/hideToggleNft:
 *   put:
 *     tags:
 *       - NftCollections
 *     description: hide or unhide nft collection by nftCollectionId
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: nftCollectionId required.
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: nft hide/unhide successfully.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
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

/**
 * @swagger
 * /api/v1/nftCollection/pinnedToggleNft:
 *   put:
 *     tags:
 *       - NftCollections
 *     description: pin or unpin nft collection by nftCollectionId
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: nftCollectionId required.
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: nft pin/unpin successfully.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
router.put("/pinnedToggleNft",verifyToken,pinnedToggleNft);
/**
 * @swagger
 * /api/v1/nftCollection/getAllPinnedNftByUserName:
 *   get:
 *     tags:
 *       - NftCollections
 *     description: get your all pinned nft collection by userName
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userName
 *         description: userName required.
 *         in: formData
 *     responses:
 *       200:
 *         description: Thanks,Your pin nft fetch successfully.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
router.get("/getAllPinnedNftByUserName",getAllPinnedNftByUserName)

module.exports=router