import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import AdvertisementModule from "./common/AdvertisementModule.js";

import { PORT, MONGO_URL } from "./config.js";
import fileUpload from "./middleware/file.js";

const API_PATHS = {
  SIGNUP: '/api/signup',
  SIGNIN: '/api/signin',
  GET_ADVERTISEMENTS: '/api/advertisements',
  GET_ADVERTISEMENT: '/api/advertisements/:id',
  CREATE_ADVERTISEMENT: '/api/advertisements',
  DELETE_ADVERTISEMENT: '/api/advertisements/:id',
};

const initMongoDb = async () => {
  try {
    await mongoose.connect(MONGO_URL, { dbName: "ndjs" });
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

const initApp = async () => {
  const app = express();

  // await initMongoDb();
  
  app.use(bodyParser.json()); 
  app.use(bodyParser.urlencoded({ extended: true }));
  
  app.use("/", (req, res, next) => {
    res.send("Hello world!");
    next();
  });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
  
  // Sign up
  app.post(API_PATHS.SIGNUP, (req, res, next) => {
    // const requestBody = {
    //   "email": "kulagin@netology.ru",
    //   "password": "ad service",
    //   "name": "Alex Kulagin",
    //   "contactPhone": "+7 123 456 78 90"
    // };
  
    if (err) {
      res.status(500).json({
        error: "email занят",
        status: "error",
      })
    }
  
    res.status(201).json({
      data: {
        id: "507f1f77bcf86cd799439011",
        email: "kulagin@netology.ru",
        name: "Alex Kulagin",
        contactPhone: "+7 123 456 78 90"
      },
      status: "ok",
    });
  });
  
  // Sign in
  app.post(API_PATHS.SIGNIN, (req, res, next) => {
    // const requestBody = {
    // "email": "kulagin@netology.ru",
    // "password": "ad service"
    // };
  
    if (err) {
      res.status(500).json({
        error: "Неверный логин или пароль",
        status: "error"
      });
    }
  
    res.status(200).json({
      data: {
        id: "507f1f77bcf86cd799439011",
        email: "kulagin@netology.ru",
        name: "Alex Kulagin",
        contactPhone: "+7 123 456 78 90"
      },
      status: "ok",
    });
  });
  
  // Get advertisement by id
  app.get(API_PATHS.GET_ADVERTISEMENT, async (req, res) => {
    const { id } = req.params;
  
    try {
      const ad = await AdvertisementModule.find({ userId: id });
      
      res.status(200).json({
        data: ad,
        status: "ok"
      });
    } catch (e) {
      res.status(404).json({
        error: "Объявление не найдено",
        status: "error"
      });
    }
  });
  
  // Create advertisement
  app.post(API_PATHS.CREATE_ADVERTISEMENT, fileUpload.array("images"), async (req, res, next) => {
    const images = Array.map(req.files, (file) => file.path) ?? []; 


    console.log(images);
    
    try {
      const newAd = await AdvertisementModule.create({
        ...req.body,
        images,
        userId
      });
      
      res.status(201).json(newAd);
    } catch (err) {
      res.status(500).json({
        error: err._message ?? "Ошибка сервера",
        status: "error"
      });
    }
  });
  
  // Get advertisements
  app.get(API_PATHS.GET_ADVERTISEMENTS, async (req, res, next) => {
    try {
      const ads = await AdvertisementModule.find({});

      console.log(ads);
      
      res.status(200).json(ads);
    } catch (err) {
      res.status(500).json({
        error: "Ошибка сервера",
        status: "error"
      });
    }
  
  });
};

initApp();
