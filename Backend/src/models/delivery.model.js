import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true
    },
    ashiftin: {
        type: Number,
        required: true
    },
    bshiftin: {
        type: Number,
        required: true
    },
    cshiftin: {
        type: Number,
        required: true
    },
    ashiftout: {
        type: Number,
        required: true
    },
    bshiftout: {
        type: Number,
        required: true
    },
    cshiftout: {
        type: Number,
        required: true
    },
    topcoatcycles: {
        type: Number,
        required: true
    },
    surfacercycles: {
        type: Number,
        required: true
    },
    biwproduction: {
        type: Number,
        required: true
    },
    tcfproduction: {
        type: Number,
        required: true
    }

} , {
    timestamps: true   // ← ADD THIS
})

const Delivery = mongoose.model('Delivery' , deliverySchema)
export default Delivery