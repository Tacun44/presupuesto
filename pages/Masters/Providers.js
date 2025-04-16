function Providers() {
    try {
        const [providers, setProviders] = React.useState([]);
        const [isLoading, setIsLoading] = React.useState(true);
        const [showForm, setShowForm] = React.useState(false);
        const [selectedProvider, setSelectedProvider] = React.useState(null);

        React.useEffect(() => {
            loadProviders();
        }, []);

        const loadProviders = async () => {
            try {
                setIsLoading(true);
                const data = await api.getProviders();
                setProviders(data || []);
            } catch (error) {
                console.error('Error loading providers:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleSubmit = async (formData) => {
            try {
                setIsLoading(true);
                if (selectedProvider) {
                    await api.updateProvider(selectedProvider.id, formData);
                } else {
                    await api.createProvider(formData);
                }
                await loadProviders();
                setShowForm(false);
                setSelectedProvider(null);
            } catch (error) {
                console.error('Error saving provider:', error);
                reportError(error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        };

        const handleDelete = async (providerId) => {
            if (!confirm('¿Está seguro de eliminar este proveedor? Esta acción no se puede deshacer.')) {
                return;
            }

            try {
                setIsLoading(true);
                await api.deleteProvider(providerId);
                await loadProviders();
            } catch (error) {
                console.error('Error deleting provider:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const formConfig = {
            fields: [
                {
                    type: 'text',
                    label: 'NIT/Documento',
                    name: 'taxId',
                    required: true,
                    placeholder: 'NIT o documento'
                },
                {
                    type: 'text',
                    label: 'Razón Social',
                    name: 'name',
                    required: true,
                    placeholder: 'Nombre o razón social'
                },
                {
                    type: 'select',
                    label: 'Tipo de Persona',
                    name: 'type',
                    required: true,
                    options: [
                        { value: 'natural', label: 'Persona Natural' },
                        { value: 'juridica', label: 'Persona Jurídica' }
                    ]
                },
                {
                    type: 'select',
                    label: 'Régimen',
                    name: 'regime',
                    required: true,
                    options: [
                        { value: 'comun', label: 'Régimen Común' },
                        { value: 'simplificado', label: 'Régimen Simplificado' },
                        { value: 'especial', label: 'Régimen Especial' }
                    ]
                },
                {
                    type: 'text',
                    label: 'Dirección',
                    name: 'address',
                    required: true,
                    placeholder: 'Dirección completa'
                },
                {
                    type: 'text',
                    label: 'Teléfono',
                    name: 'phone',
                    required: true,
                    placeholder: 'Teléfono de contacto'
                },
                {
                    type: 'email',
                    label: 'Email',
                    name: 'email',
                    required: true,
                    placeholder: 'Correo electrónico'
                },
                {
                    type: 'text',
                    label: 'Contacto',
                    name: 'contact',
                    required: true,
                    placeholder: 'Nombre del contacto'
                },
                {
                    type: 'textarea',
                    label: 'Observaciones',
                    name: 'observations',
                    placeholder: 'Observaciones adicionales',
                    span2: true
                }
            ]
        };

        if (isLoading) {
            return <LoadingSpinner />;
        }
        
        return (
            <div data-name="providers-page" className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Proveedores</h1>
                    <button
                        className="btn-primary"
                        onClick={() => {
                            setSelectedProvider(null);
                            setShowForm(true);
                        }}
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Nuevo Proveedor
                    </button>
                </div>

                {showForm && (
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {selectedProvider ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                            </h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => {
                                    setShowForm(false);
                                    setSelectedProvider(null);
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <DynamicForm
                            formConfig={formConfig}
                            onSubmit={handleSubmit}
                            initialData={selectedProvider}
                            onCancel={() => {
                                setShowForm(false);
                                setSelectedProvider(null);
                            }}
                        />
                    </div>
                )}

                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-4 py-2">NIT/Doc</th>
                                    <th className="border px-4 py-2">Razón Social</th>
                                    <th className="border px-4 py-2">Tipo</th>
                                    <th className="border px-4 py-2">Régimen</th>
                                    <th className="border px-4 py-2">Teléfono</th>
                                    <th className="border px-4 py-2">Email</th>
                                    <th className="border px-4 py-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {providers.map((provider) => (
                                    <tr key={provider.id} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{provider.taxId}</td>
                                        <td className="border px-4 py-2">{provider.name}</td>
                                        <td className="border px-4 py-2">{provider.type}</td>
                                        <td className="border px-4 py-2">{provider.regime}</td>
                                        <td className="border px-4 py-2">{provider.phone}</td>
                                        <td className="border px-4 py-2">{provider.email}</td>
                                        <td className="border px-4 py-2">
                                            <div className="flex space-x-2 justify-center">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800"
                                                    onClick={() => {
                                                        setSelectedProvider(provider);
                                                        setShowForm(true);
                                                    }}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-800"
                                                    onClick={() => handleDelete(provider.id)}
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
        console.error('Providers page error:', error);
        reportError(error);
        return null;
    }
}
