import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cars: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car", required: false }],
  role: {
    type: String,
    enum: ["admin", "revendeur", "client"],
    default: "client",
  },
  parentid: {type: mongoose.Schema.Types.ObjectId, ref: "User",default: null, required: false},
  devices:[ {type: mongoose.Schema.Types.ObjectId, ref: "Device", required: false}],
  users: [{type: mongoose.Schema.Types.ObjectId, ref: "User",default: null, required: false}],
  phone: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
