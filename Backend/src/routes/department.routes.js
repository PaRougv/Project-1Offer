import express from 'express'
import { requireAuth, requirePlantHead } from '../middleware/auth.middleware.js'
import {
    createDepartment,
    getDepartment,
    updateDepartment,
    deleteDepartment
} from '../controllers/department.controller.js'

const router = express.Router()

router.post('/' , requireAuth, requirePlantHead, createDepartment)
router.get('/' , requireAuth, getDepartment)
router.put('/:id' , requireAuth, requirePlantHead, updateDepartment)
router.delete('/:id' , requireAuth, requirePlantHead, deleteDepartment)

export default router