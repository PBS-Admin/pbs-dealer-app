import mariadb from 'mariadb';

let pool;

const createPool = () => {
  if (!pool) {
    pool = mariadb.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 10, // Increased from 5
      acquireTimeout: 60000, // Increased timeout
      idleTimeout: 60000,
      connectTimeout: 20000, // Increased from 10000
      multipleStatements: true,
      resetAfterUse: true, // Reset connection state after use
      trace: true, // Enable connection tracing
      maxRetries: 3, // Add retry attempts
      minDelayMs: 1000, // Minimum delay between retries
    });
  }
  return pool;
};

async function validatePool() {
  try {
    const conn = await pool.getConnection();
    await conn.query('SELECT 1');
    conn.release();
    return true;
  } catch {
    return false;
  }
}

async function getConnectionWithRetry(retries = 3) {
  const pool = createPool();
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      const conn = await pool.getConnection();
      return conn;
    } catch (err) {
      lastError = err;
      console.log(`Connection attempt ${i + 1} failed, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw lastError;
}

export async function query(sql, params) {
  let conn;
  try {
    if (!(await validatePool())) {
      await endPool();
      createPool();
    }
    conn = await getConnectionWithRetry();
    const rows = await conn.query(sql, params);
    return rows;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  } finally {
    if (conn) await conn.release().catch(console.error);
  }
}

export async function transaction(callback) {
  let conn;
  try {
    if (!(await validatePool())) {
      await endPool();
      createPool();
    }
    conn = await getConnectionWithRetry();
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (err) {
    if (conn) {
      try {
        await conn.rollback();
      } catch (rollbackErr) {
        console.error('Rollback error:', rollbackErr);
      }
    }
    console.error('Transaction error:', err);
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.release();
      } catch (err) {
        console.error('Error releasing connection:', err);
      }
    }
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
