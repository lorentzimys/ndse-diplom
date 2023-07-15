import mongoose, { Schema, ObjectId } from "mongoose";
import { UserModel } from "./User.js";

const AdvertisementSchema = new Schema({
  shortText: {
    type: String,
    required: true,
    unique: false,
  },
  description: {
    type: String,
    required: false,
    unique: false,
  },
  images: {
    type: [String],
    required: false,
    unique: false,
  },
  userId: {
    type: ObjectId,
    ref: UserModel,
    required: false, //true,
    unique: false,
  },
  createdAt: {
    type: Date,
    required: true,
    unique: false,
  },
  updatedAt: {
    type: Date,
    required: true,
    unique: false,
  },
  tags: {
    type: [String],
    required: false,
    unique: false,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    unique: false,
  },
});

export const AdvertisementModel = mongoose.model("Advertisement", AdvertisementSchema);