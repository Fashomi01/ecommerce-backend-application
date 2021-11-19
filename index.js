const express = require("express");
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//routers import
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");

//Middleware
app.use(express.json());

//routers
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/cart', cartRoutes);

mongoose.connect(process.env.MONGODB, () => console.log('Connected to db'))

app.listen(port, () => {
    console.log("The server is running now!");
  });