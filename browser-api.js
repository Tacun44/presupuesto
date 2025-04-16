// API para el navegador (sin depender de módulos Node.js)
(function() {
  console.log('Inicializando API para el navegador...');
  
  // Función para realizar peticiones HTTP
  async function fetchAPI(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en la petición:', error);
      throw error;
    }
  }
  
  // API de impuestos
  const taxesAPI = {
    // Obtener todos los impuestos
    getTaxes: async function() {
      try {
        console.log('Obteniendo impuestos...');
        const taxes = await fetchAPI('/api/taxes');
        console.log(`Se encontraron ${taxes.length} impuestos`);
        return taxes;
      } catch (error) {
        console.error('Error al obtener impuestos:', error);
        // Si hay un error, intentar usar datos de prueba
        console.log('Intentando usar datos de prueba para impuestos');
        return window.mockTaxes || [];
      }
    },
    
    // Crear un nuevo impuesto
    createTax: async function(taxData) {
      try {
        console.log('Creando nuevo impuesto:', taxData);
        return await fetchAPI('/api/taxes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(taxData)
        });
      } catch (error) {
        console.error('Error al crear impuesto:', error);
        throw error;
      }
    },
    
    // Actualizar un impuesto existente
    updateTax: async function(id, taxData) {
      try {
        console.log(`Actualizando impuesto ${id}:`, taxData);
        return await fetchAPI(`/api/taxes/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(taxData)
        });
      } catch (error) {
        console.error('Error al actualizar impuesto:', error);
        throw error;
      }
    },
    
    // Eliminar un impuesto
    deleteTax: async function(id) {
      try {
        console.log(`Eliminando impuesto ${id}`);
        return await fetchAPI(`/api/taxes/${id}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error al eliminar impuesto:', error);
        throw error;
      }
    },
    
    // Enviar un formulario genérico
    submitForm: async function(formData) {
      try {
        console.log('Enviando formulario:', formData);
        return await fetchAPI('/api/submit-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      } catch (error) {
        console.error('Error al enviar formulario:', error);
        throw error;
      }
    }
  };
  
  // Exponer la API como objeto global
  window.api = {
    // Funciones de impuestos
    getTaxes: taxesAPI.getTaxes,
    createTax: taxesAPI.createTax,
    updateTax: taxesAPI.updateTax,
    deleteTax: taxesAPI.deleteTax,
    
    // Función genérica de formulario
    submitForm: taxesAPI.submitForm
  };
  
  console.log('API inicializada correctamente. Funciones disponibles:', Object.keys(window.api));
})(); 