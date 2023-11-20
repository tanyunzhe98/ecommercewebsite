const model = require('../models/model.js');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const login = (req, res) => {
  const authHeader = req.headers.authorization;
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [usernameOrEmail, password] = credentials.split(':');
  //console.log(username);
  model.User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
  })
      .then(user => {
      if (!user) {
        // 如果用户名不存在，返回错误信息
        res.status(401).send('Your username does not exist' );
      }
      // 使用实例方法 comparePassword 验证用户密码
      user.comparePassword(password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          // 用户验证成功，生成 JWT
          const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1d' });
          // 设置带有 JWT 的 cookie
          res.cookie('token', token, { httpOnly: true, secure: true });
          // 如果密码匹配，返回用户信息
          res.status(200).send(user);
        } else {
          // 如果密码不匹配，返回错误信息
          res.status(401).send('Your password is not correct');
        }
      });
    })
    .catch(err => {
      throw err;
    });
};


const register = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // 检查邮箱是否已经存在
    const existingUser = await model.User.findOne({ email });
    if (existingUser) {
      return res.status(409).send('Email already exists');
    }

    // 创建新用户
    const user = new model.User({ username, password, email });

    // 保存新用户
    await user.save();

  // 用户注册成功，生成 JWT
  const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1d' });

  // 设置带有 JWT 的 cookie
  res.cookie('token', token, { httpOnly: true, secure: true });

    res.status(201).send(user);
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).send('Username already exists');
    } else {
      res.status(500).send('An error occurred while saving user');
    }
  }
};

const getUser = async (req, res) => {
  const token = req.cookies['token'];
  //console.log("token:", token)
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, 'yourSecretKey');
    const user = await model.User.findById(decoded.userId);
    res.json(user);
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
}


const getProducts = async (req, res) => {
  try {
    const { page = 1, brand, type } = req.query;
    const limit = 9; // 每页显示的产品数量
    const skip = (page - 1) * limit;

    // 构建查询条件
    let query = {};
    if (brand) query.brand = brand;
    if (type) query.type = type;

    // 查询数据库
    const products = await model.Product.find(query)
                                         .populate('brand')
                                         .skip(skip)
                                         .limit(limit);

    res.status(200).json(products);
  } catch (err) {
    res.status(500).send('Error retrieving products: ' + err.message);
  }
};


const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await model.Product.findById(productId).populate('brand');

    if (!product) {
      res.status(404).send('Product not found');
    } else {
      res.status(200).json(product);
    }
  } catch (err) {
    res.status(500).send('Error retrieving product: ' + err.message);
  }
};

const getProductsByBrand = async (req, res) => {
  try {
    const { brandId } = req.params; // 获取品牌ID

    // 查找同一品牌的所有产品
    const products = await model.Product.find({ brand: brandId }).populate('brand');

    if (!products) {
      res.status(404).send('No products found for this brand');
    } else {
      res.status(200).json(products);
    }
  } catch (err) {
    res.status(500).send('Error retrieving products: ' + err.message);
  }
};

const checkFavorite = async (req, res) => {
  const { userId, productId } = req.params;
  //console.log("userId:", userId);
  // console.log("productId:", productId);

  try {
    const user = await model.User.findById(userId);
    // console.log("user:", user);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const isFavorite = user.favorites.includes(productId);
    res.status(200).json({ isFavorite });
  } catch (error) {
    res.status(500).send('Error checking favorite status: ' + error.message);
  }
};

const addProductsToFavorite = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  //console.log('userid is:', userId)

  try {
    const user = await model.User.findById(userId);
    //console.log('user is:', user)
    if (!user) {
      return res.status(404).send('User not found');
    }

    // 添加产品到收藏列表，避免重复
    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send('Error adding favorite: ' + error.message);
  }
};

const removeProductsFromFavorite = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;

  try {
    const user = await model.User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const index = user.favorites.indexOf(productId);
    if (index > -1) {
      user.favorites.splice(index, 1); // 移除收藏
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send('Error removing favorite: ' + error.message);
  }
};

const getUserFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await model.User.findById(userId)
                                 .populate({
                                   path: 'favorites',
                                   select: 'name image _id' // Selecting name, image, and _id of products
                                 });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Extracting necessary product details
    const favorites = user.favorites.map(product => ({
      name: product.name,
      image: product.image,
      productId: product._id
    }));

    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).send('Error retrieving user favorites: ' + error.message);
  }
};



const getAllUsers = async (req, res) => {
  try {
    // 查找所有用户并填充收藏列表的产品名称
    const users = await model.User.find({})
                                 .select('-password') // 不包含密码
                                 .populate({
                                   path: 'favorites',
                                   select: 'name' // 只选取产品的名称
                                 });

    // 将用户转换为普通对象并发送
    const usersWithFavoriteNames = users.map(user => {
      const userObj = user.toObject();
      userObj.favorites = userObj.favorites.map(fav => fav.name); // 提取产品名称
      return userObj;
    });

    res.status(200).json(usersWithFavoriteNames);
  } catch (error) {
    res.status(500).send('Error retrieving users: ' + error.message);
  }
};





module.exports = {login, register, getProducts, getProduct, getUser, getProductsByBrand, checkFavorite, addProductsToFavorite, removeProductsFromFavorite, getUserFavorites, getAllUsers};
