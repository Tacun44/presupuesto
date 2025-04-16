// Formulario para impuestos
const TaxForm = ({ onSuccess }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    type: 'iva',
    percentage: '',
    accountCode: '',
    description: ''
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Preparar datos para enviar
      const taxData = {
        ...formData,
        formType: 'tax',
        percentage: parseFloat(formData.percentage)
      };
      
      console.log('Enviando datos de impuesto:', taxData);
      
      // Verificar si la API está disponible
      if (!window.api || !window.api.submitForm) {
        throw new Error('API no disponible. Verifica la conexión con el servidor.');
      }
      
      // Enviar al API directamente
      const response = await window.api.submitForm(taxData);
      
      console.log('Impuesto enviado correctamente:', response);
      setSuccess(true);
      
      // Llamar al callback onSuccess si existe
      if (typeof onSuccess === 'function') {
        onSuccess(response);
      }
      
      // Limpiar formulario después de envío exitoso
      setFormData({
        name: '',
        type: 'iva',
        percentage: '',
        accountCode: '',
        description: ''
      });
    } catch (err) {
      console.error('Error al enviar el formulario:', err);
      setError(err.message || 'Ocurrió un error al enviar el formulario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tax-form-container">
      <h2>Crear Nuevo Impuesto</h2>
      
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          ¡Impuesto creado exitosamente!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ej: IVA 19%"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="type">Tipo *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="iva">IVA</option>
            <option value="reteiva">Retención IVA</option>
            <option value="reteica">Retención ICA</option>
            <option value="retefuente">Retención en la Fuente</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="percentage">Porcentaje *</label>
          <input
            type="number"
            id="percentage"
            name="percentage"
            value={formData.percentage}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            max="100"
            placeholder="Ej: 19"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="accountCode">Cuenta Contable *</label>
          <input
            type="text"
            id="accountCode"
            name="accountCode"
            value={formData.accountCode}
            onChange={handleChange}
            required
            placeholder="Ej: 2408"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Descripción del impuesto (opcional)"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isLoading} 
            className="submit-button"
          >
            {isLoading ? "Guardando..." : "Guardar Impuesto"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Exportar el componente
window.TaxForm = TaxForm; 