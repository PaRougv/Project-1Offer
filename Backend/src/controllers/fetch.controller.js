import Safety from "../models/safety.model.js";
import Quality from "../models/quality.model.js";
import Delivery from "../models/delivery.model.js";
import Cost from "../models/cost.model.js";
import Department from "../models/department.model.js";

const getDateRange = (filter) => {
  const now = new Date();
  const startDate = new Date(now);

  if (filter === "daily") {
    startDate.setHours(0, 0, 0, 0);
    return startDate;
  }

  if (filter === "weekly") {
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startDate.setDate(now.getDate() + diff);
    startDate.setHours(0, 0, 0, 0);
    return startDate;
  }

  if (filter === "monthly") {
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    return startDate;
  }

  return startDate;
};

const aggregateSafety = (records) => {
  if (!records.length) return [];

  const total = records.reduce((acc, record) => {
    acc.nearmiss += Number(record.nearmiss || 0);
    acc.incidents += Number(record.incidents || 0);
    acc.fac += Number(record.fac || 0);
    return acc;
  }, { nearmiss: 0, incidents: 0, fac: 0 });

  return [{ ...total, _id: "summary" }];
};

const aggregateQuality = (records) => {
  if (!records.length) return [];

  const totalPunch = records.reduce((sum, record) => sum + Number(record.punch || 0), 0);
  const avgHs = records.reduce((sum, record) => sum + Number(record.hs || 0), 0) / records.length;

  const issueMap = new Map();
  records.forEach((record) => {
    (record.topIssues || []).forEach((issue) => {
      const key = issue.description;
      const current = issueMap.get(key) || 0;
      issueMap.set(key, current + Number(issue.number || 0));
    });
  });

  const topIssues = [...issueMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([description, number]) => ({ description, number }));

  return [{
    _id: "summary",
    hs: Number(avgHs.toFixed(2)),
    punch: totalPunch,
    topIssues,
  }];
};

const aggregateDelivery = (records) => {
  if (!records.length) return [];

  const total = records.reduce((acc, record) => {
    acc.ashiftin += Number(record.ashiftin || 0);
    acc.bshiftin += Number(record.bshiftin || 0);
    acc.cshiftin += Number(record.cshiftin || 0);
    acc.ashiftout += Number(record.ashiftout || 0);
    acc.bshiftout += Number(record.bshiftout || 0);
    acc.cshiftout += Number(record.cshiftout || 0);
    acc.topcoatcycles += Number(record.topcoatcycles || 0);
    acc.surfacercycles += Number(record.surfacercycles || 0);
    acc.biwproduction += Number(record.biwproduction || 0);
    acc.tcfproduction += Number(record.tcfproduction || 0);
    return acc;
  }, {
    ashiftin: 0,
    bshiftin: 0,
    cshiftin: 0,
    ashiftout: 0,
    bshiftout: 0,
    cshiftout: 0,
    topcoatcycles: 0,
    surfacercycles: 0,
    biwproduction: 0,
    tcfproduction: 0,
  });

  return [{ ...total, _id: "summary" }];
};

const aggregateCost = (records) => {
  if (!records.length) return [];

  const total = records.reduce((acc, record) => {
    acc.powerConsumption += Number(record.powerConsumption || 0);
    acc.gasConsumption += Number(record.gasConsumption || 0);
    acc.idmConsumption += Number(record.idmConsumption || 0);
    acc.thinnerConsumption += Number(record.thinnerConsumption || 0);
    acc.otNos += Number(record.otNos || 0);
    return acc;
  }, {
    powerConsumption: 0,
    gasConsumption: 0,
    idmConsumption: 0,
    thinnerConsumption: 0,
    otNos: 0,
  });

  return [{ ...total, _id: "summary" }];
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

    const safetyRecords = await Safety.find({
      ...departmentFilter,
      createdAt: { $gte: startDate }
    });

    const qualityRecords = await Quality.find({
      ...departmentFilter,
      createdAt: { $gte: startDate }
    });

    const deliveryRecords = await Delivery.find({
      ...departmentFilter,
      createdAt: { $gte: startDate }
    });

    const costRecords = await Cost.find({
      ...departmentFilter,
      createdAt: { $gte: startDate }
    });

    const department = req.user.role === "PLANT_HEAD"
      ? await Department.find({ createdAt: { $gte: startDate } })
      : await Department.find({ _id: req.user.department });

    res.status(200).json({
      safety: aggregateSafety(safetyRecords),
      quality: aggregateQuality(qualityRecords),
      delivery: aggregateDelivery(deliveryRecords),
      cost: aggregateCost(costRecords),
      department,
      viewerRole: req.user.role
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};