import express from 'express'
import {
    register,
    login,
    logout,
    update,
    updateUser,
    deleteUser
} from '../controllers/user.controller.js'
import { requireAuth, requireHOD } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register' , requireAuth, requireHOD, register)
router.post('/login' , login)
router.post('/logout' , logout)
router.put('/update' , requireAuth, update)
router.put('/users/:id' , requireAuth, requireHOD, updateUser)
router.delete('/users/:id' , requireAuth, requireHOD, deleteUser)

export default router