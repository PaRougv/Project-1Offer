import express from 'express'
import {
    createDepartment,
    getDepartment,
    updateDepartment,
    deleteDepartment
} from '../controllers/department.controller.js'

const router = express.Router()

router.post('/' , createDepartment)
router.get('/' , getDepartment)
router.put('/:id' , updateDepartment)
router.delete('/:id' , deleteDepartment)

export default router