import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import passport from "passport";

import path from "path";
import { createServer } from "http";

import { PORT, MONGO_URL } from "./config.js";

import ChatModule from "./modules/Chat.js";

import authRouter from "./routes/User.js";
import adRouter from "./routes/Advertisement.js";
import chatRouter from "./routes/Chat.js";

import sessionMiddleware from "./middleware/session.js";

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

  app.use(sessionMiddleware);
  
  app.use(passport.initialize()) 
  app.use(passport.session());

  const httpServer = createServer(app);

  ChatModule.initSocketConnection(httpServer);

  app.set("views", path.resolve("src", "views"));
  app.set("view engine", "ejs");
  
  app.use('/', authRouter);
  app.use('/', adRouter);
  app.use('/', chatRouter);
  
  app.use("/", (req, res, next) => {
    res.send("Hello world!");
    next();
  });

  httpServer.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
  });

  ChatModule.subscribe(({ chatId, message }) => {
    console.log(chatId, message);
  });

};

initApp();
