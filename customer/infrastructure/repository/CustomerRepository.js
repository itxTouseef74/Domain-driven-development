const UserModel = require("../Models/UserModel");

class CustomerRepository {
  async create(user) {
    const userDoc = new UserModel({
      name: user.name,
      email: user.email,
    });
    await userDoc.save();
    return userDoc;
  }

  async findById(id) {
    return await UserModel.findById(id);
  }

  async updateEmail(id, newEmail) {
    return await UserModel.findByIdAndUpdate(id, { email: newEmail }, { new: true });
  }

  async delete(id) {
    return await UserModel.deleteOne({ _id: id });
  }

  async listAll() {
    return await UserModel.find();
  }
}

module.exports = CustomerRepository;
