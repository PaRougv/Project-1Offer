import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import authRoutes from './routes/user.routes.js';
import departmentRoutes from './routes/department.routes.js';
import costRoutes from './routes/cost.routes.js';
import safetyRoutes from './routes/safety.routes.js';
import qualityRoutes from './routes/quality.routes.js'
import deliveryRoutes from './routes/delivery.routes.js'
import fetchRoutes from './routes/fetch.routes.js'
dotenv.config();

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',').map(origin => origin.trim()).filter(Boolean);

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be configured');
}

app.disable('x-powered-by');
app.use(helmet());

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use('/api/auth/login', rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Too many login attempts. Try again later.' }
}));

app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'paintshop-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/safety' , safetyRoutes)
app.use('/api/quality' , qualityRoutes)
app.use('/api/delivery' , deliveryRoutes)
app.use('/api/cost' , costRoutes)
app.use("/api", fetchRoutes);

app.use('/api', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.status || 500).json({ message: 'Internal server error' });
});


export default app;