import Safety from "../models/safety.model.js";

export const createSafety = async (req, res) => {
  try {
    const { nearmiss, incidents, fac } = req.body;

    const safety = new Safety({
      department: req.user.department,
      nearmiss,
      incidents,
      fac,
    });

    const savedSafety = await safety.save();

    res.status(201).json({
      success: true,
      message: "Safety data created successfully",
      data: savedSafety,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating safety data",
      error: error.message,
    });
  }
};



// GET ALL
export const getAllSafety = async (req, res) => {
  try {
    const safety = await Safety.find(req.user.role === "PLANT_HEAD" ? {} : { department: req.user.department }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: safety.length,
      data: safety,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching safety data",
      error: error.message,
    });
  }
};



// GET SINGLE
export const getSafetyById = async (req, res) => {
  try {
    const safety = await Safety.findOne({ _id: req.params.id, ...(req.user.role === "PLANT_HEAD" ? {} : { department: req.user.department }) });

    if (!safety) {
      return res.status(404).json({
        success: false,
        message: "Safety data not found",
      });
    }

    res.status(200).json({
      success: true,
      data: safety,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching safety data",
      error: error.message,
    });
  }
};



// UPDATE
export const updateSafety = async (req, res) => {
  try {
    const { nearmiss, incidents, fac } = req.body;

    const safety = await Safety.findOneAndUpdate(
      { _id: req.params.id, department: req.user.department },
      {
        nearmiss,
        incidents,
        fac,
      },
      { new: true, runValidators: true }
    );

    if (!safety) {
      return res.status(404).json({
        success: false,
        message: "Safety data not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Safety data updated successfully",
      data: safety,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating safety data",
      error: error.message,
    });
  }
};



// DELETE
export const deleteSafety = async (req, res) => {
  try {
    const safety = await Safety.findOneAndDelete({ _id: req.params.id, department: req.user.department });

    if (!safety) {
      return res.status(404).json({
        success: false,
        message: "Safety data not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Safety data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting safety data",
      error: error.message,
    });
  }
};