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

console.log('Verificando estructura de la tabla dbo.Taxes...');

// Intentar la conexión
sql.connect(config).then(() => {
  console.log('Conexión establecida correctamente');
  
  // Consultar la estructura de la tabla dbo.Taxes
  return sql.query(`
    SELECT column_name, data_type, character_maximum_length
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'Taxes'
    ORDER BY ORDINAL_POSITION
  `);
})
.then(result => {
  console.log('Estructura de la tabla dbo.Taxes:');
  console.log(result.recordset);
  
  // También verificar si existen valores en la tabla
  return sql.query('SELECT TOP 5 * FROM dbo.Taxes');
})
.then(result => {
  console.log('Primeros 5 registros de impuestos:');
  console.log(result.recordset);
  
  // Cerrar la conexión
  return sql.close();
})
.then(() => {
  console.log('Verificación completada');
})
.catch(err => {
  console.error('Error durante la verificación:');
  console.error('Mensaje:', err.message);
  
  // Intentar cerrar la conexión
  sql.close().catch(() => {
    console.log('No se pudo cerrar la conexión');
  });
}); 