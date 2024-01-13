import express, { json, urlencoded } from 'express';
import cors from 'cors';
import apiRouter from './common/router/api.router';
import { PORT } from './config';

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
});
