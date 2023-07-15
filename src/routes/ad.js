import { Router } from 'express';
import fileUpload from "../middleware/file.js";

import { API_PATHS } from '../api.js';
import AdvertisementModule from "../common/AdvertisementModule.js";

const authRouter = Router();

// Get advertisement by id
authRouter.get(API_PATHS.GET_ADVERTISEMENT, async (req, res) => {
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
authRouter.post(API_PATHS.CREATE_ADVERTISEMENT, fileUpload.array("images"), async (req, res, next) => {
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
authRouter.get(API_PATHS.GET_ADVERTISEMENTS, async (req, res, next) => {
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

export default authRouter