import {
  addDevice,
  deleteDevice,
  getAllDevices,
  getDeviceById,
  getDevicePosition,
  getDeviceStatus,
  updateDevice,
} from "../services/devices.service.js";

export const devicesController = {
  getAllDevices: getAllDevices,
  addDevice: addDevice,
  getDeviceById: getDeviceById,
  getDevicePosition: getDevicePosition,
  deleteDevice: deleteDevice,
  updateDevice: updateDevice,
  getDeviceStatus: getDeviceStatus
};
