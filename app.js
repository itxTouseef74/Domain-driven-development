const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./shared/infrastructure/Database'); 
const productRoutes = require('./products/api/ProductController');
const customerRoutes = require('./customer/api/CustomerController');
const cartRoutes = require('./shopping/api/CartController');
const AuthController = require('./customer/api/AuthController')
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


connectDB();

// Routes

app.use('/products', productRoutes);
app.use('/customers', customerRoutes);
app.use('/carts', cartRoutes);
app.use('/auth', AuthController)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
