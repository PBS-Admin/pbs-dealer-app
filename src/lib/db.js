import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10, // Increased from 5 to 10
  acquireTimeout: 30000, // 30 seconds
  idleTimeout: 60000, // 60 seconds
  connectTimeout: 10000, // 10 seconds
});

export async function query(sql, params) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(sql, params);
    return rows;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  } finally {
    if (conn) await conn.release(); // Release the connection back to the pool
  }
}

export async function getConnection() {
  return await pool.getConnection();
}

export async function transaction(callback) {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('Transaction error:', err);
    throw err;
  } finally {
    if (conn) await conn.release();
  }
}
// Transaction example usage elsewhere
// import { transaction } from '../lib/db';

// await transaction(async (conn) => {
//   await conn.query('INSERT INTO users (name) VALUES (?)', ['John']);
//   await conn.query('UPDATE user_count SET count = count + 1');
// });
