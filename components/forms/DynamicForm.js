function DynamicForm({ formConfig, onSubmit, initialData = {} }) {
    try {
        const [formData, setFormData] = React.useState(initialData || {});
        const [errors, setErrors] = React.useState({});

        React.useEffect(() => {
            setFormData(initialData || {});
        }, [initialData]);

        const handleChange = (field, value) => {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
            
            if (errors[field]) {
                setErrors(prev => ({
                    ...prev,
                    [field]: null
                }));
            }
        };

        const validateForm = () => {
            const newErrors = {};
            formConfig.fields.forEach(field => {
                if (field.required && !formData[field.name]) {
                    newErrors[field.name] = 'Este campo es requerido';
                }
                
                if (field.validation) {
                    const validationError = field.validation(formData[field.name]);
                    if (validationError) {
                        newErrors[field.name] = validationError;
                    }
                }
            });
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            
            if (validateForm()) {
                try {
                    await onSubmit(formData);
                    setFormData({});
                } catch (error) {
                    console.error('Form submission error:', error);
                    setErrors({ submit: 'Error al enviar el formulario' });
                }
            }
        };

        const renderField = (field) => {
            const value = formData[field.name] || '';
            const gridClass = field.span2 ? 'span-2' : '';

            const fieldContent = () => {
                switch (field.type) {
                    case 'text':
                    case 'number':
                    case 'email':
                        return (
                            <input
                                data-name={`input-${field.name}`}
                                type={field.type}
                                value={value}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                className={`form-input ${errors[field.name] ? 'border-red-500' : ''}`}
                                placeholder={field.placeholder}
                            />
                        );
                    
                    case 'select':
                        return (
                            <select
                                data-name={`select-${field.name}`}
                                value={value}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                className={`form-input ${errors[field.name] ? 'border-red-500' : ''}`}
                            >
                                <option value="">Seleccione una opción</option>
                                {field.options.map((option, index) => (
                                    <option key={index} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        );
                    
                    case 'textarea':
                        return (
                            <textarea
                                data-name={`textarea-${field.name}`}
                                value={value}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                className={`form-input ${errors[field.name] ? 'border-red-500' : ''}`}
                                rows={field.rows || 3}
                                placeholder={field.placeholder}
                            />
                        );
                    
                    default:
                        return null;
                }
            };

            return (
                <div key={field.name} className={`form-group ${gridClass}`}>
                    <label 
                        data-name={`label-${field.name}`}
                        className="form-label"
                    >
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {fieldContent()}
                    {errors[field.name] && (
                        <p data-name={`error-${field.name}`} className="form-error">
                            {errors[field.name]}
                        </p>
                    )}
                </div>
            );
        };

        return (
            <form data-name="dynamic-form" onSubmit={handleSubmit} className="form-container">
                <div className="form-grid">
                    {formConfig.fields.map(field => renderField(field))}
                </div>
                
                {errors.submit && (
                    <div data-name="form-error" className="text-red-500 mb-4 span-2">
                        {errors.submit}
                    </div>
                )}
                
                <div className="flex justify-end space-x-4 mt-6 span-2">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => onCancel?.()}
                    >
                        Cancelar
                    </button>
                    <button
                        data-name="submit-button"
                        type="submit"
                        className="btn-primary"
                    >
                        {formConfig.submitLabel || 'Guardar'}
                    </button>
                </div>
            </form>
        );
    } catch (error) {
        console.error('DynamicForm error:', error);
        reportError(error);
        return null;
    }
}
