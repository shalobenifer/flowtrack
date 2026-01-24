import pool from '../db/index.js'
export const createProject  = async(req,res)=>{
    const {title,description} = req.body 
    const userId = req.userId

    try{
    const result = await pool.query('insert into projects(title,description,user_id) values($1,$2,$3) returning id,title,description,created_at', [title,description,userId])
    res.status(201).json({success:true,project: result.rows[0]})

    }
    catch (error) {
    console.error(error);
    res.status(500).json(
      {success: false}
    )
}
}

export const updateProject = async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;
  const userId = req.userId;

  try {
    const result = await pool.query(
      `UPDATE projects
       SET title = $1, description = $2
       WHERE id = $3 AND user_id = $4
       RETURNING id, title, description`,
      [title, description, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ success: true, project: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    await pool.query(
      `DELETE FROM projects WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const getProjects = async(req,res)=>{
    const userId = req.userId

    try{
        const result = await pool.query('select id,title,description,created_at from projects where user_id=$1', [userId])
        res.status(200).json({success:true,projects: result.rows})
    }
    catch(error){
        console.log(error)
        res.status(500).json({success:false,message: 'Request failed'})
    }
}
