import mongoose from "mongoose";

const costSchema = new mongoose.Schema(
  {
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