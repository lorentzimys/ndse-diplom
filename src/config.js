import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 80;

/* Mongo */
export const MONGO_URL = process.env.MONGO_URL;