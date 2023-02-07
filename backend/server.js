import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import path from 'path';
import { ConnectDB } from './config/db.js';
//import cors from "cors";
import productRoutes from './routers/products.js';
import userRoutes from './routers/users.js';
import orderRoutes from './routers/orders.js';
import uploadRoutes from './routers/uploads.js';
import { ErrorHandler, NotFoundHandler } from './middlewares/errorHandler.js';

dotenv.config();

ConnectDB();

const app = express();

app.use(morgan('tiny'));
app.use(express.json()); // To accept json body
//app.use(cors());

app.get('/api', (req, res) => {
  res.statusCode = 200;
  res.json({ message: 'Api is working' });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);

const __dirname = path.resolve();

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(NotFoundHandler);
app.use(ErrorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(
    `Application is running in ${process.env.NODE_MODE} Mode at port ${port}.`
      .bgGreen.white
  );
});
