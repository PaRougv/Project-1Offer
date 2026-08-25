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

    if (!['daily', 'weekly', 'monthly'].includes(filter)) {
      return res.status(400).json({ message: "Invalid dashboard filter" });
    }

    const startDate = getDateRange(filter);
    const departmentFilter = req.user.role === "PLANT_HEAD"
      ? {}
      : { department: req.user.department };

    const safety = await Safety.find({
      ...departmentFilter,
      createdAt: { $gte: startDate }
    });

    const quality = await Quality.find({
      ...departmentFilter,
      createdAt: { $gte: startDate }
    });

    const delivery = await Delivery.find({
      ...departmentFilter,
      createdAt: { $gte: startDate }
    });

    const cost = await Cost.find({
      ...departmentFilter,
      createdAt: { $gte: startDate }
    });

    const department = req.user.role === "PLANT_HEAD"
      ? await Department.find({ createdAt: { $gte: startDate } })
      : await Department.find({ _id: req.user.department });



    res.status(200).json({
      safety,
      quality,
      delivery,
      cost,
      department,
      viewerRole: req.user.role
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};