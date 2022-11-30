const  axios =require("axios");
// import ApiConfigs from "../../ApiConfig";
// import { Buffer } from "buffer";
// const projectId = "2DU15Knbsv9ZPXdhO7QIrgDdU2l";
// const projectSecret = "aabc21458c64527ee50fd50f0bb0f3ac";
// const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const getUserNFTByTokenURI = async (tokenURI) => {
  const tokenUri=tokenURI.replace("ipfs://","https://wizard.infura-ipfs.io/ipfs/")
    try {
      const data = await axios({
        method:'GET',
        url:tokenUri, 
        headers : {
          // 'Accept-Encoding': 'application/json'
          'Origin' : 'http://localhost:5001'
        }
    });
    console.log(tokenUri)
    console.log(data)
    return data;
    } catch (error) {
      // console.log(error,"hk");
    }
};
module.exports=getUserNFTByTokenURI
