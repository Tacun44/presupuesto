function RP() {
    try {
        const [rps, setRPs] = React.useState([]);
        const [cdps, setCDPs] = React.useState([]);
        const [providers, setProviders] = React.useState([]);
        const [isLoading, setIsLoading] = React.useState(true);
        const [showForm, setShowForm] = React.useState(false);
        const [selectedRP, setSelectedRP] = React.useState(null);

        const formConfig = {
            fields: [
                {
                    type: 'text',
                    label: 'Número',
                    name: 'number',
                    required: true,
                    placeholder: 'RP-2024-001',
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
                    label: 'CDP',
                    name: 'cdpId',
                    required: true,
                    options: cdps.filter(cdp => cdp.status === 'approved').map(cdp => ({
                        value: cdp.id,
                        label: `${cdp.number} - ${cdp.description}`
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
                    type: 'number',
                    label: 'Valor',
                    name: 'amount',
                    required: true,
                    placeholder: '0.00',
                    gridColumn: 1
                },
                {
                    type: 'select',
                    label: 'Estado',
                    name: 'status',
                    required: true,
                    options: [
                        { value: 'draft', label: 'Borrador' },
                        { value: 'pending', label: 'Pendiente de Aprobación' },
                        { value: 'approved', label: 'Aprobado' },
                        { value: 'rejected', label: 'Rechazado' },
                        { value: 'cancelled', label: 'Anulado' }
                    ],
                    gridColumn: 2
                },
                {
                    type: 'textarea',
                    label: 'Objeto',
                    name: 'description',
                    required: true,
                    placeholder: 'Descripción detallada del RP',
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
                const [rpsData, cdpsData, providersData] = await Promise.all([
                    api.getRPs(),
                    api.getCDPs(),
                    api.getProviders()
                ]);
                setRPs(rpsData || []);
                setCDPs(cdpsData || []);
                setProviders(providersData || []);
            } catch (error) {
                console.error('Error loading RP data:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleSubmit = async (formData) => {
            try {
                setIsLoading(true);
                if (selectedRP) {
                    await api.updateRP(selectedRP.id, formData);
                } else {
                    await api.createRP(formData);
                }
                await loadData();
                setShowForm(false);
                setSelectedRP(null);
            } catch (error) {
                console.error('Error saving RP:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleApprove = async (id) => {
            if (!confirm('¿Está seguro de aprobar este RP?')) {
                return;
            }

            try {
                setIsLoading(true);
                await api.approveRP(id);
                await loadData();
            } catch (error) {
                console.error('Error approving RP:', error);
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
                await api.rejectRP(id, { reason });
                await loadData();
            } catch (error) {
                console.error('Error rejecting RP:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleCancel = async (id) => {
            if (!confirm('¿Está seguro de anular este RP? Esta acción no se puede deshacer.')) {
                return;
            }

            try {
                setIsLoading(true);
                await api.cancelRP(id);
                await loadData();
            } catch (error) {
                console.error('Error cancelling RP:', error);
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
            <div data-name="rp-page" className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Registros Presupuestales</h1>
                    <button
                        className="btn-primary"
                        onClick={() => {
                            setSelectedRP(null);
                            setShowForm(true);
                        }}
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Nuevo RP
                    </button>
                </div>

                {showForm && (
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {selectedRP ? 'Editar RP' : 'Nuevo RP'}
                            </h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => {
                                    setShowForm(false);
                                    setSelectedRP(null);
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <DynamicForm
                            formConfig={formConfig}
                            onSubmit={handleSubmit}
                            initialData={selectedRP}
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
                                    <th className="border px-4 py-2">CDP</th>
                                    <th className="border px-4 py-2">Proveedor</th>
                                    <th className="border px-4 py-2">Valor</th>
                                    <th className="border px-4 py-2">Estado</th>
                                    <th className="border px-4 py-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rps.map((rp) => (
                                    <tr key={rp.id} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{rp.number}</td>
                                        <td className="border px-4 py-2">
                                            {new Date(rp.date).toLocaleDateString()}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {cdps.find(cdp => cdp.id === rp.cdpId)?.number}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {providers.find(provider => provider.id === rp.providerId)?.name}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {formatCurrency(rp.amount)}
                                        </td>
                                        <td className="border px-4 py-2">
                                            <span className={`px-2 py-1 rounded-full text-sm ${
                                                rp.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                rp.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                rp.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                rp.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {rp.status === 'approved' ? 'Aprobado' :
                                                 rp.status === 'pending' ? 'Pendiente' :
                                                 rp.status === 'rejected' ? 'Rechazado' :
                                                 rp.status === 'cancelled' ? 'Anulado' :
                                                 'Borrador'}
                                            </span>
                                        </td>
                                        <td className="border px-4 py-2">
                                            <div className="flex space-x-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800"
                                                    onClick={() => {
                                                        setSelectedRP(rp);
                                                        setShowForm(true);
                                                    }}
                                                    title="Editar"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                {rp.status === 'pending' && (
                                                    <React.Fragment>
                                                        <button
                                                            className="text-green-600 hover:text-green-800"
                                                            onClick={() => handleApprove(rp.id)}
                                                            title="Aprobar"
                                                        >
                                                            <i className="fas fa-check"></i>
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:text-red-800"
                                                            onClick={() => handleReject(rp.id)}
                                                            title="Rechazar"
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </React.Fragment>
                                                )}
                                                {['draft', 'pending'].includes(rp.status) && (
                                                    <button
                                                        className="text-gray-600 hover:text-gray-800"
                                                        onClick={() => handleCancel(rp.id)}
                                                        title="Anular"
                                                    >
                                                        <i className="fas fa-ban"></i>
                                                    </button>
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
        console.error('RP page error:', error);
        reportError(error);
        return null;
    }
}
