import express from 'express';
import { routes } from './routes';
import cors from 'cors';

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(routes);

app.use(cors());

app.listen(port, () => console.log(`🚀 server running on ${port}`));