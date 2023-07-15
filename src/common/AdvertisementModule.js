import { AdvertisementModel } from '../models/Advertisement.js';

class AdvertisementModule {
  static async find({ shortText, description, userId, tags }) {
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
  
  static async create(data) {
    return new AdvertisementModel(data).save();
  }
  
  static async remove(id) {
    try {
      await AdvertisementModel.findByIdAndRemove(id);
    } catch (err) {
      console.log(err);
    }
  }
}

export default AdvertisementModule;