function FormBuilder() {
    try {
        const [formStructure, setFormStructure] = React.useState({
            fields: []
        });

        const [newField, setNewField] = React.useState({
            type: 'text',
            label: '',
            name: '',
            required: false,
            placeholder: ''
        });

        const fieldTypes = [
            { value: 'text', label: 'Texto' },
            { value: 'number', label: 'Número' },
            { value: 'email', label: 'Email' },
            { value: 'select', label: 'Lista desplegable' },
            { value: 'textarea', label: 'Área de texto' }
        ];

        const handleAddField = () => {
            if (!newField.label || !newField.name) {
                alert('La etiqueta y el nombre del campo son requeridos');
                return;
            }

            setFormStructure(prev => ({
                ...prev,
                fields: [...prev.fields, { ...newField }]
            }));

            setNewField({
                type: 'text',
                label: '',
                name: '',
                required: false,
                placeholder: ''
            });
        };

        const handleRemoveField = (index) => {
            setFormStructure(prev => ({
                ...prev,
                fields: prev.fields.filter((_, i) => i !== index)
            }));
        };

        const handleFieldChange = (e) => {
            const { name, value, type, checked } = e.target;
            setNewField(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        };

        const handleSaveForm = () => {
            if (formStructure.fields.length === 0) {
                alert('Agregue al menos un campo al formulario');
                return;
            }

            // Here you would typically save the form structure to your backend
            console.log('Form structure:', formStructure);
            alert('Formulario guardado exitosamente');
        };

        return (
            <div data-name="form-builder" className="space-y-6">
                <div data-name="new-field-form" className="card">
                    <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Campo</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Tipo de Campo</label>
                            <select
                                data-name="field-type"
                                name="type"
                                value={newField.type}
                                onChange={handleFieldChange}
                                className="form-input"
                            >
                                {fieldTypes.map((type, index) => (
                                    <option key={index} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Etiqueta</label>
                            <input
                                data-name="field-label"
                                type="text"
                                name="label"
                                value={newField.label}
                                onChange={handleFieldChange}
                                className="form-input"
                                placeholder="Etiqueta del campo"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nombre del Campo</label>
                            <input
                                data-name="field-name"
                                type="text"
                                name="name"
                                value={newField.name}
                                onChange={handleFieldChange}
                                className="form-input"
                                placeholder="nombre_campo"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Placeholder</label>
                            <input
                                data-name="field-placeholder"
                                type="text"
                                name="placeholder"
                                value={newField.placeholder}
                                onChange={handleFieldChange}
                                className="form-input"
                                placeholder="Texto de ayuda"
                            />
                        </div>

                        <div className="form-group flex items-center">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    data-name="field-required"
                                    type="checkbox"
                                    name="required"
                                    checked={newField.required}
                                    onChange={handleFieldChange}
                                    className="form-checkbox"
                                />
                                <span>Campo requerido</span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            data-name="add-field-button"
                            onClick={handleAddField}
                            className="btn-primary"
                        >
                            Agregar Campo
                        </button>
                    </div>
                </div>

                <div data-name="form-preview" className="card">
                    <h2 className="text-xl font-semibold mb-4">Vista Previa del Formulario</h2>
                    {formStructure.fields.map((field, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border-b">
                            <div>
                                <strong>{field.label}</strong>
                                <span className="text-gray-500 ml-2">({field.type})</span>
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </div>
                            <button
                                data-name={`remove-field-${index}`}
                                onClick={() => handleRemoveField(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    ))}

                    {formStructure.fields.length === 0 && (
                        <p className="text-gray-500">No hay campos agregados</p>
                    )}

                    <div className="mt-4">
                        <button
                            data-name="save-form-button"
                            onClick={handleSaveForm}
                            className="btn-primary"
                            disabled={formStructure.fields.length === 0}
                        >
                            Guardar Formulario
                        </button>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('FormBuilder error:', error);
        reportError(error);
        return null;
    }
}
