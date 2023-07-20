import mongoose from "mongoose";

const configurationSchema = new mongoose.Schema({
  ident: { type: String, required: true },
  phone: { type: String, required: true },
  settings_polling: { type: String, default: 'once' }
});

const deviceSchema = new mongoose.Schema({
  messages_ttl: {
    type: Number,
    default: 1
  },
  device_type_id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    required: true,
    unique: true
  },
  configuration: {
    type: configurationSchema, required: true
  },
  
  messages_rotate: {
    type: Number,
    default: 0
  },
  cid:{
    type: Number
  },
  user:{
    type: mongoose.Schema.Types.ObjectId, ref: "User"
  }
});

const Device = mongoose.model('Device', deviceSchema);

export default  Device;
