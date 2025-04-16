// Database connection utility for SQL Server

const sql = require('mssql');

// Database configuration
const dbConfig = {
  server: '205.209.122.84',
  port: 1437,
  user: 'sa',
  password: 'D3v3l0p3r2025$',
  database: 'Presupuesto',
  options: {
    encrypt: false, // Cambiado a false para solucionar problemas de conexión
    trustServerCertificate: true,
    enableArithAbort: true
  },
  connectionTimeout: 60000, // Aumentado a 60 segundos
  requestTimeout: 60000,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Create a connection pool
let pool;

/**
 * Initialize the database connection pool
 */
async function initializeDb() {
  try {
    console.log('Intentando conectar a la base de datos...');
    console.log(`Servidor: ${dbConfig.server}, Puerto: ${dbConfig.port}, DB: ${dbConfig.database}`);
    
    if (pool) {
      console.log('Cerrando conexión anterior...');
      await pool.close();
    }
    
    pool = await sql.connect(dbConfig);
    console.log('Conexión a la base de datos establecida exitosamente');
    return pool;
  } catch (err) {
    console.error('Error de conexión a la base de datos:', err);
    console.error('Detalles del error:', JSON.stringify({
      message: err.message,
      code: err.code,
      number: err.number,
      state: err.state,
      class: err.class,
      serverName: err.serverName,
      procName: err.procName,
      lineNumber: err.lineNumber
    }, null, 2));
    throw err;
  }
}

/**
 * Execute a SQL query with parameters
 * @param {string} query - SQL query to execute
 * @param {Object} params - Parameters for the query
 * @returns {Promise<Array>} - Query results
 */
async function executeQuery(query, params = {}) {
  try {
    if (!pool) {
      await initializeDb();
    }
    
    const request = pool.request();
    
    // Add parameters to the request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
    
    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('Query execution failed:', err);
    throw err;
  }
}

/**
 * Execute a stored procedure with parameters
 * @param {string} procedureName - Stored procedure name
 * @param {Object} params - Parameters for the stored procedure
 * @returns {Promise<Array>} - Procedure results
 */
async function executeStoredProcedure(procedureName, params = {}) {
  try {
    if (!pool) {
      await initializeDb();
    }
    
    const request = pool.request();
    
    // Add parameters to the request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
    
    const result = await request.execute(procedureName);
    return result.recordset;
  } catch (err) {
    console.error('Stored procedure execution failed:', err);
    throw err;
  }
}

/**
 * Close the database connection pool
 */
async function closePool() {
  try {
    if (pool) {
      await pool.close();
      console.log('Database connection pool closed');
    }
  } catch (err) {
    console.error('Error closing database connection pool:', err);
    throw err;
  }
}

module.exports = {
  initializeDb,
  executeQuery,
  executeStoredProcedure,
  closePool,
  sql // Export sql for direct access if needed
}; 