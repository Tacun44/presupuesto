// DatabaseForm.js - A form component that submits data to SQL Server
const DatabaseForm = ({ formId, title, fields, onSubmit, submitButtonText = 'Submit' }) => {
  const [formData, setFormData] = React.useState({});
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
      // Call the provided onSubmit handler with the form data
      await onSubmit(formData);
      setSuccess(true);
      // Reset form after successful submission
      setFormData({});
    } catch (err) {
      setError(err.message || 'An error occurred while submitting the form');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{title}</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Form submitted successfully!</div>}
      
      <form id={formId} onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder}
                rows={field.rows || 4}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
              >
                <option value="">Select an option</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
                step={field.step}
              />
            )}
          </div>
        ))}
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isLoading} 
            className="submit-button"
          >
            {isLoading ? <LoadingSpinner size="small" /> : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}; 