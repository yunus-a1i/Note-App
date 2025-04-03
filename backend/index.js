import express from "express";
import AuthRoute from './routes/auth.js';
import TodoRoute from './routes/todo.js';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();
const PORT = 3000;

dotenv.config();

app.use(
    cors({
      origin: [
        "http://localhost:5173", // Local development
        "https://note-app-eight-plum.vercel.app", // Vercel deployed frontend
      ],
      credentials: true, // Allow cookies/auth headers
      methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
      allowedHeaders: "Content-Type,Authorization", // Allowed headers
    })
  );

// Handle preflight requests
app.options('*', cors());

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/user', AuthRoute);
app.use('/api/todos', TodoRoute);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({ error: message });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
