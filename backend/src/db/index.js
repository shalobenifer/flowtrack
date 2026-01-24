import dotenv from 'dotenv';
dotenv.config()

import pkg from 'pg';
const {Pool} = pkg;

const pool =new Pool({
    user:process.env.DB_USER,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    host:'localhost',
    port:5432,
});

export default pool;