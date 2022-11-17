const mongoose = require("mongoose");

const PinnedNftSchema = mongoose.Schema({
  nftCollectionId:{type:mongoose.Schema.Types.ObjectId,ref:"NftCollection"},
  pinnedNfts:[{
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

module.exports = mongoose.model("PinnedNft", PinnedNftSchema);
