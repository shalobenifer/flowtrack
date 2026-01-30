import express from 'express'
import { authMiddleware} from '../middleware/auth.middleware.js'
import { createProject, updateProject, deleteProject, getProjects } from '../controllers/project.controller.js'

const router = express.Router()

router.post('/',authMiddleware,createProject)
router.get('/',authMiddleware,getProjects)
router.put('/:projectId',authMiddleware,updateProject)
router.delete('/:projectId',authMiddleware,deleteProject)

export default router