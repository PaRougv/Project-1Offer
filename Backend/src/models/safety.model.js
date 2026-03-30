import mongoose from 'mongoose'

const safetySchema = new mongoose.Schema({
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