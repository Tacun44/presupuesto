function OP() {
    try {
        const [ops, setOPs] = React.useState([]);
        const [rps, setRPs] = React.useState([]);
        const [providers, setProviders] = React.useState([]);
        const [isLoading, setIsLoading] = React.useState(true);
        const [showForm, setShowForm] = React.useState(false);
        const [selectedOP, setSelectedOP] = React.useState(null);

        const formConfig = {
            fields: [
                {
                    type: 'text',
                    label: 'Número',
                    name: 'number',
                    required: true,
                    placeholder: 'OP-2024-001',
                    gridColumn: 1
                },
                {
                    type: 'date',
                    label: 'Fecha',
                    name: 'date',
                    required: true,
                    gridColumn: 2
                },
                {
                    type: 'select',
                    label: 'RP',
                    name: 'rpId',
                    required: true,
                    options: rps.filter(rp => rp.status === 'approved').map(rp => ({
                        value: rp.id,
                        label: `${rp.number} - ${rp.description}`
                    })),
                    gridColumn: 1
                },
                {
                    type: 'select',
                    label: 'Proveedor',
                    name: 'providerId',
                    required: true,
                    options: providers.map(provider => ({
                        value: provider.id,
                        label: `${provider.taxId} - ${provider.name}`
                    })),
                    gridColumn: 2
                },
                {
                    type: 'text',
                    label: 'Factura',
                    name: 'invoiceNumber',
                    required: true,
                    placeholder: 'Número de factura',
                    gridColumn: 1
                },
                {
                    type: 'date',
                    label: 'Fecha Factura',
                    name: 'invoiceDate',
                    required: true,
                    gridColumn: 2
                },
                {
                    type: 'number',
                    label: 'Valor Bruto',
                    name: 'grossAmount',
                    required: true,
                    placeholder: '0.00',
                    gridColumn: 1
                },
                {
                    type: 'number',
                    label: 'Valor IVA',
                    name: 'taxAmount',
                    required: true,
                    placeholder: '0.00',
                    gridColumn: 2
                },
                {
                    type: 'number',
                    label: 'Valor Retenciones',
                    name: 'retentionAmount',
                    required: true,
                    placeholder: '0.00',
                    gridColumn: 1
                },
                {
                    type: 'number',
                    label: 'Valor Neto',
                    name: 'netAmount',
                    required: true,
                    placeholder: '0.00',
                    gridColumn: 2
                },
                {
                    type: 'textarea',
                    label: 'Descripción',
                    name: 'description',
                    required: true,
                    placeholder: 'Descripción detallada de la obligación',
                    gridColumn: 'span 2'
                }
            ]
        };

        React.useEffect(() => {
            loadData();
        }, []);

        const loadData = async () => {
            try {
                setIsLoading(true);
                const [opsData, rpsData, providersData] = await Promise.all([
                    api.getOPs(),
                    api.getRPs(),
                    api.getProviders()
                ]);
                setOPs(opsData || []);
                setRPs(rpsData || []);
                setProviders(providersData || []);
            } catch (error) {
                console.error('Error loading OP data:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleSubmit = async (formData) => {
            try {
                setIsLoading(true);
                if (selectedOP) {
                    await api.updateOP(selectedOP.id, formData);
                } else {
                    await api.createOP(formData);
                }
                await loadData();
                setShowForm(false);
                setSelectedOP(null);
            } catch (error) {
                console.error('Error saving OP:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleApprove = async (id) => {
            if (!confirm('¿Está seguro de aprobar esta obligación?')) {
                return;
            }

            try {
                setIsLoading(true);
                await api.approveOP(id);
                await loadData();
            } catch (error) {
                console.error('Error approving OP:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleReject = async (id) => {
            const reason = prompt('Por favor, ingrese el motivo del rechazo:');
            if (!reason) return;

            try {
                setIsLoading(true);
                await api.rejectOP(id, { reason });
                await loadData();
            } catch (error) {
                console.error('Error rejecting OP:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        };

        if (isLoading) {
            return <LoadingSpinner />;
        }

        return (
            <div data-name="op-page" className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Obligaciones Presupuestales</h1>
                    <button
                        className="btn-primary"
                        onClick={() => {
                            setSelectedOP(null);
                            setShowForm(true);
                        }}
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Nueva Obligación
                    </button>
                </div>

                {showForm && (
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {selectedOP ? 'Editar Obligación' : 'Nueva Obligación'}
                            </h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => {
                                    setShowForm(false);
                                    setSelectedOP(null);
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <DynamicForm
                            formConfig={formConfig}
                            onSubmit={handleSubmit}
                            initialData={selectedOP}
                        />
                    </div>
                )}

                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-4 py-2">Número</th>
                                    <th className="border px-4 py-2">Fecha</th>
                                    <th className="border px-4 py-2">RP</th>
                                    <th className="border px-4 py-2">Proveedor</th>
                                    <th className="border px-4 py-2">Factura</th>
                                    <th className="border px-4 py-2">Valor Bruto</th>
                                    <th className="border px-4 py-2">Valor Neto</th>
                                    <th className="border px-4 py-2">Estado</th>
                                    <th className="border px-4 py-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ops.map((op) => (
                                    <tr key={op.id} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{op.number}</td>
                                        <td className="border px-4 py-2">
                                            {new Date(op.date).toLocaleDateString()}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {rps.find(rp => rp.id === op.rpId)?.number}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {providers.find(provider => provider.id === op.providerId)?.name}
                                        </td>
                                        <td className="border px-4 py-2">{op.invoiceNumber}</td>
                                        <td className="border px-4 py-2">{formatCurrency(op.grossAmount)}</td>
                                        <td className="border px-4 py-2">{formatCurrency(op.netAmount)}</td>
                                        <td className="border px-4 py-2">
                                            <span className={`px-2 py-1 rounded-full text-sm ${
                                                op.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                op.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                op.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {op.status === 'approved' ? 'Aprobado' :
                                                 op.status === 'pending' ? 'Pendiente' :
                                                 op.status === 'rejected' ? 'Rechazado' :
                                                 'Borrador'}
                                            </span>
                                        </td>
                                        <td className="border px-4 py-2">
                                            <div className="flex space-x-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800"
                                                    onClick={() => {
                                                        setSelectedOP(op);
                                                        setShowForm(true);
                                                    }}
                                                    title="Editar"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                {op.status === 'pending' && (
                                                    <React.Fragment>
                                                        <button
                                                            className="text-green-600 hover:text-green-800"
                                                            onClick={() => handleApprove(op.id)}
                                                            title="Aprobar"
                                                        >
                                                            <i className="fas fa-check"></i>
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:text-red-800"
                                                            onClick={() => handleReject(op.id)}
                                                            title="Rechazar"
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </React.Fragment>
                                                )}
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
        console.error('OP page error:', error);
        reportError(error);
        return null;
    }
}
