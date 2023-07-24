import { ChatModel } from '../models/Chat.js';
import { calcHashForArray } from '../utils/calcHash.js';
import { Server } from "socket.io";
import passport from "passport";

import sessionMiddleware from "../middleware/session.js";

class ChatModule {
  io = null;

  static initSocketConnection = (httpServer) => {
    // if (this.io) {
    //   return this.io;
    // }

    this.io = new Server(httpServer);

    // convert a connect middleware to a Socket.IO middleware
    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

    this.io.use(wrap(sessionMiddleware));
    this.io.use(wrap(passport.initialize()));
    this.io.use(wrap(passport.session()));

    this.io.use((socket, next) => {
      console.log(socket.request.user);
      next();
      // if (socket.request.user) {
      //   next();
      // } else {
      //   next(new Error('unauthorized'))
      // }
    });

    this.io.on("connection", (socket) => {
      console.log(socket.request.session.authenticated);
      // console.log("user: ", socket.request);
    });
  }

  static async create(users) {
    if (!Array.isArray(users)) {
      throw new Error('Users must be an array');
    }

    const usersHash = calcHashForArray(users);

    const createdChat = await new ChatModel({
      users, 
      usersHash,
      createdAt: new Date(),
    });

    return createdChat.save();
  }

  // Finds chat by hash made from sorted users array (chat id)
  static async find(users) {
    if (!Array.isArray(users)) {
      throw new Error('Users must be an array');
    }

    const usersHash = calcHashForArray(users);
    
    const chat = await ChatModel.find({ usersHash });

    return chat ?? null;
  }

  static async sendMessage({ author, reciever, text }) {
    let chat = await ChatModule.find([author, reciever]);

    if (!chat) {
      chat = await ChatModule.create([author, reciever]);
    }

    chat.messages.push({
      author,
      text,
      sentAt: new Date(),
    });

    return await chat.save();
  }

  static async subscribe(cb) {
    this.io.on("connection", (socket) => {
      const chatId = socket.handshake.query.chatId;
      
      socket.on("sendMessage", (message) => {
        console.log(socket.request.session.authenticated);
        cb({ chatId, message });
      });
    });
  }

  static async getHistiory(id) {
    const chat = await ChatModel.findById(id);

    return chat?.messages ?? null
  }
}

export default ChatModule;