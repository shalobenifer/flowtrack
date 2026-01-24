import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { createTask,getTasks, updateTask, deleteTask } from '../controllers/task.controller.js'

const router= express.Router({mergeParams:true})

router.post('/',authMiddleware,createTask)
router.get('/',authMiddleware,getTasks)
router.put('/:taskId',authMiddleware,updateTask)
router.delete('/:taskId',authMiddleware,deleteTask)

export default router