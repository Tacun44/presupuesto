// Taxes.js - Página de Impuestos y Gravámenes
const Taxes = () => {
  const [taxes, setTaxes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [showForm, setShowForm] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  // Obtener todos los impuestos
  React.useEffect(() => {
    fetchTaxes();
  }, []);

  // Función para obtener los impuestos
  const fetchTaxes = async () => {
    try {
      setLoading(true);
      console.log('Intentando obtener impuestos...');
      
      // Verificar si la API está disponible
      if (!window.api || !window.api.getTaxes) {
        throw new Error('API no disponible. Verifica la conexión con el servidor.');
      }
      
      const data = await window.api.getTaxes();
      console.log('Impuestos recibidos:', data);
      setTaxes(data || []);
      setError(null);
    } catch (err) {
      console.error('Error al obtener los impuestos:', err);
      setError('No se pudieron cargar los impuestos. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar la lista de impuestos después de agregar uno nuevo
  const refreshTaxes = async () => {
    await fetchTaxes();
  };

  // Función para manejar el envío exitoso del formulario
  const handleFormSuccess = async (response) => {
    console.log('Formulario enviado con éxito:', response);
    // Cerrar el formulario
    setShowForm(false);
    // Refrescar la lista de impuestos
    await refreshTaxes();
  };

  // Función para formatear el tipo de impuesto
  const formatTaxType = (type) => {
    const types = {
      iva: 'IVA',
      reteiva: 'Retención IVA',
      reteica: 'Retención ICA',
      retefuente: 'Retención en la Fuente'
    };
    return types[type] || type;
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  
  return (
    <div className="taxes-page">
      <div className="page-header">
        <h1>Impuestos y Gravámenes</h1>
        <button 
          className="btn-primary"
          onClick={handleOpenModal}
        >
          <i className="fas fa-plus"></i> Nuevo Impuesto
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn-small"
            onClick={refreshTaxes}
            style={{ marginLeft: '10px' }}
          >
            Reintentar
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <span className="loading-spinner"></span>
          <p>Cargando impuestos...</p>
        </div>
      ) : (
        <div className="taxes-table-container">
          <table className="taxes-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Porcentaje</th>
                <th>Cuenta Contable</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {taxes.length > 0 ? (
                taxes.map((tax) => (
                  <tr key={tax.id}>
                    <td>{tax.name}</td>
                    <td>{formatTaxType(tax.type)}</td>
                    <td>{tax.percentage}%</td>
                    <td>{tax.accountCode}</td>
                    <td>
                      <button className="btn-small btn-edit" title="Editar">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn-small btn-delete" title="Eliminar">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No hay impuestos registrados aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Nuevo Impuesto</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <TaxForm onSuccess={(response) => {
                handleCloseModal();
                refreshTaxes();
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Exportar el componente
window.Taxes = Taxes; 