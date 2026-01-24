import jwt from 'jsonwebtoken';
import pool from '../db/index.js'

export const authMiddleware = async(req,res,next)=>{
    const token = req.cookies.token

    if (!token) return res.status(401).json({ message : 'No token found'})

    try{
        const blacklisted = await pool.query('select * from blacklisted_tokens where token=$1',[token])
        if(blacklisted.rows.length>0) return res.status(401).json({message : 'Token has been loged out'})

        const decode = jwt.verify(token,process.env.JWT_SECRET)
        req.userId = decode.userId
        next()
    }
    catch{
        res.status(401).json({message : 'Invalid token'})
    }

}