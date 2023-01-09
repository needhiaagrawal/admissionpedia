
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db';
import router from './router';
import { migrateDB } from './migration/migration';
// Initializing Env
dotenv.config() 
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.json());
app.use(
  cors({
    allowedHeaders: ["sessionid", "content-type", "x-jwt-token"],
    exposedHeaders: ["sessionid"],
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);

app.use('/api', router);

sequelize
	.sync()
	.then(() => {
		app.listen(process.env.APP_PORT);
		console.log("App listening on port " + process.env.APP_PORT);
    migrateDB();
	})
	.catch(err => {
		console.log(err);
	});

