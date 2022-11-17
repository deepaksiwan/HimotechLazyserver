const mongoose = require("mongoose");

const HideNftSchema = mongoose.Schema({
  nftCollectionId:{type:mongoose.Schema.Types.ObjectId,ref:"NftCollection"},
   hideNfts:[{
    tokenAddress: {
        type: String,
        required: [true, "Please Enter The address of the contract of the NFT"],
        },
      tokenId: {
          type: String,
          required: [true, "Please Enter The token id of the NFT"],
        },
   }],

});

module.exports = mongoose.model("HideNft", HideNftSchema);
