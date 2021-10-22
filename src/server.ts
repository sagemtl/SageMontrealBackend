import express from 'express';
import cors, { CorsOptions } from 'cors';

// Import Routes
import products_routes from './routes/products';
import orders_routes from './routes/orders';
import ktv_routes from './routes/ktv';
import mailer_routes from './routes/mailer';
import post_its_routes from './routes/postIts'

const app = express();
import "dotenv/config";

const options: CorsOptions = {
  methods: 'GET,POST,OPTIONS,PUT,PATCH,DELETE',
  origin: process.env.NODE_ENV === 'production' ? /\.sagemontreal\.com$/: '*',
  optionsSuccessStatus: 200,
};

// Middlewares
app.use(express.json({limit: "5mb"}));
app.use(cors(options));

// Routes Middleware
app.use('/products', products_routes);
app.use('/orders', orders_routes);
app.use('/ktv', ktv_routes);
app.use('/mailer', mailer_routes);
app.use('/post-it', post_its_routes);

// PORT, Listen
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App running on PORT ${port}`));