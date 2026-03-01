import pool from "../db/index.js";
import redisClient from "../../config/redis.js";

export const createTask = async (req, res) => {
  const { title, description, priority, due_date } = req.body;
  const { projectId } = req.params;
  const userId = req.userId;

  try {
    await redisClient.del(`project:${userId}:${projectId}`);
    await redisClient.del(`projects:${userId}`);

    const result = await pool.query(
      `INSERT INTO tasks (title, description,priority, due_date,project_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, description, due_date, status, priority, created_at`,
      [title, description, priority, due_date, projectId],
    );

    res.status(201).json({ success: true, task: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const updateTask = async (req, res) => {
  const updates = req.body;
  const { projectId, taskId } = req.params;
  const userId = req.userId;

  try {
    await redisClient.del(`project:${userId}:${projectId}`);
    await redisClient.del(`projects:${userId}`);

    const result = await pool.query(
      `update tasks 
          set ${Object.keys(updates)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(",")}
          where id= $${Object.keys(updates).length + 1}
          returning id,title,description,priority,status,due_date`,
      [...Object.values(updates), taskId],
    );
    res.status(200).json({ success: true, task: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Task updation failed",
    });
  }
};

export const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const { projectId } = req.params;
  const userId = req.userId;

  try {
    await redisClient.del(`project:${userId}:${projectId}`);
    await redisClient.del(`projects:${userId}`);

    const result = await pool.query(`delete from tasks where id=$1`, [taskId]);
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Task Deletion failed" });
  }
};

//unused for now, might be used in future when we implement task details page
export const getProjectTasks = async (req, res) => {
  const { projectId } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, title, description,status,priority,created_at
       FROM tasks
       WHERE project_id = $1`,
      [projectId],
    );

    res.json({ success: true, tasks: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
