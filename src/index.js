import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import path from "path";

import { PORT, MONGO_URL } from "./config.js";

import authRouter from "./routes/auth.js";
import adRouter from "./routes/ad.js";

const initMongoDb = async () => {
  try {
    await mongoose.connect(MONGO_URL, { dbName: "ndjs" });
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

const initApp = async () => {
  const app = express();

  await initMongoDb();
  
  app.use(express.static(path.resolve("public")));
  app.use(bodyParser.json()); 
  app.use(bodyParser.urlencoded({ extended: true }));
  
  app.use(session({
    secret: 'top secret',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      dbName: "ndjs",
      collectionName: "sessions",
    })
  }));
  
  app.use(passport.initialize()) 
  app.use(passport.session());

  app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
  });
  
  app.use('/', authRouter);
  app.use('/', adRouter);
  
  app.use("/", (req, res, next) => {
    res.send("Hello world!");
    next();
  });
};

initApp();
