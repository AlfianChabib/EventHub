import express, { json, urlencoded } from 'express';
import cors from 'cors';
import apiRouter from './common/router/api.router';
import cookieParser from 'cookie-parser';
import { PORT } from './config';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-HTTP-Method-Override',
    ],
  }),
);
app.use(json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
});
