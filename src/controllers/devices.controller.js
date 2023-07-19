import {
  addDevice,
  deleteDevice,
  getAllDevices,
  getDeviceById,
  getDevicePosition,
  updateDevice,
} from "../services/devices.service.js";

export const devicesController = {
  getAllDevices: getAllDevices,
  addDevice: addDevice,
  getDeviceById: getDeviceById,
  getDevicePosition: getDevicePosition,
  deleteDevice: deleteDevice,
  updateDevice: updateDevice
};
