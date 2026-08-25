import Quality from "../models/quality.model.js";

export const createQuality = async (req, res) => {
  try {
    const { hs, punch, topIssues } = req.body;
    

    const quality = new Quality({
      department: req.user.department,
      hs,
      punch,
      topIssues,
    });

    const savedQuality = await quality.save();


    res.status(201).json({
      success: true,
      message: "Quality data created successfully",
      data: savedQuality,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating quality data",
      error: error.message,
    });
  }
};



export const getAllQuality = async (req, res) => {
  try {
    const quality = await Quality.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quality.length,
      data: quality,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching quality data",
      error: error.message,
    });
  }
};



export const getQualityById = async (req, res) => {
  try {
    const quality = await Quality.findById(req.params.id);

    if (!quality) {
      return res.status(404).json({
        success: false,
        message: "Quality data not found",
      });
    }

    res.status(200).json({
      success: true,
      data: quality,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching quality data",
      error: error.message,
    });
  }
};



export const updateQuality = async (req, res) => {
  try {
    const { hs, punch, topIssues } = req.body;

    const quality = await Quality.findByIdAndUpdate(
      req.params.id,
      {
        hs,
        punch,
        topIssues,
      },
      { new: true, runValidators: true }
    );

    if (!quality) {
      return res.status(404).json({
        success: false,
        message: "Quality data not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quality updated successfully",
      data: quality,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating quality data",
      error: error.message,
    });
  }
};



// DELETE
export const deleteQuality = async (req, res) => {
  try {
    const quality = await Quality.findByIdAndDelete(req.params.id);

    if (!quality) {
      return res.status(404).json({
        success: false,
        message: "Quality data not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quality deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting quality data",
      error: error.message,
    });
  }
};