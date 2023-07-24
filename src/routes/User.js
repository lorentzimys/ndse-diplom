import { Router } from 'express';
import crypto from "crypto";

import passport from "passport";
import LocalStrategy from "passport-local";

import UserModule from "../modules/User.js"
import { API_PATHS } from '../api.js';

// Config
const strategyCfg = {
  usernameField: 'email',
  passwordField: 'password',
};

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

// Sign up
const signUp = async function (req, res, next) {
  try {
    const { email, password, name, contactPhone } = req.body;
    const userExists = !!(await UserModule.findByEmail(email));

    if (userExists) {
      return res.status(409).json({
        error: "Пользователь с таким email уже существует",
        status: "error"
      });
    }

    const newUser = await UserModule.create({
      email,
      passwordHash: crypto.createHash('sha256').update(password).digest('hex'),
      name,
      contactPhone,
    });

    const data = newUser.toObject({
      transform: (_, ret, options) => {
        const { _id, passwordHash,  ...rest } = ret;
        
        return { id: _id, ...rest };
      },
      versionKey: false,
    });

    return res.status(201).json({ data, status: "ok" });
  } catch (err) {
    return res.status(500).json({
      error: err.message ?? "Ошибка сервера",
      status: "error"
    });
  }
};

// Sign in
const signIn = function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }

    if (!user) {
      return res.status(401).json(info);
    }

    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.status(200).json({
        status: "ok",
        data: {
          id: user._id,
          email: user.email,
          name: user.name ?? undefined,
          contactPhone: user.contactPhone ?? undefined,
        },
      });
    });
  })(req, res, next);
};

const authRouter = Router();
const authStrategy = new LocalStrategy(strategyCfg, verifyFn);

passport.use(authStrategy);
passport.serializeUser(serializeToSession);
passport.deserializeUser(deserializeFromSession);

authRouter.post(API_PATHS.SIGNUP, signUp);
authRouter.post(API_PATHS.SIGNIN, signIn);
authRouter.get('/currentUser', (req, res) => {
  console.log(req.user);
  res.json(req.user);
});

export default authRouter;