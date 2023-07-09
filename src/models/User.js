import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
    unique: false,
  },
  name: {
    type: String,
    required: true,
    unique: false,
  },
  contactPhone: {
    type: String,
    required: false,
    unique: false,
  }
});

export const UserModel = mongoose.model("User", UserSchema);