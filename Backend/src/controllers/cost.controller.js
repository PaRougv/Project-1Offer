import Cost from "../models/cost.model.js";

export const createCost = async (req, res) => {
  try {
    const {
      powerConsumption,
      gasConsumption,
      idmConsumption,
      thinnerConsumption,
      otNos
    } = req.body;

    const cost = new Cost({
      department: req.user.department,
      powerConsumption,
      gasConsumption,
      idmConsumption,
      thinnerConsumption,
      otNos
    });

    const savedCost = await cost.save();

    res.status(201).json({
      success: true,
      message: "Cost data created successfully",
      data: savedCost
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating cost data",
      error: error.message
    });
  }
};



// GET ALL
export const getAllCost = async (req, res) => {
  try {
    const cost = await Cost.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cost.length,
      data: cost
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cost data",
      error: error.message
    });
  }
};



// GET SINGLE
export const getCostById = async (req, res) => {
  try {
    const cost = await Cost.findById(req.params.id);

    if (!cost) {
      return res.status(404).json({
        success: false,
        message: "Cost data not found"
      });
    }

    res.status(200).json({
      success: true,
      data: cost
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cost data",
      error: error.message
    });
  }
};



// UPDATE
export const updateCost = async (req, res) => {
  try {
    const {
      powerConsumption,
      gasConsumption,
      idmConsumption,
      thinnerConsumption,
      otNos
    } = req.body;

    const cost = await Cost.findByIdAndUpdate(
      req.params.id,
      {
        powerConsumption,
        gasConsumption,
        idmConsumption,
        thinnerConsumption,
        otNos
      },
      { new: true, runValidators: true }
    );

    if (!cost) {
      return res.status(404).json({
        success: false,
        message: "Cost data not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Cost updated successfully",
      data: cost
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating cost data",
      error: error.message
    });
  }
};



// DELETE
export const deleteCost = async (req, res) => {
  try {
    const cost = await Cost.findByIdAndDelete(req.params.id);

    if (!cost) {
      return res.status(404).json({
        success: false,
        message: "Cost data not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Cost deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting cost data",
      error: error.message
    });
  }
};