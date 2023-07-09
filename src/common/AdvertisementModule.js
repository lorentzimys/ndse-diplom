import { AdvertisementModel } from '../models/Advertisement.js';

const find = async ({ shortText, description, userId, tags }) => {
  try {
    const queryParams = {
      shortText: shortText ? new RegExp(shortText) : undefined,
      description: description ? new RegExp(description) : undefined,
      userId: userId ? userId : undefined,
      tags: tags ? tags : undefined,
    };
  
    const query = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== undefined)
    )

    const ad = await AdvertisementModel.find(query);

    return ad;
  } catch (err) {
    console.log(err);
  }
}

const create = async (data) => {
  return new AdvertisementModel(data).save();
}

const remove = async (id) => {
  try {
    await AdvertisementModel.findByIdAndRemove(id);
  } catch (err) {
    console.log(err);
  }
}

export default {
  find,
  create,
  remove,
};