import { Router } from 'express';
import { API_PATHS } from '../api.js';

const openChat = function (req, res, next) {
  const { id: chatId } = req.params;

  res.render('./chat', { chatId });
};

const chatRouter = Router();

chatRouter.get(API_PATHS.USERS_CHAT, openChat);

export default chatRouter;