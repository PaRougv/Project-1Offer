import Department from '../models/department.model.js'
import User from '../models/user.model.js'


// CREATE DEPARTMENT
export const createDepartment = async (req , res) => {
    try {

        const { name, description } = req.body

        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingDepartment = await Department.findOne({ name })

        if(existingDepartment){
            return res.status(400).json({
                success: false,
                message: "Department already exists"
            })
        }

        const department = await Department.create({
            name,
            description
        })

        return res.status(201).json({
            success: true,
            message: "Department created successfully",
            department
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        })
    }
}



// DELETE DEPARTMENT
export const deleteDepartment = async (req , res) => {
    try {

        const { id } = req.params

        const department = await Department.findById(id)

        if(!department){
            return res.status(404).json({
                success: false,
                message: "Department not found"
            })
        }

        // Remove department from users
        await User.updateMany(
            { department: id },
            { $unset: { department: "" } }
        )

        await Department.findByIdAndDelete(id)

        return res.status(200).json({
            success: true,
            message: "Department deleted successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        })
    }
}



// GET ALL DEPARTMENTS
export const getDepartment = async (req , res) => {
    try {

        const departments = req.user.role === "PLANT_HEAD"
            ? await Department.find()
            : await Department.find({ _id: req.user.department })

        return res.status(200).json({
            success: true,
            count: departments.length,
            departments
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        })
    }
}



// UPDATE DEPARTMENT
export const updateDepartment = async (req , res) => {
    try {

        const { id } = req.params
        const { name , description } = req.body

        const department = await Department.findById(id)

        if(!department){
            return res.status(404).json({
                success: false,
                message: "Department not found"
            })
        }

        const updatedDepartment = await Department.findByIdAndUpdate(
            id,
            {
                name: name || department.name,
                description: description || department.description
            },
            { new: true }
        )

        return res.status(200).json({
            success: true,
            message: "Department updated successfully",
            department: updatedDepartment
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        })
    }
}