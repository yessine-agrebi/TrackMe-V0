import Car from "../model/carModel.js";
import User from "../model/usersModel.js";

const addCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    const newCar = await car.save();
    if (newCar.user) {
      const user = await User.findById(newCar.user);
      user.cars.push(newCar._id);
      await user.save();
    }
    res.status(201).json(newCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCars = async (req, res) => {
  try {
    const cars = await Car.find().populate({ path: "user" });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOneCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json("Car not found!!");
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(car);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    const user = await User.findById(car.user);
    user.cars.pull(car._id);
    await user.save();
    res.status(200).json({ message: "Car Deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export { addCar, getCars, getOneCar,deleteCar, updateCar };
