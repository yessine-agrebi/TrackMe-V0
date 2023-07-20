import axios from "axios";
import asyncHandler from "express-async-handler";
import History from "../model/historyModel.js";
import { addDays, endOfDay, format, fromUnixTime, parse, parseISO, startOfDay } from "date-fns";

function formatDate(timestamp) {
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
  const match = timestamp.toString().match(dateRegex);
  if (!match) {
    throw new Error(`Invalid timestamp format: ${timestamp}`);
  }

  const [, day, month, year, hour, minute, second] = match;
  return `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;
}
const getHistory = asyncHandler(async (req, res, next) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `FlespiToken ${process.env.FLESPITOKEN}`,
  };

  try {
    const response = await axios.get(
      `${process.env.ENDPOINT}/gw/devices/${req.params.id}/messages?data={
        "filter":"position.longitude,position.latitude,position.timestamp",
        "fields":"position.longitude,position.latitude,device.name,device.id,position.speed,position.timestamp"
           }`,
      {
        headers,
      }
    );
    const historyData = response.data.result;
    const history = new History({
      device: {
        id: historyData[0]["device.id"],
        name: historyData[0]["device.name"],
      },
      positions: historyData.map((position) => {
        const timestamp = position["position.timestamp"];
        const date = new Date(timestamp * 1000);
        const formattedDate = format(date, 'dd/MM/yyyy');
        const formattedTime = format(date, 'HH:mm:ss');
        return {
          latitude: position["position.latitude"],
          longitude: position["position.longitude"],
          speed: position["position.speed"],
          date: formattedDate, // Get the formatted date
          time: formattedTime
        };
      }),
    });
    await history.save();
  
    res.status(201).json(history);
  } catch (error) {
    console.error("Error updating location:", error);
  }
});

const getLocationsByDate = async (req, res) => {
  const { deviceId, start, end } = req.params;

  try {
    const startDate = startOfDay(parse(start, "dd-MM-yyyy", new Date()));
    const endDate = end ? endOfDay(parse(end, "dd-MM-yyyy", new Date())) : null;

    let query = {
      "device.id": deviceId,
    };

    const locationDocument = await History.findOne(query);

    if (!locationDocument) {
      return res.json("device not found");
    }
    // Retrieve the locations array from the document
    const locations = locationDocument.positions;
    // Filter the locations based on the date range
    const filteredLocations = locations.filter((location) => {
      const locationDate = parse(
        location.date,
        "dd/MM/yyyy",
        new Date()
      );
      return (
        (endDate && locationDate >= startDate && locationDate <= endDate) ||
        (!endDate &&
          locationDate >= startDate &&
          locationDate < addDays(startDate, 1))
      );
    });

    res.json(filteredLocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getHistory, getLocationsByDate };
