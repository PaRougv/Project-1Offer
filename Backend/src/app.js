import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/user.routes.js';
import departmentRoutes from './routes/department.routes.js';
import costRoutes from './routes/cost.routes.js';
import safetyRoutes from './routes/safety.routes.js';
import qualityRoutes from './routes/quality.routes.js'
import deliveryRoutes from './routes/department.routes.js'
dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/safety' , safetyRoutes)
app.use('/api/quality' , qualityRoutes)
app.use('/api/delivery' , deliveryRoutes)
app.use('/api/cost' , costRoutes)


export default app;