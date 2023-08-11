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
import {
  fetchRealTimePosition,
  setSocket,
} from "./services/devices.service.js";
import { Server } from "socket.io";
import { createServer } from "http";
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: "prod.env" });
} else {
  dotenv.config({ path: "dev.env" });
}

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://trackme-front.onrender.com"],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);
app.use(cookieParser());

// Connect to MongoDB
dbConnection();
//initializeMqtt();
// Create HTTP server
const server = createServer(app);

// Initialize Socket.io server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://trackme-front.onrender.com"],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A new client connected");
  let interval;
  socket.on("getInitialPosition", (data) => {
    const emitRealTimePosition = () => {
      fetchRealTimePosition(data)
        .then((position) => {
          socket.emit("positionUpdate", position);
          console.log(position);
        })
        .catch((error) => {
          console.error("Error fetching position:", error);
        });
    };
    emitRealTimePosition();
    interval = setInterval(emitRealTimePosition, 10000);
  });
  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("Client disconnected");
  });
});

export const emitEvent = (eventName, data) => {
  io.emit(eventName, data);
};

setSocket(io);
app.get("/", (req, res) => {
  res.send("Welcome to track me api service");
});
//Routes
app.use("/api/v0/auth", authRouter);
app.use("/api/v0/users", usersRouter);
app.use("/api/v0/devices", devicesRouter);
app.use("/api/v0/history", historyRouter);
app.use("/api/v0/cars", carsRouter);

server.listen(0, () => {
  const allocatedPort = server.address().port;
  console.log(`Server is running on port ${allocatedPort}`);
});
