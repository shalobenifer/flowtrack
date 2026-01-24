import {authMiddleware} from '../middleware/auth.middleware.js'
import express from 'express'

const router = express.Router()

router.get('/me',authMiddleware,(req,res)=>{
    res.json({message : 'Potected route accessed', userId : req.userId })
})

export default router