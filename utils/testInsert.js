// Script para probar la inserción de un proveedor con los nombres de columnas correctos
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
      name: 'Proveedor de Prueba 2',
      taxId: '987654321',
      address: 'Avenida Principal 456',
      phone: '555-5678',
      email: 'prueba2@proveedor.com',
      contact: 'María Prueba',
      type: 'juridica',
      regime: 'comun',
      observations: 'Este es un proveedor de prueba'
    };
    
    console.log('Intentando insertar proveedor de prueba:', provider);
    
    // Intentar insertar en la tabla dbo.Providers con los nombres de columnas correctos
    const result = await pool.request()
      .input('id', sql.Int, 100) // Proporcionar un ID para la inserción
      .input('name', sql.NVarChar, provider.name)
      .input('taxId', sql.NVarChar, provider.taxId)
      .input('address', sql.NVarChar, provider.address)
      .input('phone', sql.NVarChar, provider.phone)
      .input('email', sql.NVarChar, provider.email)
      .input('contact', sql.NVarChar, provider.contact)
      .input('type', sql.NVarChar, provider.type)
      .input('regime', sql.NVarChar, provider.regime)
      .input('observations', sql.NVarChar, provider.observations)
      .query(`
        INSERT INTO dbo.Providers (id, name, taxId, address, phone, email, contact, type, regime, observations)
        VALUES (@id, @name, @taxId, @address, @phone, @email, @contact, @type, @regime, @observations);
        SELECT @id AS id;
      `);
    
    console.log('Proveedor insertado correctamente con ID:', result.recordset[0].id);
    
    // Verificar que se insertó correctamente
    const verification = await pool.request()
      .input('id', sql.Int, result.recordset[0].id)
      .query('SELECT * FROM dbo.Providers WHERE id = @id');
    
    console.log('Datos del proveedor insertado:');
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
testProviderInsert(); 