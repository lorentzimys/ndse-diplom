import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config({
  path: dirname(fileURLToPath(import.meta.url))
});

export const PORT = process.env.PORT || 80;

/* Mongo */
export const MONGO_URL = process.env.MONGO_URL;
