import MongoStore from "connect-mongo";
import session from "express-session";

import { MONGO_URL } from "../config.js";

const expressSession = session({
  secret: 'top secret',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  store: MongoStore.create({
    mongoUrl: MONGO_URL,
    dbName: "ndjs",
    collectionName: "sessions",
  })
});

export default expressSession;