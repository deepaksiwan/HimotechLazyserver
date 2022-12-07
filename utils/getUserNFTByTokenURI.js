const  axios =require("axios");
require("dotenv").config()

// import ApiConfigs from "../../ApiConfig";
// import { Buffer } from "buffer";


const getUserNFTByTokenURI = async (tokenURI) => {
  const tokenUri=tokenURI.replace("ipfs://","https://wizard.mypinata.cloud/ipfs/")
    try {
      const data = await axios({
        method:'GET',
        url:tokenUri, 
        headers : {
          'Accept-Encoding': 'application/json'
          // 'Origin' : process.env.ORIGIN
        }
    });

    return data;
    } catch (error) {
      // console.log(error,"hk");
    }
};
module.exports=getUserNFTByTokenURI
