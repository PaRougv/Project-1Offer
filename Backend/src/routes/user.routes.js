import express from 'express'
import {
    register,
    login,
    logout,
    getCurrentUser,
    createHOD,
    createAdmin,
    getHODs,
    getAdmins,
    update,
    updateUser,
    deleteUser
} from '../controllers/user.controller.js'
import { requireAuth, requireHOD, requirePlantHead } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register' , requireAuth, requireHOD, register)
router.post('/login' , login)
router.post('/logout' , logout)
router.get('/me' , requireAuth, getCurrentUser)
router.post('/hods' , requireAuth, requirePlantHead, createHOD)
router.get('/hods' , requireAuth, requirePlantHead, getHODs)
router.post('/admins' , requireAuth, requireHOD, createAdmin)
router.get('/admins' , requireAuth, requireHOD, getAdmins)
router.put('/update' , requireAuth, update)
router.put('/users/:id' , requireAuth, requireHOD, updateUser)
router.delete('/users/:id' , requireAuth, requireHOD, deleteUser)

export default router