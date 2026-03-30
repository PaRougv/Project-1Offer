import mongoose from "mongoose";

const qualitySchema = new mongoose.Schema({
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
})

const Quality = mongoose.model('Quality' , qualitySchema)
export default Quality;