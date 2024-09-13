import mariadb from 'mariadb';

let pool;
let cleanupInterval;

const CLEANUP_INTERVAL = 60000; // 1 minute
const IDLE_TIMEOUT = 60000;

function createPool() {
  if (!pool) {
    pool = mariadb.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 10,
      acquireTimeout: 30000, // 30 seconds
      idleTimeout: IDLE_TIMEOUT, // 60 seconds
      connectTimeout: 10000, // 10 seconds
    });

    if (process.env.NODE_ENV === 'development' && !cleanupInterval) {
      cleanupInterval = setInterval(cleanIdleConnections, CLEANUP_INTERVAL);
    }
  }
  return pool;
}

async function cleanIdleConnections() {
  if (pool) {
    try {
      await pool.query('SELECT 1'); // This will clean up idle connections
    } catch (error) {
      console.error('Error during idle connection cleanup:', error);
    }
  }
}

export async function query(sql, params) {
  const pool = createPool();
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(sql, params);
    return rows;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  } finally {
    if (conn) conn.release(); // Release the connection back to the pool
  }
}

export async function getConnection() {
  const pool = createPool();
  return pool.getConnection();
}

export async function transaction(callback) {
  const pool = createPool();
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
    if (conn) conn.release();
  }
}

export async function endPool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}

export async function manualCleanup() {
  await cleanIdleConnections();
}
// Transaction example usage elsewhere
// import { transaction } from '../lib/db';

// await transaction(async (conn) => {
//   await conn.query('INSERT INTO users (name) VALUES (?)', ['John']);
//   await conn.query('UPDATE user_count SET count = count + 1');
// });
