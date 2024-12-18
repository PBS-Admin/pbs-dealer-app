import mariadb from 'mariadb';

class DatabasePool {
  constructor() {
    this.pool = null;
    this.isShuttingDown = false;
    this.setupShutdownHandler();
  }

  createPool() {
    if (!this.pool) {
      this.pool = mariadb.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectionLimit: 5,
        acquireTimeout: 30000,
        idleTimeout: 60000,
        connectTimeout: 10000,
        multipleStatements: true,
        // Add connection validation
        testOnBorrow: true,
        testOnReturn: true,
        // Retry strategy
        connectionRetries: 3,
        connectionRetryDelay: 1000,
      });

      // Setup connection error handler
      this.pool.on('connection', (connection) => {
        connection.on('error', async (err) => {
          console.error('Database connection error:', err);
          if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            await this.cleanupPool();
          }
        });
      });
    }
    return this.pool;
  }

  setupShutdownHandler() {
    // Handle shutdown gracefully
    const cleanup = async () => {
      if (this.isShuttingDown) return;
      this.isShuttingDown = true;

      try {
        await this.cleanupPool();
      } catch (err) {
        console.error('Error during cleanup:', err);
        process.exit(1);
      }

      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('uncaughtException', async (err) => {
      console.error('Uncaught exception:', err);
      await cleanup();
    });
  }

  async cleanupPool() {
    if (this.pool) {
      try {
        await this.pool.end();
        this.pool = null;
      } catch (err) {
        console.error('Error closing pool:', err);
        throw err;
      }
    }
  }

  async getConnection() {
    const pool = this.createPool();
    try {
      const connection = await pool.getConnection();
      return connection;
    } catch (err) {
      console.error('Error getting connection:', err);
      throw err;
    }
  }

  async query(sql, params) {
    let conn;
    try {
      conn = await this.getConnection();
      const result = await conn.query(sql, params);
      return result;
    } catch (err) {
      console.error('Database query error:', err);
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

  async transaction(callback) {
    let conn;
    try {
      conn = await this.getConnection();
      await conn.beginTransaction();

      const result = await callback(conn);
      await conn.commit();

      return result;
    } catch (err) {
      if (conn) {
        try {
          await conn.rollback();
        } catch (rollbackErr) {
          console.error('Error rolling back transaction:', rollbackErr);
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

  async getPoolStatus() {
    if (!this.pool) return null;

    try {
      return {
        totalConnections: this.pool.totalConnections(),
        activeConnections: this.pool.activeConnections(),
        idleConnections: this.pool.idleConnections(),
        taskQueueSize: this.pool.taskQueueSize(),
      };
    } catch (err) {
      console.error('Error getting pool status:', err);
      return null;
    }
  }
}

// Create a singleton instance
const databasePool = new DatabasePool();

// Export singleton methods
export const query = (...args) => databasePool.query(...args);
export const transaction = (...args) => databasePool.transaction(...args);
export const getPoolStatus = () => databasePool.getPoolStatus();
export const cleanupPool = () => databasePool.cleanupPool();

// For development hot reloading cleanup
if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.dispose(async () => {
      await databasePool.cleanupPool();
    });
  }
}
