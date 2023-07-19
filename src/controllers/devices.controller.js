import { addDevice, getAllDevices, getDeviceById, getDevicePosition } from "../services/devices.service.js";

export const devicesController = {
    getAllDevices: getAllDevices,
    addDevice: addDevice,
    getDeviceById: getDeviceById,
    getDevicePosition: getDevicePosition
}