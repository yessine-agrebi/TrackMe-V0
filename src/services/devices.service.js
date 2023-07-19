import axios from "axios";
import AsyncHandler from "express-async-handler";
import _ from "lodash";
import ApiError from "../utils/apiError.js";
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

const addDevice = AsyncHandler(async (req, res) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `FlespiToken ${process.env.FLESPITOKEN}`,
    };
    const clonedData = _.cloneDeep(req.body);
    console.log(clonedData);
    const response = await axios.post(
      `${process.env.ENDPOINT}/gw/devices`,
      clonedData,
      {
        headers,
      }
    );
    res.status(201).json(response.data.result);
  } catch (error) {
    res.status(400).json(error);
  }
});
const deleteDevice = AsyncHandler(async (req, res, next) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `FlespiToken ${process.env.FLESPITOKEN}`,
  };
  try {
    const response = await axios.delete(
      `${process.env.ENDPOINT}/gw/devices/${req.params.id}`,
      { headers }
    );
    if (!response) {
      return next(new ApiError("Pas d'appareil avec cet id", 404));
    }
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
        `${process.env.ENDPOINT}/gw/devices/${req.params.id}`, req.body,
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
  updateDevice
};
