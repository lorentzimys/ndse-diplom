import dotenv from "dotenv";
import { resolve } from 'path';

dotenv.config({
  path: resolve(process.cwd(), '.env'),
});

/* Main app */
const DEFAULT_PORT = 80;

export const ENCODING = "utf8";

export const HOST = process.env.HOST || "localhost";

export const PORT = process.env.HTTP_PORT || DEFAULT_PORT;

/* Mongo */
const DEFAULT_MONGO_PORT = 27017;

export const MONGO_HOST = process.env.MONGO_HOST || HOST;

export const MONGO_PORT = process.env.MONGO_PORT || DEFAULT_MONGO_PORT;

export const MONGO_URL = process.env.MONGO_URL || `mongodb://root:qwerty@${MONGO_HOST}:${MONGO_PORT}`;
