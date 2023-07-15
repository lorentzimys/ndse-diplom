import { UserModel } from '../models/User.js';

class UserModule {
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