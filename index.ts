import 'dotenv/config';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import todoRouter from './src/routes/todos.route';
import { errorHandler } from './src/middlewares/error-handler';
import morgan from 'morgan';
import logger from './src/utils/error.logger';
import coros from 'cors';

const app = express();

app.use(express.json());
app.use(coros());
app.use(
  morgan("tiny", {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);
app.use('/todos', todoRouter);
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world from Typescript');
});

mongoose.connect(process.env.MONGODB_URI ?? '')
    .then(() => {
        console.log('✅ Connected to local MongoDB');
        app.listen(process.env.PORT, () => {
            console.log(`Server is running at http://localhost:${process.env.PORT}`);
        });
    })
    .catch(error => {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    });
