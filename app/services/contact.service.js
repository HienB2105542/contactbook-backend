const {ObjectId} = require('mongodb');

class ContactService {
  constructor(client) {
    this.Contact = client.db().collection('contacts');
  }

  // Định nghĩa các phương thức truy xuất CSDL sử dụng MongoDB API
  extractContactData(payload) {
    const contact = {
      name: payload.name,
      email: payload.email,
      address: payload.address,
      phone: payload.phone,
      favorite: payload.favorite,
    };

    // Loại bỏ các trường undefined
    Object.keys(contact).forEach(
        (key) => contact[key] === undefined && delete contact[key]);
    return contact;
  }

  // Lấy tất cả các liên hệ
  async getAllContacts() {
    try {
      const contacts =
          await this.Contact.find().toArray();  // Chuyển kết quả thành mảng
      return contacts;
    } catch (error) {
      throw new Error('Unable to fetch contacts');
    }
  }

  // Tạo mới hoặc cập nhật liên hệ
  async create(payload) {
    const contact = this.extractContactData(payload);
    const result =
        await this.Contact.insertOne(contact);  // Dùng insertOne để tạo mới
    return result;
  }

  // Tìm kiếm liên hệ theo điều kiện
  async find(filter) {
    const cursor = await this.Contact.find(filter);
    return await cursor.toArray();
  }

  // Tìm liên hệ theo tên
  async findByName(name) {
    return await this.find({
      name: {$regex: new RegExp(name, 'i')},  // Sửa regex để dùng đúng cách
    });
  }

  // Tìm liên hệ theo ID
  async findById(id) {
    return await this.Contact.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // Cập nhật liên hệ theo ID
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractContactData(payload);
    const result = await this.Contact.findOneAndUpdate(
        filter, {$set: update}, {returnDocument: 'after'}
        // Chữ thường cho 'returnDocument'
    );
    return result.value;
  }

  // Xóa liên hệ theo ID
  async delete(id) {
    const result = await this.Contact.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  // Tìm liên hệ yêu thích
  async findFavorite() {
    return await this.find({favorite: true});
  }

  // Xóa tất cả liên hệ
  async deleteAll() {
    const result = await this.Contact.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = ContactService;
