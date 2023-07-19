import { addDevice, getAllDevices, getDeviceById } from "../services/devices.service.js";

export const devicesController = {
    getAllDevices: getAllDevices,
    addDevice: addDevice,
    getDeviceById: getDeviceById
}