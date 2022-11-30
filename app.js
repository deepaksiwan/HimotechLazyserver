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

app.listen(port, () => {
  console.log(`Server live at http://localhost:${port}`);
})