import mongoose from "mongoose";

const qualitySchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },
    hs: {
        type: Number,
        required: true,
    },
    punch: {
        type: Number,
        required: true
    },
    topIssues: [
      {
        description: {
          type: String,
          required: true,
        },
        number: {
          type: Number,
          required: true,
        },
      },
    ],
  }, { timestamps: true })

const Quality = mongoose.model('Quality' , qualitySchema)
export default Quality;