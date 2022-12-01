const mongoose = require("mongoose");

const userWalletSchema = new mongoose.Schema({
        userId:{type:mongoose.Schema.Types.ObjectId,ref:"Profile"},
        wallets:[{
        networkName:{type:String},
        address:{type:String,},
        }],
        synced:{type:Boolean,},
        syncing:{type:Boolean,}

      
});

module.exports = mongoose.model("UserWallet", userWalletSchema);
