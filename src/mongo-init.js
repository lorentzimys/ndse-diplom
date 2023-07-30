import dotenv from "dotenv";
import { resolve } from 'path';

dotenv.config({
  path: resolve(process.cwd(), '.env'),
});

db.auth(process.env.MONGO_USERNAME, process.env.MONGO_PASSWORD);

db = db.getSiblingDB('ndjs')

// db.createUser({
//   user: 'test-user',
//   pwd: 'test-password',
//   roles: [
//     {
//       role: 'root',
//       db: 'test-database',
//     },
//   ],
// });