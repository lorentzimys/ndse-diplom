import { Server } from "socket.io";
import passport from "passport";

import { ChatModel, ChatMessageModel } from '../models/Chat.js';
import { UserModel } from '../models/User.js';
import sessionMiddleware from "../middleware/session.js";

import { PORT } from "../config.js";

class ChatModule {
  io = null;

  /** Prepares socket connection
   * @param {Server} httpServer 
   * @returns {SocketIO.Server}
   */
  static prepareSocketConnection = (httpServer) => {
    if (this.io) {
      return this.io;
    }

    this.io = new Server(httpServer);

    // convert a connect middleware to a Socket.IO middleware
    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

    this.io.use(wrap(sessionMiddleware));
    this.io.use(wrap(passport.initialize()));
    this.io.use(wrap(passport.session()));

    this.io.on("connection", (socket) => {
      console.log("connected");
    });

    httpServer.listen(PORT, async () => {
      console.log(`Socket is listening port ${PORT}`);
    });

    return this.io;
  }

  /** Checks if all users for chat exist
   * @param {string[]} userIds 
   * @returns {UserModel[] | false}
   * @throws {Error} if users are not found
   */
  static async findUsersForChat(userIds) {
    if (!Array.isArray(userIds)) {
      throw new Error('Users must be an array');
    }

    try {
      const users = await UserModel.find({
        '_id': { 
          $in: userIds,
        },
      });
      
      if (users.length !== userIds.length) {
        throw new Error('Some users are not found');
      }
  
      return users;
    } catch (error) {
      return false;
    }
  }

  /** Creates a chat for a given users array
   * @param {string[]} userIds
   * @returns {ChatModel}
   * @throws {Error}
  */
  static async create(userIds) {
    try {
      const existingChat = await ChatModule.find(userIds);

      if (existingChat) {
        throw new Error('Chat already exists');
      }

      const createdChat = await new ChatModel({
        users: userIds, 
        createdAt: new Date(),
      });

      return createdChat.save();
    } catch (error) {
      throw error;
    }
  }

  /** 1.3.1. Функция «Получить чат между пользователями»
   * Finds a chat for a given users array
   * @param {string[]} userIds 
   * @returns {ChatModel | null}
   * @throws {Error} if users are not found
  */
  static async find(userIds) {
    try {
      const users = await ChatModule.findUsersForChat(userIds);
  
      if (users) {
        const chat = await ChatModel.findOne({
          'users': { 
            $in: userIds,
          },
        });
    
        if (!chat) {
          return null;
        }
    
        return chat;
      }
  
      return null;
    } catch (error) {
      throw error;
    }
  }

  /** 1.3.2. Функция «Отправить сообщение»
   * Saves a message to a chat and then notifies a reciever
   * @param {Object} paramsObj
   * @param {string} paramsObj.author
   * @param {string} paramsObj.reciever
   * @param {string} paramsObj.text
   * @returns {ChatMessageModel}
   */
  static async sendMessage({ author, reciever, text }) {
    try {
      const chat = await ChatModule.find([author, reciever]);
  
      if (!chat) {
        chat = await ChatModule.create([author, reciever]);
      }
  
      const newMessage = new ChatMessageModel({ author, text });
  
      chat.messages.push(newMessage);
  
      await newMessage.save();
      await chat.save();
  
      return newMessage;
    } catch (error) {
      throw error;
    }
  }

  /** 1.3.3. Подписаться на новые сообщения в чате
   * @param {*} cb 
   */
  static async subscribe(cb) {
    this.io.on("connection", (socket) => {
      const currentUser = '64c1cfeaa31842a90f817e88';
      
      socket.on("sendMessage", async (reciever, message) => {
        try {
          const chat = await ChatModule.find([currentUser, reciever]);
          
          cb({ chatId: chat._id, message })
        } catch (error) {
          console.log(error);
        }
      });
    });
  }

  /** 1.3.4. Функция «Получить историю сообщений чата»
   * @param {string} id 
   * @returns {ChatMessageModel[] | null}
   */
  static async getHistory(id) {
    const chat = await ChatModel.findById(id);

    return chat?.messages ?? null
  }
}

export default ChatModule;