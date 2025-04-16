// Componente Modal
const Modal = ({ show, onHide, title, children }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onHide}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Subcomponente Modal.Header
Modal.Header = ({ closeButton, children }) => (
  <div className="modal-header">
    {children}
    {closeButton && <button className="modal-close" onClick={closeButton}>×</button>}
  </div>
);

// Subcomponente Modal.Title
Modal.Title = ({ children }) => (
  <h3 className="modal-title">{children}</h3>
);

// Subcomponente Modal.Body
Modal.Body = ({ children }) => (
  <div className="modal-body">
    {children}
  </div>
);

// Subcomponente Modal.Footer
Modal.Footer = ({ children }) => (
  <div className="modal-footer">
    {children}
  </div>
);

// Exportar el componente
window.Modal = Modal; 