import express from 'express'
import {
    register,
    login,
    logout,
    update,
    verify
} from '../controllers/user.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/verify' , authMiddleware , verify)
router.post('/register' , register)
router.post('/login' , login)
router.post('/logout' , logout)
router.put('/update' , update)

export default router