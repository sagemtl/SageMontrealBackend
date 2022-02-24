import express from 'express';
import cors, { CorsOptions } from 'cors';

// Import Routes
import products_routes from './routes/products';
import orders_routes from './routes/orders';
import ktv_routes from './routes/ktv';
import mailer_routes from './routes/mailer';
import post_its_routes from './routes/postIts';

const app = express();
import 'dotenv/config';

const allowedOrigins = [
  'http://localhost:3000',
  'https://samcha.sageismism.com',
  'https://www.sageismism.com',
  'https://playground.sageismism.com',
  'https://ktv.sageismism.com',
];

const options: CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: allowedOrigins,
  preflightContinue: false,
};

// Middlewares
app.use(cors(options));
app.use(express.json({ limit: '5mb' }));

// Routes Middleware
app.use('/products', products_routes);
app.use('/orders', orders_routes);
app.use('/ktv', ktv_routes);
app.use('/mailer', mailer_routes);
app.use('/post-it', post_its_routes);

// PORT, Listen
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App running on PORT ${port}`));
