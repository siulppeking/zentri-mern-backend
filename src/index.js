require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const connectDB = require('./db');
const authRouter = require('./routers/auth.router');
const taskRouter = require('./routers/task.router');

const app = express();

const isProd = process.env.NODE_ENV === 'prod';

app.use(cors({
    origin: isProd ? 'https://zentri-mern.netlify.app' : 'http://localhost:5173',
    credentials: true,
}));

app.use(cookieParser());

app.use(express.json());

app.use(morgan('dev'));

app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Server is running on port: ${PORT}`);
    await connectDB();
});