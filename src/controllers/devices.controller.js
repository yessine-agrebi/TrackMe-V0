import { addDevice, getAllDevices } from "../services/devices.service.js";

export const devicesController = {
    getAllDevices: getAllDevices,
    addDevice: addDevice
}