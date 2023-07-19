import express from "express";
import { initializeMqtt } from "./config/brokerConnection.js";
import dotenv from "dotenv";
import {dbConnection} from "./config/DB.js";
import cors from "cors";
import cookieParser from "cookie-parser";
//routes imports
import authRouter from './routes/auth.routes.js'
import usersRouter from './routes/users.routes.js'
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Connect to MongoDB
dbConnection();
initializeMqtt();
//Routes
app.use('/api/v0/auth', authRouter)
app.use('/api/v0/users', usersRouter)
app.listen(process.env.APP_PORT, () =>
  console.log(`Server running on port ${process.env.APP_PORT}`)
);