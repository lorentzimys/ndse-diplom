import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { resolve } from "path";
import { createServer } from "http";

import { PORT, MONGO_URL } from "./config.js";

import ChatModule from "./modules/Chat.js";
import UserModule from "./modules/User.js";

import authRouter from "./routes/User.js";
import adRouter from "./routes/Advertisement.js";
import chatRouter from "./routes/Chat.js";

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
  
  app.use(express.static(resolve("public")));
  app.use(bodyParser.json()); 
  app.use(bodyParser.urlencoded({ extended: true }));

  UserModule.prepareAuth(app);

  const httpServer = createServer(app);
  const io = ChatModule.prepareSocketConnection(httpServer);
  
  io.on("connection", (socket) => {
    const currentUser = socket.request.user;
    
    // 2.5.1 Событие getHistory
    socket.on("getHistory", async (senderUserId) => {
      try {
        const chat = await ChatModule.find([currentUser.id, senderUserId]);
        const chatHistory = await ChatModule.getHistory(chat._id);
  
        socket.emit("chatHistory", chatHistory);
      } catch (error) {
        console.log(error);
      }
    });

    // 2.5.2 Событие sendMessage
    socket.on("sendMessage", (reciever, message) => {
      // 2.5.3 Событие newMessage
      socket.emit("newMessage", message);
    });
  });

  // При подключении нового клиента должна создаваться подписка на новые сообщения в чате (модуль «Чат»).
  // Полученное сообщение передаётся целиком клиенту.
  ChatModule.subscribe(({ chatId, message }) => {
    console.log(`Chat module subsctiption: chatId=${chatId}, message=${message}`);
  });
 
  app.set("views", resolve("src", "views"));
  app.set("view engine", "ejs");
  
  app.use('/', authRouter);
  app.use('/', adRouter);
  app.use('/', chatRouter);

  app.use("/", (req, res, next) => {
    res.send(`NDSE backend is running on port ${PORT}`);
    next();
  });
};

initApp();
