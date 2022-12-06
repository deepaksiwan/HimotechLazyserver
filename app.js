require("dotenv").config()
const express=require('express');
const cors=require('cors');
const connectDB=require("./connectDB")
const morgan=require('morgan');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const profileRouter=require("./routes/profileRouter");
const userWalletRouter=require('./routes/userWalletRouter');
const nftCollectionRouter=require('./routes/nftCollectionRouter');
var cron = require('node-cron');
const { addOrUpdateNftCollection } = require("./controllers/nftCollectionController");
const SettingsModel = require("./models/SettingsModel");

const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

// CORS Policy
// app.use(
// 	cors({
// 		allowedHeaders: ["Content-Type", "token", "authorization"],
// 		exposedHeaders: ["token", "authorization"],
// 		origin: "*",
// 		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// 		preflightContinue: false,
// 	})
// );
app.use(cors())
app.use(morgan("dev"))

// Database Connection
connectDB(DATABASE_URL);


app.use(express.urlencoded({ extended: true, limit: "1000mb" }));
// JSON
app.use(express.json({ limit: "1000mb" }));
app.set('trust proxy', true)
// Load Routes
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/userWallet", userWalletRouter);
app.use("/api/v1/nftCollection",nftCollectionRouter)


// swagger API Documentation start
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "lazy-nfts API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				}
			}
		},
		security: [{
			bearerAuth: []
		}],
		servers: [
			{
				url: "http://localhost:5001",
			},
		],
	},
	apis: ["./routes/*.js","./api.yaml"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
// swagger API Documentation end

cron.schedule('*/1 * * * *', async () => {
	console.log("cron running");
	// addOrUpdateNftCollection() 


	// console.log("cron set");
	// const cron = await SettingsModel.find({ key: "cron" });
	// console.log(cron);
    // if(cron.length > 0) {
	// 	if(!cron[0].running){
	// 	console.log("Resume Running")
	// 	await SettingsModel.findOneAndUpdate({ _id: "63874cc9aaedd49682ac4eea" }, { $set: {running:true} }, { new: true });

	// 		await Promise.all(addOrUpdateNftCollection());

	// 		await SettingsModel.findOneAndUpdate({ _id: "63874cc9aaedd49682ac4eea" }, { $set: {running:false} }, { new: true });

	// 	}else{
	// 		console.log("Already Running")

	// 	}

    // }
    // else{
	// 	console.log("Started Running")
    //     const obj={
    //        key: "cron",
    //        running: true
    //     }
    //     await new SettingsModel(obj).save();
	// 	addOrUpdateNftCollection()

    // }
});

app.listen(port, () => {
  console.log(`Server live at ${port}`);
})