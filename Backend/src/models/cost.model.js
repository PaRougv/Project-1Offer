import mongoose from "mongoose";

const costSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },
    powerConsumption: {
      type: Number,
      required: true,
      default: 0,
    },

    gasConsumption: {
      type: Number,
      required: true,
      default: 0,
    },

    idmConsumption: {
      type: Number,
      required: true,
      default: 0,
    },

    thinnerConsumption: {
      type: Number,
      required: true,
      default: 0,
    },

    otNos: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cost", costSchema);