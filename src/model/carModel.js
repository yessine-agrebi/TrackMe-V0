import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  num_serie: {
    type: String,
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  device_id: { type: Number, ref: "Device", default: null },
});

const Car = mongoose.model("Car", carSchema);

export default Car;
