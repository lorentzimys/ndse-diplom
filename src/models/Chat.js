import mongoose, { Schema, ObjectId } from "mongoose";

import { UserModel } from "../models/User.js";

const ChatMessageSchema = new Schema({
  author: {
    type: ObjectId,
    ref: UserModel,
    required: true,
    unique: false,
  },
  sentAt: {
    type: Date,
    required: true,
    unique: false,
    default: Date.now,
    set: (val) => new Date(val),
  },
  text: {
    type: String,
    required: true,
    unique: false,
  },
  readAt: {
    type: Date,
    required: false,
    unique: false,
  },
});

const ChatSchema = new Schema({
  users: {
    type: [ObjectId],
    ref: UserModel,
    required: true,
    unique: false,
  },
  createdAt: {
    type: Date,
    required: true,
    unique: false,
  },
  messages: {
    type: [ChatMessageSchema],
    required: false,
    unique: false,
  },
});



export const ChatModel = mongoose.model("Chat", ChatSchema);
export const ChatMessageModel = mongoose.model("ChatMessage", ChatMessageSchema);
