const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

// 加密用户密码
UserSchema.pre('save', function (next) {
  const user = this;

  // 只在密码有修改或新建用户时执行
  if (!user.isModified('password')) return next();

  // 生成盐值并使用盐值加密密码
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

// 验证用户密码
UserSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

const User = mongoose.model('User', UserSchema);

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  type: { type: String },
});

const Product = mongoose.model('Product', ProductSchema);

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

const Brand = mongoose.model('Brand', BrandSchema);

// Modify UserSchema to include favorites
UserSchema.add({
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});






module.exports = { User, Product, Brand };
