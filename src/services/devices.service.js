import axios from "axios";
import AsyncHandler from "express-async-handler";
import _ from "lodash";
import ApiError from "../utils/apiError.js";
import User from "../model/usersModel.js";
import Device from "../model/deviceModel.js";
import { emitEvent } from "../index.js";

// users.service.js

let socket;

function setSocket(io) {
  socket = io;
}



const getAllDevices = AsyncHandler(async (req, res) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `FlespiToken ${process.env.FLESPITOKEN}`,
  };

  try {
    const response = await axios.get(`${process.env.ENDPOINT}/gw/devices/all`, {
      headers,
    });
    const devices = response.data.result;
    res.json(devices);
  } catch (error) {
    console.error("Error while fetching devices:", error);
  }
});

const getDeviceById = AsyncHandler(async (req, res) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `FlespiToken ${process.env.FLESPITOKEN}`,
  };
  try {
    const response = await axios.get(
      `${process.env.ENDPOINT}/gw/devices/${req.params.id}`,
      { headers }
    );
    const device = response.data.result;
    res.json(device);
  } catch (error) {
    console.error("Error while fetching devices:", error);
  }
});

const addDevice = AsyncHandler(async (req, res, next) => {
  const { user } = req.body[0];
  delete req.body[0].user;
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `FlespiToken ${process.env.FLESPITOKEN}`,
    };
    const clonedData = _.cloneDeep(req.body);
    const response = await axios.post(
      `${process.env.ENDPOINT}/gw/devices`,
      clonedData,
      {
        headers,
      }
    );
    const searchedUser = await User.findById(user);
    console.log(searchedUser);
    if (!searchedUser) {
      return next(new ApiError("pas d'utilisateur avec cet id", 404));
    }
    const deviceData = { ...response.data.result[0], user: user };
    const device = new Device(deviceData);
    const newDevice = await device.save();
    console.log(newDevice);
    searchedUser.devices.push(newDevice.id);
    await searchedUser.save();
    res.status(201).json(newDevice);
  } catch (error) {
    res.status(400).json(error);
  }
});
const deleteDevice = AsyncHandler(async (req, res, next) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `FlespiToken ${process.env.FLESPITOKEN}`,
  };
  const deviceId = req.params.id;
  try {
    const response = await axios.delete(
      `${process.env.ENDPOINT}/gw/devices/${deviceId}`,
      { headers }
    );
    if (!response) {
      return next(new ApiError("Pas d'appareil avec cet id", 404));
    }
    const device = await Device.findOneAndDelete({ id: deviceId });
    if (!device) {
      return next(new ApiError("Device not found", 404));
    }
    const userId = device.user;
    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    user.devices.pull(deviceId);
    await user.save();
    res.json("Appareil Supprimé");
  } catch (error) {
    console.error("Error while deleting device:", error);
  }
});
const updateDevice = AsyncHandler(async (req, res) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `FlespiToken ${process.env.FLESPITOKEN}`,
  };
  try {
    const response = await axios.patch(
      `${process.env.ENDPOINT}/gw/devices/${req.params.id}`,
      req.body,
      { headers }
    );
    const device = response.data.result;
    res.json(device);
  } catch (error) {
    console.error("Error while editing device:", error);
  }
});
export async function fetchRealTimePosition(deviceId) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `FlespiToken ${process.env.FLESPITOKEN}`,
  };
  try {
    const response = await axios.get(
      `${process.env.ENDPOINT}/gw/devices/${deviceId}/telemetry/position`,
      { headers }
    );
    const device = response.data.result;
    const filteredData = device.map(({ telemetry: { position: { value } } }) => value);
    if (filteredData.length > 0) {
      return { latitude: filteredData[0].latitude, longitude: filteredData[0].longitude };
    }
  } catch (error) {
    console.error("Error while fetching real-time position:", error);
  }
}
const getDevicePosition = (io) => AsyncHandler(async (req, res) => {
  const deviceId = req.params.id;

  // Function to emit real-time position updates
  const emitRealTimePosition = async () => {
    const devicePosition = await fetchRealTimePosition(deviceId);
    if (devicePosition) {
      io.emit("positionUpdate", devicePosition);
    }
  };

  // Call emitRealTimePosition immediately to fetch the initial position
  emitRealTimePosition();

  // Set up an interval to emit real-time position updates every 5 seconds
  const interval = setInterval(emitRealTimePosition, 10000);

  // When the client disconnects, clear the interval
  io.on("disconnect", () => {
    clearInterval(interval);
    console.log("Client disconnected, real-time updates stopped");
  });

  // You can also return the initial position data if needed
  // For example:
  res.json({ message: "Initial position fetched", deviceId });
});

const getDeviceStatus = AsyncHandler(async (req, res) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `FlespiToken ${process.env.FLESPITOKEN}`,
  };
  try {
    const response = await axios.get(
      `${process.env.ENDPOINT}/gw/devices/${req.params.id}/telemetry/battery.level,device.name,gsm.signal.level,gnss.realtime.status,defense.active.status`,
      { headers }
    );
    const device = response.data.result;
    res.json(device);
  } catch (error) {
    console.error("Error while fetching devices:", error);
  }
});

export {
  getAllDevices,
  addDevice,
  getDeviceById,
  getDevicePosition,
  deleteDevice,
  updateDevice,
  getDeviceStatus,
  setSocket
};
