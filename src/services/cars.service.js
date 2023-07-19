import Car from "../model/carModel.js";
import User from "../model/usersModel.js";

export const createCar = async (req, res) => {
    try {
      const car = new Car(req.body);
      const newCar = await car.save();
      const user = await User.findById(newCar.user);
      user.cars.push(newCar._id);
      user.devices.push(newCar.device_id);
      await user.save();
      res.status(201).json(newCar);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };