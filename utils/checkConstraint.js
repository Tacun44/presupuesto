// Script para verificar las restricciones en la tabla Providers
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

async function checkConstraints() {
  let pool;
  
  try {
    console.log('Conectando a la base de datos...');
    pool = await sql.connect(config);
    console.log('Conexión establecida');
    
    // Consultar las restricciones de la tabla Providers
    const result = await pool.request().query(`
      SELECT 
        con.name AS constraint_name,
        col.name AS column_name,
        con.definition AS constraint_definition
      FROM 
        sys.check_constraints con
      INNER JOIN 
        sys.columns col ON con.parent_column_id = col.column_id
        AND con.parent_object_id = col.object_id
      WHERE 
        OBJECT_NAME(con.parent_object_id) = 'Providers'
    `);
    
    console.log('Restricciones en la tabla dbo.Providers:');
    console.table(result.recordset);
    
    // También obtener algunos registros existentes para ver ejemplos
    console.log('Consultando registros existentes para ver ejemplos...');
    const examples = await pool.request().query(`
      SELECT TOP 5 * FROM dbo.Providers
    `);
    
    if (examples.recordset.length > 0) {
      console.log('Ejemplos de registros existentes:');
      console.table(examples.recordset);
    } else {
      console.log('No hay registros existentes en la tabla Providers');
    }
    
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
checkConstraints(); 