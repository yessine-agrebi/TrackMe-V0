import axios from "axios";
import asyncHandler from "express-async-handler";
import History from "../model/historyModel.js";
const getHistory = asyncHandler(async (req, res, next) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `FlespiToken ${process.env.FLESPITOKEN}`,
  };

  try {
    const response = await axios.get(
      `${process.env.ENDPOINT}/gw/devices/${req.params.id}/messages?data={
        "filter":"position.longitude,position.latitude",
        "fields":"position.longitude,position.latitude,device.name,device.id,position.speed,position.timestamp"
           }`,
      {
        headers,
      }
    );
    const historyData = response.data.result;
    const history = new History({
        device: {
            id: historyData[0]['device.id'],
            name: historyData[0]['device.name'],
        },
        positions: historyData.map(position => {
            const timestamp = position['position.timestamp'];
            const date = new Date(timestamp * 1000); // Convert timestamp to Date object
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const formattedDate = date.toLocaleDateString(undefined, options);
            return {
              latitude: position['position.latitude'],
              longitude: position['position.longitude'],
              speed: position['position.speed'],
              date: formattedDate, // Get the formatted date
              time: date.toLocaleTimeString() // Get the formatted time
            };
          })
      });
      await history.save();
      res.status(201).json(historyData)
  } catch (error) {
    console.error("Error updating location:", error);
  }
});

export { getHistory };
