// Script para probar la inserción de un registro de proveedor
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

async function testProviderInsert() {
  let pool;
  
  try {
    console.log('Conectando a la base de datos...');
    pool = await sql.connect(config);
    console.log('Conexión establecida');
    
    // Datos de prueba
    const provider = {
      Name: 'Proveedor de Prueba',
      NIT: '123456789',
      Address: 'Calle Principal 123',
      Phone: '555-1234',
      Email: 'prueba@proveedor.com',
      ContactPerson: 'Juan Prueba'
    };
    
    console.log('Intentando insertar proveedor de prueba:', provider);
    
    // Intentar insertar en la tabla dbo.Providers
    const result = await pool.request()
      .input('name', sql.NVarChar, provider.Name)
      .input('nit', sql.NVarChar, provider.NIT)
      .input('address', sql.NVarChar, provider.Address)
      .input('phone', sql.NVarChar, provider.Phone)
      .input('email', sql.NVarChar, provider.Email)
      .input('contactPerson', sql.NVarChar, provider.ContactPerson)
      .query(`
        INSERT INTO dbo.Providers (Name, NIT, Address, Phone, Email, ContactPerson)
        VALUES (@name, @nit, @address, @phone, @email, @contactPerson);
        SELECT SCOPE_IDENTITY() AS id;
      `);
    
    console.log('Proveedor insertado correctamente con ID:', result.recordset[0].id);
    
    // Verificar que se insertó correctamente
    const verification = await pool.request()
      .input('id', sql.Int, result.recordset[0].id)
      .query('SELECT * FROM dbo.Providers WHERE ID = @id');
    
    console.log('Datos del proveedor insertado:');
    console.log(verification.recordset[0]);
    
  } catch (err) {
    console.error('Error durante la prueba:');
    console.error('Mensaje:', err.message);
    console.error('Código:', err.code);
    
    if (err.number) {
      console.error('Número de error SQL:', err.number);
    }
    
    if (err.lineNumber) {
      console.error('Línea del error:', err.lineNumber);
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
testProviderInsert(); 