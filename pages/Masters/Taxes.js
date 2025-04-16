function Taxes() {
    try {
        const [taxes, setTaxes] = React.useState([]);
        const [isLoading, setIsLoading] = React.useState(true);
        const [showForm, setShowForm] = React.useState(false);
        const [selectedTax, setSelectedTax] = React.useState(null);

        React.useEffect(() => {
            loadTaxes();
        }, []);

        const loadTaxes = async () => {
            try {
                setIsLoading(true);
                const data = await api.getTaxes();
                setTaxes(data || []);
            } catch (error) {
                console.error('Error loading taxes:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleSubmit = async (formData) => {
            try {
                setIsLoading(true);
                if (selectedTax) {
                    await api.updateTax(selectedTax.id, formData);
                } else {
                    await api.createTax(formData);
                }
                await loadTaxes();
                setShowForm(false);
                setSelectedTax(null);
            } catch (error) {
                console.error('Error saving tax:', error);
                reportError(error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        };

        const handleDelete = async (taxId) => {
            if (!confirm('¿Está seguro de eliminar este impuesto? Esta acción no se puede deshacer.')) {
                return;
            }

            try {
                setIsLoading(true);
                await api.deleteTax(taxId);
                await loadTaxes();
            } catch (error) {
                console.error('Error deleting tax:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const formConfig = {
            fields: [
                {
                    type: 'text',
                    label: 'Nombre',
                    name: 'name',
                    required: true,
                    placeholder: 'Ej: IVA 19%',
                    gridColumn: 1
                },
                {
                    type: 'select',
                    label: 'Tipo',
                    name: 'type',
                    required: true,
                    options: [
                        { value: 'iva', label: 'IVA' },
                        { value: 'retefuente', label: 'Retención en la Fuente' },
                        { value: 'reteica', label: 'ReteICA' },
                        { value: 'other', label: 'Otro' }
                    ],
                    gridColumn: 2
                },
                {
                    type: 'number',
                    label: 'Porcentaje',
                    name: 'percentage',
                    required: true,
                    placeholder: 'Ej: 19',
                    gridColumn: 1
                },
                {
                    type: 'text',
                    label: 'Cuenta Contable',
                    name: 'accountCode',
                    required: true,
                    placeholder: 'Código de cuenta',
                    gridColumn: 2
                },
                {
                    type: 'textarea',
                    label: 'Descripción',
                    name: 'description',
                    required: true,
                    placeholder: 'Descripción del impuesto',
                    span2: true
                }
            ]
        };

        if (isLoading) {
            return <LoadingSpinner />;
        }
        
        return (
            <div data-name="taxes-page" className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Impuestos y Gravámenes</h1>
                    <button
                        className="btn-primary"
                        onClick={() => {
                            setSelectedTax(null);
                            setShowForm(true);
                        }}
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Nuevo Impuesto
                    </button>
                </div>

                {showForm && (
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {selectedTax ? 'Editar Impuesto' : 'Nuevo Impuesto'}
                            </h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => {
                                    setShowForm(false);
                                    setSelectedTax(null);
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <DynamicForm
                            formConfig={formConfig}
                            onSubmit={handleSubmit}
                            initialData={selectedTax}
                            onCancel={() => {
                                setShowForm(false);
                                setSelectedTax(null);
                            }}
                        />
                    </div>
                )}

                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-4 py-2">Nombre</th>
                                    <th className="border px-4 py-2">Tipo</th>
                                    <th className="border px-4 py-2">Porcentaje</th>
                                    <th className="border px-4 py-2">Cuenta</th>
                                    <th className="border px-4 py-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {taxes.map((tax) => (
                                    <tr key={tax.id} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{tax.name}</td>
                                        <td className="border px-4 py-2">{tax.type}</td>
                                        <td className="border px-4 py-2">{tax.percentage}%</td>
                                        <td className="border px-4 py-2">{tax.accountCode}</td>
                                        <td className="border px-4 py-2">
                                            <div className="flex space-x-2 justify-center">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800"
                                                    onClick={() => {
                                                        setSelectedTax(tax);
                                                        setShowForm(true);
                                                    }}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-800"
                                                    onClick={() => handleDelete(tax.id)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error en página de Impuestos:', error);
        reportError(error);
        return null;
    }
}
