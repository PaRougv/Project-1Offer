import mongoose from 'mongoose'

const safetySchema = new mongoose.Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true
    },
    nearmiss: {
        type: Number,
        required: true
    },
    incidents: {
        type: Number,
        required: true
    },
    fac: {
        type: Number,
        required: true
    }
} , {
    timestamps: true
})

const Safety = mongoose.model('Safety' , safetySchema)
export default Safety