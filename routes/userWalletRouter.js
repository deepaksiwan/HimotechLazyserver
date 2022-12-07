const express =require("express")
const router=express.Router()
const {
addWallet,
removeWallet,
getAllWallet,
syncOffAllWallet
} =require('../controllers/userWalletController');
const {verifyToken}=require('../middleware/auth');

/**
 * @swagger
 * /api/v1/userWallet/add:
 *   post:
 *     tags:
 *       - UserWallets
 *     description: add new wallet
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: networkName
 *         description: networkName .
 *         in: formData
 *       - name: address
 *         description: address .
 *         in: formData
 *     responses:
 *       200:
 *         description: Thanks,Your wallet add successfully.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
router.post("/add",verifyToken,addWallet);

/**
 * @swagger
 * /api/v1/userWallet/remove:
 *   delete:
 *     tags:
 *       - UserWallets
 *     description: remove wallet
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: walletId
 *         description: walletId required.
 *         in: formData
 *     responses:
 *       200:
 *         description: Thanks,Your wallet remove successfully.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
router.delete("/remove",verifyToken,removeWallet);

/**
 * @swagger
 * /api/v1/userWallet/view:
 *   get:
 *     tags:
 *       - UserWallets
 *     description: get your all wallet
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Thanks,Your wallet fetch successfully.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
router.get("/view",verifyToken,getAllWallet);
router.get("/syncoff",syncOffAllWallet);

module.exports=router