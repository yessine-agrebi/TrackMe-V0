import { addCar, deleteCar, getCars, getOneCar, updateCar } from "../services/cars.service.js";

export const carsController = {
    addCar: addCar,
    getCars: getCars,
    getOneCar: getOneCar,
    updateCar: updateCar,
    deleteCar: deleteCar
  };