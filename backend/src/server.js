import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.route.js';
import userRoute from './routes/user.route.js'
import projectRoute from './routes/project.route.js'
import taskRoute from './routes/task.route.js'

const app = express()

import pool from './db/index.js';

app.use(cors({origin: 'http://localhost:3000' , credentials: true}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRoutes)
app.use('/api/users',userRoute)
app.use('/api/projects',projectRoute)
app.use('/api/projects/:projectId/tasks',taskRoute)



app.listen(5000,()=>{
    console.log('Server running at port 5000')
})


app.get('/',(req,res)=>{
    res.send('Backend running')
})

app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('select * from users');
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});


