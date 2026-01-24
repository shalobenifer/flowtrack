import pool from '../db/index.js'

export const createTask = async (req, res) => {
  const { title, description } = req.body;
  const { projectId } = req.params;

  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, project_id)
       VALUES ($1, $2, $3)
       RETURNING id, title, description,status,priority,created_at`,
      [title, description, projectId]
    );

    res.status(201).json({ success: true, task: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const updateTask =async (req,res)=>{
    const {title,description} = req.body
    const { taskId } = req.params;

    try{
        const result = await pool.query('update tasks set title=$1,description=$2 where id=$3 returning id,title,description,status,priority' [title, description,taskId])
        res.status(200).json({success:true,project: result.rows[0]})
    }
    catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Task updation failed',
    });
    }
}

export const deleteTask = async (req,res)=>{
    const { taskId } = req.params;

    try{
        const request = await pool.query('delete from projects where id=$1',[taskId])
        res.status(201).json({success:true})
    }
    catch(error){
        console.log(error)
        res.status(500).json({success:false,message:'Task Deletion failed'})
    }
}

export const getTasks = async (req, res) => {
  const { projectId } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, title, description,status,priority,created_at
       FROM tasks
       WHERE project_id = $1`,
      [projectId]
    );

    res.json({ success: true, tasks: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
