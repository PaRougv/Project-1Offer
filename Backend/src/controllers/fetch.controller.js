import Safety from "../models/safety.model.js";
import Quality from "../models/quality.model.js";
import Delivery from "../models/delivery.model.js";
import Cost from "../models/cost.model.js";
import Department from "../models/department.model.js";

const getDateRange = (filter) => {
  const now = new Date();

  let startDate;

  if (filter === "daily") {
    startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
  }

  if (filter === "weekly") {
    startDate = new Date();
    startDate.setDate(now.getDate() - 7);
  }

  if (filter === "monthly") {
    startDate = new Date();
    startDate.setMonth(now.getMonth() - 1);
  }

  return startDate;
};



// Main Dashboard Controller

export const getDashboardData = async (req, res) => {
  try {

    const { filter } = req.query;

    const startDate = getDateRange(filter);

    const safety = await Safety.find({
      createdAt: { $gte: startDate }
    });

    const quality = await Quality.find({
      createdAt: { $gte: startDate }
    });

    const delivery = await Delivery.find({
      createdAt: { $gte: startDate }
    });

    const cost = await Cost.find({
      createdAt: { $gte: startDate }
    });


    res.status(200).json({
      safety,
      quality,
      delivery,
      cost,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};