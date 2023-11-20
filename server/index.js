const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//const controller = require("./Controller.js");
const path = require("path");
const localcontroller = require("../database/controller/controllers.js")
const { connectDB } = require("../database/index.js");
const cookieParser = require('cookie-parser');

const PORT = 3000;

connectDB();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use((req, res, next) => {
  console.log('serving: ', req.method, req.path, req.query);
  next();
})
app.use(cookieParser());



//create new user
app.post("/users/register", (req, res) => {
  localcontroller.register(req,res);
});

//login check user password correct
app.get("/users/login", (req, res) => {
  localcontroller.login(req,res);
});

app.get("/users/me", (req, res) => {
  localcontroller.getUser(req,res);
})

app.get("/products", (req, res) => {
  localcontroller.getProducts(req,res);
});

app.get("/products/details/:productId", (req, res) => {
  localcontroller.getProduct(req,res);
});

app.get("/products/brand/:brandId", (req, res) => {
  localcontroller.getProductsByBrand(req,res);
});

app.post('/users/:userId/favorites/add', (req, res) => {
  localcontroller.addProductsToFavorite(req,res);
});

app.post('/users/:userId/favorites/remove', (req, res) => {
  localcontroller.removeProductsFromFavorite(req,res);
});

app.get('/admin/users', (req, res) => {
  localcontroller.getAllUsers(req,res);
});

app.get('/users/:userId/favorites/check/:productId', (req, res) => {
  localcontroller.checkFavorite(req,res);
});

app.post('/users/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

app.get('/users/:userId/favorites', (req, res) => {
  localcontroller.getUserFavorites(req, res);
});


app.listen(PORT, () => {console.log(`Server is listening at http://localhost:${PORT}`);});
