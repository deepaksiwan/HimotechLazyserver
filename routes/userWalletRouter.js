const express =require("express")
const router=express.Router()
const {
addWallet,
removeWallet,
getAllWallet,
syncOffAllWallet
} =require('../controllers/userWalletController');
const {verifyToken}=require('../middleware/auth');

router.post("/add",verifyToken,addWallet);
router.delete("/remove",verifyToken,removeWallet);
router.get("/view",verifyToken,getAllWallet);
router.get("/syncoff",syncOffAllWallet);

module.exports=router