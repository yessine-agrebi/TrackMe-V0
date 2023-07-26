import express from "express";
import { initializeMqtt } from "./config/brokerConnection.js";
import dotenv from "dotenv";
import { dbConnection } from "./config/DB.js";
import cors from "cors";
import cookieParser from "cookie-parser";
//routes imports
import authRouter from "./routes/auth.routes.js";
import usersRouter from "./routes/users.routes.js";
import devicesRouter from "./routes/devices.routes.js";
import historyRouter from "./routes/history.routes.js";
import carsRouter from "./routes/cars.routes.js";
import { Server } from "socket.io";
import { createServer } from "http";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Connect to MongoDB
dbConnection();
//initializeMqtt();
// Create HTTP server
const server = createServer(app);

// Initialize Socket.io server
const io = new Server(server);
// Inside the io.on('connection', ...) block
io.on("connection", (socket) => {
  console.log("A client connected");

  // Example: Send a message to the client
  socket.emit("message", "Hello from server");

  // Example: Receive a message from the client
  socket.on("clientMessage", (data) => {
    console.log("Received message from client:", data);
  });

  // Handle other events as needed
});

//Routes
app.use("/api/v0/auth", authRouter);
app.use("/api/v0/users", usersRouter);
app.use("/api/v0/devices", devicesRouter);
app.use("/api/v0/history", historyRouter);
app.use("/api/v0/cars", carsRouter);

server.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
  console.log(`worker pid = ${process.pid}`);
});

