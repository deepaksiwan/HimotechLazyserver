const { timestamp } = require("joi/lib/types/date");
const mongoose = require("mongoose");

const NftCollectionSchema = mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId,ref:"Profile"},
  nfts:[{
  tokenAddress: {
    type: String,
    required: [true, "Please Enter The address of the contract of the NFT"],
    },
  tokenId: {
      type: String,
      required: [true, "Please Enter The token id of the NFT"],
    },
  tokenOwner:{
    type: String,
    required: [true, "Please Enter The token Owner of the NFT"],
  } ,
  metadata:{
    dna:{type: String},
    name:{type: String,trim: true,},
    description:{type:String,trim: true,},
    image:{type:String},
    edition:{type:String},
    date:{type:String},
    attributes:[{
      trait_type:{type:String},
      value:{type:String}
    }]

  },
  lazyName:{
    type: String,
    default:"",
    trim: true,
  },
  lazyDescription: {
    type: String,
    default:"",
    trim: true,
  },

  status:{
    type:String,
    enum:["SHOW","HIDE"],
    default:"SHOW"
  }

  }],

},
{ timestamps: true }
);

module.exports = mongoose.model("NftCollection", NftCollectionSchema);
