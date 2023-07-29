import passport from "passport";
import crypto from "crypto";
import LocalStrategy from "passport-local";
import { UserModel } from '../models/User.js';
import sessionMiddleware from "../middleware/session.js";

// Passport Local Strategy verification function 
const verifyFn = async function (email, password, cb) {
  try {
    const user = await UserModule.findByEmail(email);

    if (!user) {
      return cb(null, false,  {
        error: "Неверный логин или пароль",
        status: "error",
      });
    }

    const hashedPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
    
    if (hashedPassword !== user.passwordHash) {
      return cb(null, false, {
        error: "Неверный логин или пароль",
        status: "error",
      });
    }

    return cb(null, user);
  } catch (err) {
    return cb(err, null, {
      error: err.message,
      status: "error", 
    })
  }
};

const serializeToSession = function (user, cb) {
  cb(null, { id: user._id, email: user.email });
}

const deserializeFromSession = async function (data, cb) {
  try {
    const user = await UserModule.findByEmail(data.email);

    cb(null, {
      id: user.id,
      email: user.email,
      name: user.name ?? undefined,
      contactPhone: user.contactPhone ?? undefined,
    });

  } catch (err) {
    return cb(err, null);
  }
};

class UserModule {
    // Config
  static strategyCfg = {
    usernameField: 'email',
    passwordField: 'password',
  };

  static prepareAuth(app) {
    const authStrategy = new LocalStrategy(
      UserModule.strategyCfg,
      verifyFn
    );

    app.use(sessionMiddleware);
    app.use(passport.initialize()) 
    app.use(passport.session());

    passport.use(authStrategy);
    passport.serializeUser(serializeToSession);
    passport.deserializeUser(deserializeFromSession);
  }

  static async create({ email, passwordHash, name, contactPhone }) {
    const createdUser = await new UserModel({
      email,
      passwordHash,
      name,
      contactPhone
    });

    return createdUser.save();
  }

  static async findByEmail(email) {
    return await UserModel.findOne({ email });
  }
}

export default UserModule;