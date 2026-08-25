import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

export const register = async (req, res) => {
    try {

        const { name, email, password, department } = req.body;

        if (!name || !email || !password || !department) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "ADMIN",
            department
        });

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
};

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }

};

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0)
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }

};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("_id name email role department");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const createManagedUser = async (req, res, role) => {
    try {
        const { name, email, password, department } = req.body;
        const departmentId = role === "HOD" ? department : req.user.department;

        if (!name || !email || !password || !departmentId) {
            return res.status(400).json({ message: "Name, email, password, and department are required" });
        }
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            role,
            department: departmentId
        });

        return res.status(201).json({
            success: true,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role, department: user.department }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const createHOD = (req, res) => createManagedUser(req, res, "HOD");
export const createAdmin = (req, res) => createManagedUser(req, res, "ADMIN");

export const getHODs = async (req, res) => {
    const hods = await User.find({ role: "HOD" }).select("_id name email role department").populate("department", "name");
    res.status(200).json({ success: true, hods });
};

export const getAdmins = async (req, res) => {
    const admins = await User.find({ role: "ADMIN", department: req.user.department })
        .select("_id name email role department").populate("department", "name");
    res.status(200).json({ success: true, admins });
};

export const update = async (req, res) => {
    try {
        const userId = req.user.id;

        const { name, email, password, role } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email, password, department } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "ADMIN") {
            return res.status(403).json({ message: "Only admins can be managed" });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (department) user.department = department;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "ADMIN") {
            return res.status(403).json({ message: "Only admins can be deleted" });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Admin deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};