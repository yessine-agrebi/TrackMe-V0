import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const dbConnection = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.DATABASE, {
      useNewUrlParser: true, // to avoid deprecation warning
      useUnifiedTopology: true, // to avoid deprecation warning
    })
    .then((conn) => {
      console.log(`Database Connected: ${conn.connection.host}`);
    })
    .catch((err) => {
      console.error(`Database Error: ${err}`);
      process.exit(1);
    });
};


export { dbConnection };
