import Delivery from "../models/delivery.model.js";


// CREATE
export const createDelivery = async (req, res) => {
  try {

    console.log("Incoming Body:", req.body);

    const delivery = await Delivery.create(req.body);

    res.status(201).json({
      success: true,
      data: delivery
    });

  } catch (error) {

    console.log("FULL ERROR ↓↓↓↓↓↓↓↓↓↓↓↓");
    console.log(error);

    res.status(400).json({
      message: error.message,
      error
    });
  }
};



// GET ALL
export const getAllDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: delivery.length,
      data: delivery
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching delivery data",
      error: error.message
    });
  }
};



// GET SINGLE
export const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery data not found"
      });
    }

    res.status(200).json({
      success: true,
      data: delivery
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching delivery data",
      error: error.message
    });
  }
};



// UPDATE
export const updateDelivery = async (req, res) => {
  try {
    const {
      paintshopin,
      paintshopout,
      topcoatcycles,
      surfacercycles,
      biwproduction,
      tcfproduction
    } = req.body;

    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      {
        paintshopin,
        paintshopout,
        topcoatcycles,
        surfacercycles,
        biwproduction,
        tcfproduction
      },
      { new: true, runValidators: true }
    );

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery data not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Delivery updated successfully",
      data: delivery
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating delivery data",
      error: error.message
    });
  }
};



// DELETE
export const deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery data not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Delivery deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting delivery data",
      error: error.message
    });
  }
};