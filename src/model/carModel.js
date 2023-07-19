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
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  device_id: { type: mongoose.Schema.Types.ObjectId, ref: "Device"},
});

const Car = mongoose.model('Car', carSchema);

export default Car;
