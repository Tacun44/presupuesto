// Script para verificar la estructura de la tabla dbo.Taxes
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

async function checkTaxesTable() {
  let pool;
  
  try {
    console.log('Conectando a la base de datos...');
    pool = await sql.connect(config);
    console.log('Conexión establecida');
    
    // Consultar las columnas de la tabla dbo.Taxes
    const result = await pool.request().query(`
      SELECT 
        COLUMN_NAME, 
        DATA_TYPE, 
        CHARACTER_MAXIMUM_LENGTH,
        IS_NULLABLE
      FROM 
        INFORMATION_SCHEMA.COLUMNS
      WHERE 
        TABLE_NAME = 'Taxes'
      ORDER BY 
        ORDINAL_POSITION
    `);
    
    console.log('Columnas de la tabla dbo.Taxes:');
    console.table(result.recordset);
    
    // Consultar restricciones en la tabla Taxes
    const constraints = await pool.request().query(`
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
        OBJECT_NAME(con.parent_object_id) = 'Taxes'
    `);
    
    console.log('Restricciones en la tabla dbo.Taxes:');
    console.table(constraints.recordset);
    
    // Intentar obtener algunos registros existentes
    console.log('Consultando registros existentes para ver ejemplos...');
    const examples = await pool.request().query(`
      SELECT TOP 5 * FROM dbo.Taxes
    `);
    
    if (examples.recordset.length > 0) {
      console.log('Ejemplos de registros existentes:');
      console.table(examples.recordset);
    } else {
      console.log('No hay registros existentes en la tabla Taxes');
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
checkTaxesTable(); 