import pool from "../db/index.js";
import redisClient from "../../config/redis.js";

export const createProject = async (req, res) => {
  const { title, description, status, due_date, icon } = req.body;
  const userId = req.userId;

  try {
    await redisClient.del(`projects:${userId}`);

    const result = await pool.query(
      `insert into 
      projects(title,description,status,due_date,user_id,icon) 
      values($1,$2,$3,$4,$5,$6) returning id,title,description,status,due_date,created_at,icon`,
      [title, description, status, due_date, userId, icon],
    );
    res.status(201).json({ success: true, project: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const updateProject = async (req, res) => {
  const { updates } = req.body;
  const { projectId } = req.params;
  const userId = req.userId;

  try {
    await redisClient.del(`projects:${userId}`);
    await redisClient.del(`project:${userId}:${projectId}`);

    const result = await pool.query(
      `UPDATE projects
       SET ${Object.keys(updates)
         .map((key, index) => `${key}= $${index + 1}`)
         .join(
           ",",
         )} where id =$${Object.keys(updates).length + 1} and user_id =$${Object.keys(updates).length + 2}
       returning id,title,description,status,due_date,icon`,
      [...Object.values(updates), projectId, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ success: true, project: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const deleteProject = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.userId;

  try {
    await redisClient.del(`projects:${userId}`);

    await pool.query(`DELETE FROM projects WHERE id = $1 AND user_id = $2`, [
      projectId,
      userId,
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const getProjects = async (req, res) => {
  const userId = req.userId;

  try {
    const cachedData = await redisClient.get(`projects:${userId}`);
    if (cachedData)
      return res.status(200).json({
        success: true,
        source: "cache",
        projects: JSON.parse(cachedData),
      });
    const result = await pool.query(
      `SELECT 
      p.id, 
      p.title, 
      p.description, 
      p.status, 
      p.due_date, 
      p.icon,
      COUNT(t.id) AS total_tasks,
      COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) AS completed_tasks
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE p.user_id = $1 
      GROUP BY p.id
      ORDER BY p.created_at DESC;`,
      [userId],
    );
    res
      .status(200)
      .json({ success: true, source: "database", projects: result.rows });

    await redisClient.set(`projects:${userId}`, JSON.stringify(result.rows), {
      EX: 3000,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Request failed" });
  }
};

export const getProject = async (req, res) => {
  const userId = req.userId;
  const { projectId } = req.params;
  try {
    const cachedData = await redisClient.get(`project:${userId}:${projectId}`);
    if (cachedData)
      return res.status(200).json({
        success: true,
        source: "cache",
        project: JSON.parse(cachedData),
      });

    const result = await pool.query(
      `SELECT 
    p.id, 
    p.title, 
    p.description,
    p.status,
    p.due_date,
    p.created_at,
    p.icon,
    COUNT(t.id) AS total_tasks,
    COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) AS completed_tasks,
	  COALESCE (
      JSON_AGG(t.* ORDER BY t.created_at DESC) FILTER (WHERE t.id IS NOT NULL), '[]'
    ) AS tasks_list
    FROM projects p
    LEFT JOIN tasks t ON p.id = t.project_id
    WHERE p.id = $1 and user_id = $2
    GROUP BY p.id;`,
      [projectId, userId],
    );
    res
      .status(200)
      .json({ success: true, source: "database", project: result.rows[0] });
    await redisClient.set(
      `project:${userId}:${projectId}`,
      JSON.stringify(result.rows[0]),
      { EX: 3000 },
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Request failed" });
  }
};
