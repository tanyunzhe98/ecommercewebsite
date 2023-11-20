const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { User, Product, Brand } = require('./models/model');

function connectDB() {
  mongoose.connect('mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to MongoDB');
    insertInitialData();
  }).catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

  const db = mongoose.connection;

  db.on('error', () => {
    console.log('mongoose connection error');
  });

  db.once('open', () => {
    console.log('mongoose connected successfully');
  });

  const store = MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/ecommerce',
    collection: 'sessions'
  });

  return db;
}


function insertInitialData() {
  // 插入用户数据（保持不变）
  User.estimatedDocumentCount().then(count => {
    if (count === 0) {
      User.create([
        { username: "Alice", password: "password123", email: "alice@example.com", isAdmin: true },
        { username: "Bob", password: "password456", email: "bob@example.com" },
        // 更多用户...
      ]).then(() => console.log("Initial users created"))
        .catch(err => console.error("Error creating initial users", err));
    }
  });

  // 插入品牌和产品数据
  Brand.estimatedDocumentCount().then(count => {
    if (count === 0) {
      // 品牌名称
      const brandNames = ['BrandA', 'BrandB', 'BrandC', 'BrandD', 'BrandE'];
      const productTypes = ['Type1', 'Type2', 'Type3'];

      brandNames.forEach((brandName, brandIndex) => {
        Brand.create({ name: brandName }).then(brand => {
          const productPromises = [];

          for (let i = 0; i < 6; i++) { // 每个品牌6个产品
            const productType = productTypes[i % productTypes.length];
            const newProduct = new Product({
              name: `Product ${brand.name} ${i + 1}`,
              brand: brand._id,
              price: Math.floor(Math.random() * 100) + 1,
              type: productType,
              description: `Description for ${productType} product ${i + 1}`,
              image: `https://source.unsplash.com/random/200x200?sig=${brandIndex}${i}`
            });

            productPromises.push(newProduct.save().then(product => {
              console.log(`Product ${product.name} created`);
              brand.products.push(product._id);
            }));
          }

          Promise.all(productPromises).then(() => {
            brand.save().then(() => console.log(`Brand ${brand.name} and its products created`));
          });
        }).catch(err => console.error("Error creating brand or product", err));
      });
    }
  });
}



module.exports = { connectDB };
