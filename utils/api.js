// API client for integration with backend services
const API_BASE_URL = '/api'; // Cambiado a ruta relativa para que funcione en localhost
const db = require('./db');

// Flag to toggle between mock data and real database
const USE_DATABASE = false; // Cambiado a false para usar las llamadas reales a la API

async function fetchWithAuth(endpoint, options = {}) {
    try {
        // If using the database and not making a real API call
        if (USE_DATABASE) {
            // Database handlers for different endpoints
            if (endpoint === '/budget/structure') {
                return await db.executeQuery('SELECT * FROM dbo.Budget_Structure');
            }

            if (endpoint === '/budget/items') {
                return await db.executeQuery('SELECT * FROM dbo.Budget_Structure');
            }

            if (endpoint === '/puc-accounts') {
                return await db.executeQuery('SELECT * FROM dbo.PUC_Accounts');
            }

            if (endpoint === '/taxes') {
                return await db.executeQuery('SELECT * FROM dbo.Taxes');
            }

            if (endpoint === '/providers') {
                return await db.executeQuery('SELECT * FROM dbo.Providers');
            }

            if (endpoint.startsWith('/budget/values/')) {
                const year = endpoint.split('/').pop();
                return await db.executeQuery('SELECT * FROM dbo.Budget_Structure WHERE Year = @year', { year });
            }

            if (endpoint === '/cdps') {
                return await db.executeQuery('SELECT * FROM dbo.CDPs');
            }

            if (endpoint === '/rps') {
                return await db.executeQuery('SELECT * FROM dbo.RPs');
            }

            if (endpoint === '/ops') {
                return await db.executeQuery('SELECT * FROM dbo.OPs');
            }

            if (endpoint === '/payments') {
                return await db.executeQuery('SELECT * FROM dbo.Payments');
            }

            // Handle POST, PUT, DELETE operations
            if (options.method === 'POST') {
                const body = JSON.parse(options.body);
                
                if (endpoint === '/submit-form') {
                    // Generic form submission handler
                    return await handleFormSubmission(body);
                }
                
                // Other POST operations
                if (endpoint === '/budget/structure') {
                    return await createBudgetNode(body);
                }
                
                if (endpoint === '/puc-accounts') {
                    return await createPUCAccount(body);
                }
                
                // Add more POST handlers as needed
            }
            
            if (options.method === 'PUT') {
                const body = JSON.parse(options.body);
                const id = endpoint.split('/').pop();
                
                if (endpoint.startsWith('/budget/structure/')) {
                    return await updateBudgetNode(id, body);
                }
                
                // Add more PUT handlers as needed
            }
            
            if (options.method === 'DELETE') {
                const id = endpoint.split('/').pop();
                
                if (endpoint.startsWith('/budget/structure/')) {
                    return await deleteBudgetNode(id);
                }
                
                // Add more DELETE handlers as needed
            }
        }

        // Fall back to mock data simulation for development if API call fails
        // but only if endpoint is GET and not a form submission
        const isFallbackAllowed = !options.method || options.method === 'GET';
        
        try {
            // Try to make the real API call first
            console.log(`Realizando llamada a API: ${API_BASE_URL}${endpoint}`);
            
            const token = localStorage.getItem('authToken');
            const defaultHeaders = {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            };

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...defaultHeaders,
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Respuesta de API recibida para ${endpoint}:`, data);
            return data;
        } catch (apiError) {
            console.error(`Error en llamada a API ${endpoint}:`, apiError);
            
            // Si la llamada real falla y es permitido el fallback, usar datos mock
            if (isFallbackAllowed) {
                console.log(`Intentando usar datos mock para ${endpoint}`);
                
                if (endpoint === '/budget/structure') {
                    return window.mockBudgetStructure || [];
                }

                if (endpoint === '/budget/items') {
                    return window.mockBudgetItems || [];
                }

                if (endpoint === '/puc-accounts') {
                    return window.mockPUCAccounts || [];
                }

                if (endpoint === '/taxes') {
                    console.log('Usando datos mock para impuestos');
                    return window.mockTaxes || [];
                }

                if (endpoint === '/providers') {
                    return window.mockProviders || [];
                }

                if (endpoint.startsWith('/budget/values/')) {
                    const year = endpoint.split('/').pop();
                    return window.mockBudgetData ? (window.mockBudgetData[year] || { status: 'draft', values: {} }) : { status: 'draft', values: {} };
                }

                if (endpoint === '/cdps') {
                    return window.mockCDPs || [];
                }

                if (endpoint === '/rps') {
                    return window.mockRPs || [];
                }

                if (endpoint === '/ops') {
                    return window.mockOPs || [];
                }

                if (endpoint === '/payments') {
                    return window.mockPayments || [];
                }
            }
            
            // Si no hay fallback permitido o no hay datos mock, reenviar el error
            throw apiError;
        }
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Database operation handlers
async function handleFormSubmission(formData) {
    try {
        // Generic form submission handler that inserts data into appropriate table
        if (formData.formType === 'provider') {
            // Necesitamos un id para la inserción ya que no es autoincremental
            // Generamos un ID aleatorio entre 1000 y 9999
            const providerId = Math.floor(Math.random() * 9000) + 1000;
            
            return await db.executeQuery(`
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
        }
        
        if (formData.formType === 'budget') {
            // Handle budget form submission
            return await db.executeQuery(`
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
        }
        
        if (formData.formType === 'tax') {
            // Generamos un ID aleatorio entre 1000 y 9999
            const taxId = Math.floor(Math.random() * 9000) + 1000;
            
            // Verificar que el tipo sea uno de los permitidos
            const allowedTypes = ['iva', 'reteiva', 'reteica', 'retefuente'];
            if (!allowedTypes.includes(formData.type)) {
                throw new Error(`El tipo de impuesto debe ser uno de: ${allowedTypes.join(', ')}`);
            }
            
            return await db.executeQuery(`
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
        }
        
        // Add more form handlers as needed
        
        throw new Error('Tipo de formulario no soportado');
    } catch (error) {
        console.error('Error en el envío del formulario:', error);
        throw error;
    }
}

async function createBudgetNode(data) {
    try {
        return await db.executeQuery(`
            INSERT INTO dbo.Budget_Structure (Code, Name, ParentId, Level, IsActive)
            VALUES (@code, @name, @parentId, @level, @isActive);
            SELECT SCOPE_IDENTITY() AS id;
        `, {
            code: data.code,
            name: data.name,
            parentId: data.parentId,
            level: data.level,
            isActive: data.isActive || true
        });
    } catch (error) {
        console.error('Error al crear nodo de presupuesto:', error);
        throw error;
    }
}

async function updateBudgetNode(id, data) {
    try {
        return await db.executeQuery(`
            UPDATE dbo.Budget_Structure
            SET Code = @code, Name = @name, ParentId = @parentId, Level = @level, IsActive = @isActive
            WHERE Id = @id;
            SELECT * FROM dbo.Budget_Structure WHERE Id = @id;
        `, {
            id: id,
            code: data.code,
            name: data.name,
            parentId: data.parentId,
            level: data.level,
            isActive: data.isActive
        });
    } catch (error) {
        console.error('Error al actualizar nodo de presupuesto:', error);
        throw error;
    }
}

async function deleteBudgetNode(id) {
    try {
        return await db.executeQuery(`
            UPDATE dbo.Budget_Structure SET IsActive = 0 WHERE Id = @id;
        `, {
            id: id
        });
    } catch (error) {
        console.error('Error al eliminar nodo de presupuesto:', error);
        throw error;
    }
}

async function createPUCAccount(data) {
    try {
        return await db.executeQuery(`
            INSERT INTO dbo.PUC_Accounts (Code, Name, Description, Type, IsActive)
            VALUES (@code, @name, @description, @type, @isActive);
            SELECT SCOPE_IDENTITY() AS id;
        `, {
            code: data.code,
            name: data.name,
            description: data.description,
            type: data.type,
            isActive: data.isActive || true
        });
    } catch (error) {
        console.error('Error al crear cuenta PUC:', error);
        throw error;
    }
}

// Función para obtener todos los impuestos
async function getTaxes() {
  try {
    console.log('Obteniendo impuestos desde la base de datos...');
    const taxes = await db.executeQuery('SELECT * FROM dbo.Taxes');
    console.log(`Se encontraron ${taxes.length} impuestos`);
    return taxes;
  } catch (error) {
    console.error('Error al obtener impuestos:', error);
    // Si hay un error, intentar usar datos de prueba
    console.log('Intentando usar datos de prueba para impuestos');
    return window.mockTaxes || [];
  }
}

// Función para crear un impuesto
async function createTax(taxData) {
  try {
    console.log('Creando nuevo impuesto:', taxData);
    
    // Verificar que el tipo sea uno de los permitidos
    const allowedTypes = ['iva', 'reteiva', 'reteica', 'retefuente'];
    if (!allowedTypes.includes(taxData.type)) {
      throw new Error(`El tipo de impuesto debe ser uno de: ${allowedTypes.join(', ')}`);
    }
    
    // Generamos un ID aleatorio entre 1000 y 9999
    const taxId = Math.floor(Math.random() * 9000) + 1000;
    
    const result = await db.executeQuery(`
      INSERT INTO dbo.Taxes (id, name, type, percentage, accountCode, description)
      VALUES (@id, @name, @type, @percentage, @accountCode, @description);
      SELECT @id AS id;
    `, {
      id: taxId,
      name: taxData.name,
      type: taxData.type,
      percentage: taxData.percentage,
      accountCode: taxData.accountCode,
      description: taxData.description || ''
    });
    
    console.log('Impuesto creado exitosamente:', result);
    return { success: true, id: taxId };
  } catch (error) {
    console.error('Error al crear impuesto:', error);
    throw error;
  }
}

// Función para actualizar un impuesto
async function updateTax(id, taxData) {
  try {
    console.log(`Actualizando impuesto ${id}:`, taxData);
    
    const result = await db.executeQuery(`
      UPDATE dbo.Taxes 
      SET name = @name, 
          type = @type, 
          percentage = @percentage, 
          accountCode = @accountCode, 
          description = @description
      WHERE id = @id;
      SELECT * FROM dbo.Taxes WHERE id = @id;
    `, {
      id: id,
      name: taxData.name,
      type: taxData.type,
      percentage: taxData.percentage,
      accountCode: taxData.accountCode,
      description: taxData.description || ''
    });
    
    console.log('Impuesto actualizado exitosamente:', result);
    return { success: true, id: id };
  } catch (error) {
    console.error('Error al actualizar impuesto:', error);
    throw error;
  }
}

// Función para eliminar un impuesto
async function deleteTax(id) {
  try {
    console.log(`Eliminando impuesto ${id}`);
    
    const result = await db.executeQuery(`
      DELETE FROM dbo.Taxes WHERE id = @id;
    `, {
      id: id
    });
    
    console.log('Impuesto eliminado exitosamente');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar impuesto:', error);
    throw error;
  }
}

// Función para enviar un formulario genérico
async function submitForm(formData) {
  try {
    console.log('Procesando formulario:', formData);
    
    if (formData.formType === 'tax') {
      return await createTax(formData);
    } 
    else if (formData.formType === 'provider') {
      // Lógica para proveedores
      // ...
    }
    else if (formData.formType === 'budget') {
      // Lógica para presupuesto
      // ...
    }
    else {
      throw new Error('Tipo de formulario no soportado');
    }
  } catch (error) {
    console.error('Error al procesar formulario:', error);
    throw error;
  }
}

// Make api object available globally
window.api = {
    // Taxes endpoints
    getTaxes,
    createTax,
    updateTax,
    deleteTax,
    
    // Form submission endpoint
    submitForm,
    
    // PUC Accounts endpoints
    getPUCAccounts: () => fetchWithAuth('/puc-accounts'),
    createPUCAccount: (data) => fetchWithAuth('/puc-accounts', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updatePUCAccount: (id, data) => fetchWithAuth(`/puc-accounts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    deletePUCAccount: (id) => fetchWithAuth(`/puc-accounts/${id}`, {
        method: 'DELETE'
    }),

    // Providers endpoints
    getProviders: () => fetchWithAuth('/providers'),
    createProvider: (data) => fetchWithAuth('/providers', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateProvider: (id, data) => fetchWithAuth(`/providers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    deleteProvider: (id) => fetchWithAuth(`/providers/${id}`, {
        method: 'DELETE'
    }),

    // Budget Structure endpoints
    getBudgetStructure: () => fetchWithAuth('/budget/structure'),
    createBudgetNode: (data) => fetchWithAuth('/budget/structure', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateBudgetNode: (id, data) => fetchWithAuth(`/budget/structure/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    deleteBudgetNode: (id) => fetchWithAuth(`/budget/structure/${id}`, {
        method: 'DELETE'
    }),

    // Budget Items endpoints
    getBudgetItems: () => fetchWithAuth('/budget/items'),
    createBudgetItem: (data) => fetchWithAuth('/budget/items', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateBudgetItem: (id, data) => fetchWithAuth(`/budget/items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    deleteBudgetItem: (id) => fetchWithAuth(`/budget/items/${id}`, {
        method: 'DELETE'
    }),

    // Budget Values endpoints
    getBudgetValues: (year) => fetchWithAuth(`/budget/values/${year}`),
    saveBudgetValues: (year, values) => fetchWithAuth(`/budget/values/${year}`, {
        method: 'POST',
        body: JSON.stringify(values)
    }),
    approveBudget: (year) => fetchWithAuth(`/budget/approve/${year}`, {
        method: 'POST'
    }),

    // CDP endpoints
    getCDPs: () => fetchWithAuth('/cdps'),
    createCDP: (data) => fetchWithAuth('/cdps', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateCDP: (id, data) => fetchWithAuth(`/cdps/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    approveCDP: (id) => fetchWithAuth(`/cdps/${id}/approve`, {
        method: 'POST'
    }),
    rejectCDP: (id, reason) => fetchWithAuth(`/cdps/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify(reason)
    }),
    cancelCDP: (id) => fetchWithAuth(`/cdps/${id}/cancel`, {
        method: 'POST'
    }),

    // RP endpoints
    getRPs: () => fetchWithAuth('/rps'),
    createRP: (data) => fetchWithAuth('/rps', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateRP: (id, data) => fetchWithAuth(`/rps/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    approveRP: (id) => fetchWithAuth(`/rps/${id}/approve`, {
        method: 'POST'
    }),
    rejectRP: (id, reason) => fetchWithAuth(`/rps/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify(reason)
    }),
    cancelRP: (id) => fetchWithAuth(`/rps/${id}/cancel`, {
        method: 'POST'
    }),

    // OP endpoints
    getOPs: () => fetchWithAuth('/ops'),
    createOP: (data) => fetchWithAuth('/ops', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateOP: (id, data) => fetchWithAuth(`/ops/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    approveOP: (id) => fetchWithAuth(`/ops/${id}/approve`, {
        method: 'POST'
    }),
    rejectOP: (id, reason) => fetchWithAuth(`/ops/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify(reason)
    }),

    // Payment endpoints
    getPayments: () => fetchWithAuth('/payments'),
    createPayment: (data) => fetchWithAuth('/payments', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updatePayment: (id, data) => fetchWithAuth(`/payments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    approvePayment: (id) => fetchWithAuth(`/payments/${id}/approve`, {
        method: 'POST'
    }),
    voidPayment: (id) => fetchWithAuth(`/payments/${id}/void`, {
        method: 'POST'
    })
};
