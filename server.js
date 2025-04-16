// server.js - Express server for Presupuesto application
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const db = require('./utils/db');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Initialize database connection
console.log('Iniciando la aplicación. Conectando a la base de datos...');
db.initializeDb()
  .then(() => {
    console.log('Conexión a la base de datos establecida');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
    console.error('Detalles del error:', JSON.stringify({
      message: err.message,
      code: err.code,
      number: err.number
    }, null, 2));
  });

// API Routes
// Generic form submission handler
app.post('/api/submit-form', async (req, res) => {
  try {
    console.log('Recibida petición de formulario:', JSON.stringify(req.body, null, 2));
    const formData = req.body;
    
    if (formData.formType === 'provider') {
      console.log('Procesando formulario de proveedor');
      
      // Verificar que los campos requeridos existen
      if (!formData.name || !formData.nit) {
        return res.status(400).json({ error: 'Faltan campos requeridos (nombre o NIT)' });
      }
      
      // Necesitamos un id para la inserción ya que no es autoincremental
      // Generamos un ID aleatorio entre 1000 y 9999
      const providerId = Math.floor(Math.random() * 9000) + 1000;
      
      const result = await db.executeQuery(`
        INSERT INTO dbo.Providers (id, name, taxId, address, phone, email, contact, type, regime, observations)
        VALUES (@id, @name, @taxId, @address, @phone, @email, @contact, @type, @regime, @observations);
        SELECT @id AS id;
      `, {
        id: providerId,
        name: formData.name,
        taxId: formData.nit, // Mapeo de nit a taxId
        address: formData.address || '',
        phone: formData.phone || '',
        email: formData.email || '',
        contact: formData.contactPerson || '', // Mapeo de contactPerson a contact
        type: formData.type || 'juridica', // Valores permitidos: 'natural' o 'juridica'
        regime: formData.regime || 'comun', // Valores permitidos: 'simplificado' o 'comun'
        observations: formData.observations || ''
      });
      
      console.log('Proveedor guardado exitosamente:', result);
      res.json({ success: true, id: providerId });
    } 
    else if (formData.formType === 'budget') {
      console.log('Procesando formulario de presupuesto');
      
      // Verificar que los campos requeridos existen
      if (!formData.code || !formData.name) {
        return res.status(400).json({ error: 'Faltan campos requeridos (código o nombre)' });
      }
      
      const result = await db.executeQuery(`
        INSERT INTO dbo.Budget_Structure (Code, Name, Description, Year, Amount)
        VALUES (@code, @name, @description, @year, @amount);
        SELECT SCOPE_IDENTITY() AS id;
      `, {
        code: formData.code,
        name: formData.name,
        description: formData.description || '',
        year: formData.year || new Date().getFullYear(),
        amount: formData.amount || 0
      });
      
      console.log('Presupuesto guardado exitosamente:', result);
      res.json({ success: true, id: result[0].id });
    } 
    else if (formData.formType === 'tax') {
      console.log('Procesando formulario de impuesto');
      
      // Verificar que los campos requeridos existen
      if (!formData.name || !formData.type || !formData.percentage || !formData.accountCode) {
        return res.status(400).json({ 
          error: 'Faltan campos requeridos (nombre, tipo, porcentaje o cuenta contable)' 
        });
      }
      
      // Verificar que el tipo sea uno de los permitidos
      const allowedTypes = ['iva', 'reteiva', 'reteica', 'retefuente'];
      if (!allowedTypes.includes(formData.type)) {
        return res.status(400).json({ 
          error: `El tipo de impuesto debe ser uno de: ${allowedTypes.join(', ')}` 
        });
      }
      
      // Generamos un ID aleatorio entre 1000 y 9999
      const taxId = Math.floor(Math.random() * 9000) + 1000;
      
      const result = await db.executeQuery(`
        INSERT INTO dbo.Taxes (id, name, type, percentage, accountCode, description)
        VALUES (@id, @name, @type, @percentage, @accountCode, @description);
        SELECT @id AS id;
      `, {
        id: taxId,
        name: formData.name,
        type: formData.type,
        percentage: formData.percentage,
        accountCode: formData.accountCode,
        description: formData.description || ''
      });
      
      console.log('Impuesto guardado exitosamente:', result);
      res.json({ success: true, id: taxId });
    } 
    else {
      console.log('Tipo de formulario no soportado:', formData.formType);
      res.status(400).json({ error: 'Tipo de formulario no soportado' });
    }
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    console.error('Detalles del error:', JSON.stringify({
      message: error.message,
      code: error.code,
      number: error.number,
      state: error.state,
      class: error.class,
      serverName: error.serverName,
      procName: error.procName,
      lineNumber: error.lineNumber
    }, null, 2));
    
    res.status(500).json({ 
      error: error.message || 'Error interno del servidor',
      details: {
        code: error.code,
        number: error.number
      }
    });
  }
});

// Get all providers
app.get('/api/providers', async (req, res) => {
  try {
    const providers = await db.executeQuery('SELECT * FROM dbo.Providers');
    res.json(providers);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
});

// Get all budget items
app.get('/api/budget/items', async (req, res) => {
  try {
    const budgetItems = await db.executeQuery('SELECT * FROM dbo.Budget_Structure');
    res.json(budgetItems);
  } catch (error) {
    console.error('Error al obtener elementos de presupuesto:', error);
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
});

// Get budget structure
app.get('/api/budget/structure', async (req, res) => {
  try {
    const budgetStructure = await db.executeQuery('SELECT * FROM dbo.Budget_Structure');
    res.json(budgetStructure);
  } catch (error) {
    console.error('Error al obtener estructura de presupuesto:', error);
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
});

// Get all taxes
app.get('/api/taxes', async (req, res) => {
  try {
    console.log('Recibida solicitud para obtener impuestos');
    const taxes = await db.executeQuery('SELECT * FROM dbo.Taxes');
    console.log('Impuestos obtenidos:', taxes.length);
    res.json(taxes);
  } catch (error) {
    console.error('Error al obtener impuestos:', error);
    console.error('Detalles del error:', JSON.stringify({
      message: error.message,
      code: error.code,
      number: error.number,
      state: error.state,
      class: error.class
    }, null, 2));
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
});

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
}); 