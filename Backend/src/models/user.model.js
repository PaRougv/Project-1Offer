import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['PLANT_HEAD', 'HOD', 'ADMIN'],
        default: 'ADMIN',
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: function () {
            return this.role !== 'PLANT_HEAD';
        }
    }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;