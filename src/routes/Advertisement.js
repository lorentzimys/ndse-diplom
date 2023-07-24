import { Router } from 'express';

import { API_PATHS } from '../api.js';
import fileUpload from "../middleware/file.js";
import checkAuth from "../middleware/checkAuth.js";
import AdvertisementModule from "../modules/Advertisement.js";
import { AdvertisementModel } from '../models/Advertisement.js';
import checkIsCurrentUser from '../middleware/checkIsCurrentUser.js';

const adRouter = Router();

// Get advertisement by id
const getAd = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await AdvertisementModel.findById(id).populate("userId").exec();
    const data = {
      id: ad._id,
      shortTitle: ad.shortText,
      description: ad.description,
      images: ad.images,
      user: {
        id: ad.userId._id,
        name: ad.userId.name,
      },
      createdAt: ad.createdAt,
    }

    if (!ad) {
      res.status(404).json({
        error: "Объявление не найдено",
        status: "error"
      });
    }
    
    res.status(200).json({ data, status: "ok" });
  } catch (e) {
    res.status(500).json({
      error: "Ошибка сервера",
      status: "error"
    });
  }
};

// Get advertisements
const getAllAds = async (req, res) => {
  try {
    const ads = await AdvertisementModel.find({}).populate('userId').exec();

    const data = ads.map(ad => ({
      id: ad._id,
      shortTitle: ad.shortText,
      description: ad.description,
      images: ad.images,
      user: {
        id: ad.userId._id,
        name: ad.userId.name,
      },
      createdAt: ad.createdAt,
    }))

    res.status(200).json({
      data,
      status: "ok"
    });
  } catch (err) {
    res.status(500).json({
      error: err._message ?? "Ошибка сервера",
      status: "error"
    });
  }
}

// Delete advertisement
const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAd = await AdvertisementModule.remove(id);

    res.status(204);
  } catch (err) {
    res.status(500).json({
      error: err._message ?? "Ошибка сервера",
      status: "error"
    });
  }
}

// Create advertisement
const createAd = async (req, res, next) => {
  try {
    const { shortTitle, description, tags } = req.body;

    const images = req?.files?.map(({ path }) => path) ?? [];
    const userId = req.user.id;

    const newAd = await AdvertisementModule.create({
      shortText: shortTitle,
      description,
      userId,
      images,
      tags,
    });

    const data = {
      id: newAd._id,
      shortTitle: newAd.shortText,
      description: newAd.description,
      images: newAd.images,
      user: {
        id: req.user.id,
        name: req.user.name,
      },
      createdAt: newAd.createdAt,
    };
    
    res.status(201).json({
      data,
      status: "ok"
    });
  } catch (err) {
    res.status(500).json({
      error: err._message ?? "Ошибка сервера",
      status: "error"
    });
  }
};

adRouter.get(API_PATHS.GET_ADVERTISEMENT, getAd);
adRouter.delete(API_PATHS.DELETE_ADVERTISEMENT, checkAuth, checkIsCurrentUser, deleteAd);
adRouter.post(API_PATHS.CREATE_ADVERTISEMENT, checkAuth, fileUpload.array("images"), createAd);
adRouter.get(API_PATHS.GET_ADVERTISEMENTS, getAllAds);

export default adRouter;