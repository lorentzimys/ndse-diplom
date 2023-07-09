import { UserModel } from '../models/User.js';

class UserModule {
  constructor () {
    this.model = UserModel;
  }

  create({ email, passwordHash, name, contactPhone }) {
    if (typeof email !== 'string') throw new Error('Аргумент email должен быть строкой.')
    if (typeof passwordHash !== 'string') throw new Error('Аргумент passwordHash должен быть строкой.')
    if (typeof name !== 'string') throw new Error('Аргумент name должен быть строкой.')
    
    if (typeof contactPhone !== 'string') throw new Error('Аргумент contactPhone должен быть строкой.')    

    return new Promise((resolve, reject) => {
      const createdUser = new this.model({
        email,
        passwordHash,
        name,
        contactPhone
      });
  
      resolve(createdUser.save());
    });
  }

  findByEmail(email) {
    return new Promise((resolve, reject) => {
      if (typeof email !== 'string') {
        reject('Аргумент email должен быть строкой.')
      }
      this.model.find({ email }, (err, res) => {
        if (err) reject(err);

        resolve(res);
      });
    });
  }
}

export default UserModule;