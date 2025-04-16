// Script para probar la inserción de un impuesto
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

async function testTaxInsert() {
  let pool;
  
  try {
    console.log('Conectando a la base de datos...');
    pool = await sql.connect(config);
    console.log('Conexión establecida');
    
    // Datos de prueba que coinciden con la estructura de la tabla
    const tax = {
      id: 1001, // Generamos un ID aleatorio
      name: 'IVA 19%',
      type: 'iva', // Valor válido según la restricción
      percentage: 19.0,
      accountCode: '2408',
      description: 'Impuesto al valor agregado'
    };
    
    console.log('Intentando insertar impuesto de prueba:', tax);
    
    // Intentar insertar en la tabla dbo.Taxes con los nombres correctos de columnas
    const result = await pool.request()
      .input('id', sql.Int, tax.id)
      .input('name', sql.VarChar(100), tax.name)
      .input('type', sql.VarChar(20), tax.type)
      .input('percentage', sql.Decimal(10, 2), tax.percentage)
      .input('accountCode', sql.VarChar(50), tax.accountCode)
      .input('description', sql.VarChar(500), tax.description)
      .query(`
        INSERT INTO dbo.Taxes (id, name, type, percentage, accountCode, description)
        VALUES (@id, @name, @type, @percentage, @accountCode, @description);
        SELECT @id AS id;
      `);
    
    console.log('Impuesto insertado correctamente con ID:', result.recordset[0].id);
    
    // Verificar que se insertó correctamente
    const verification = await pool.request()
      .input('id', sql.Int, result.recordset[0].id)
      .query('SELECT * FROM dbo.Taxes WHERE id = @id');
    
    console.log('Datos del impuesto insertado:');
    console.log(verification.recordset[0]);
    
  } catch (err) {
    console.error('Error durante la prueba:');
    console.error('Mensaje:', err.message);
    console.error('Código:', err.code);
    
    if (err.number) {
      console.error('Número de error SQL:', err.number);
    }
  } finally {
    if (pool) {
      console.log('Cerrando conexión...');
      await pool.close();
      console.log('Conexión cerrada');
    }
  }
}

// Ejecutar la prueba
testTaxInsert(); 