import axios from "axios";
import AsyncHandler from "express-async-handler";
import _ from "lodash";
import ApiError from "../utils/apiError.js";
import User from "../model/usersModel.js";
import Device from "../model/deviceModel.js";
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
    console.log("user", user);
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
const getDevicePosition = AsyncHandler(async (req, res) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `FlespiToken ${process.env.FLESPITOKEN}`,
  };
  try {
    const response = await axios.get(
      `${process.env.ENDPOINT}/gw/devices/${req.params.id}/telemetry/position`,
      { headers }
    );
    const device = response.data.result;
    const filteredData = device.map(({ telemetry: { position: { value } } }) => value);
    res.json(filteredData);
  } catch (error) {
    console.error("Error while fetching devices:", error);
  }
});

const getDeviceStatus = AsyncHandler(async (req, res) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `FlespiToken ${process.env.FLESPITOKEN}`,
  };
  try {
    const response = await axios.get(
      `${process.env.ENDPOINT}/gw/devices/${req.params.id}/telemetry/battery.level,device.name,gsm.signal.level,gnss.realtime.status`,
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
  getDeviceStatus
};
