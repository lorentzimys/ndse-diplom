import { Router } from 'express';
import crypto from "crypto";
import passport from "passport";
import UserModule from "../modules/User.js"
import { API_PATHS } from '../api.js';

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

// Get current user
const getCurrentUser = (req, res) => {
  res.status(200).json({
    data: req.user,
    status: "ok",
  });
}

const authRouter = Router();

authRouter.post(API_PATHS.SIGNUP, signUp);
authRouter.post(API_PATHS.SIGNIN, signIn);
authRouter.get(API_PATHS.CURRENT_USER, getCurrentUser);

export default authRouter;