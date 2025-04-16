// Script para verificar los nombres exactos de las columnas
const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'D3v3l0p3r2025$',
  server: '205.209.122.84',
  port: 1437,
  database: 'Presupuesto',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function checkTableColumns() {
  let pool;
  
  try {
    console.log('Conectando a la base de datos...');
    pool = await sql.connect(config);
    console.log('Conexión establecida');
    
    // Consultar las columnas de la tabla dbo.Providers
    const result = await pool.request().query(`
      SELECT 
        COLUMN_NAME, 
        DATA_TYPE, 
        CHARACTER_MAXIMUM_LENGTH,
        IS_NULLABLE
      FROM 
        INFORMATION_SCHEMA.COLUMNS
      WHERE 
        TABLE_NAME = 'Providers'
      ORDER BY 
        ORDINAL_POSITION
    `);
    
    console.log('Columnas de la tabla dbo.Providers:');
    console.table(result.recordset);
    
    // También obtener información de todas las tablas
    const tables = await pool.request().query(`
      SELECT 
        TABLE_NAME
      FROM 
        INFORMATION_SCHEMA.TABLES
      WHERE 
        TABLE_TYPE = 'BASE TABLE'
      ORDER BY 
        TABLE_NAME
    `);
    
    console.log('Tablas disponibles en la base de datos:');
    console.log(tables.recordset.map(t => t.TABLE_NAME).join(', '));
    
  } catch (err) {
    console.error('Error durante la verificación:');
    console.error('Mensaje:', err.message);
    console.error('Código:', err.code);
  } finally {
    if (pool) {
      console.log('Cerrando conexión...');
      await pool.close();
      console.log('Conexión cerrada');
    }
  }
}

// Ejecutar la verificación
checkTableColumns(); 