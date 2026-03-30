import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
    paintshopin: [
        {
            ashift: {
                type: Number,
                required: true
            },
            bshift: {
                type: Number,
                required: true
            },
            cshift: {
                type: Number,
                required: true
            }
        }
    ],
    paintshopout: [
        {
            ashift: {
                type: Number,
                required: true
            },
            bshift: {
                type: Number,
                required: true
            },
            cshift: {
                type: Number,
                required: true
            }
        }
    ],
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

})

const Delivery = mongoose.model('Delivery' , deliverySchema)
export default Delivery