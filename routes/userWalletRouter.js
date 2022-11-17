const express =require("express")
const router=express.Router()
const {
addWallet,
removeWallet,
getAllWallet
} =require('../controllers/userWalletController');
const {verifyToken}=require('../middleware/auth');

router.post("/add",verifyToken,addWallet);
router.delete("/remove",verifyToken,removeWallet);
router.get("/view",verifyToken,getAllWallet);

module.exports=router