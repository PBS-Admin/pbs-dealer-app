import mariadb from 'mariadb';

let pool;

const createPool = () => {
  if (!pool) {
    pool = mariadb.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 5, // Reduced from 10
      acquireTimeout: 30000,
      idleTimeout: 60000,
      connectTimeout: 10000,
      multipleStatements: true,
    });
  }
  return pool;
};

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
    if (conn) conn.release();
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
}

// New function to check pool status
export async function getPoolStatus() {
  if (!pool) return null;
  return {
    totalConnections: pool.totalConnections(),
    activeConnections: pool.activeConnections(),
    idleConnections: pool.idleConnections(),
    taskQueueSize: pool.taskQueueSize(),
  };
}
