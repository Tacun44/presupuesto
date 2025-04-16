function CDP() {
    try {
        const [cdps, setCDPs] = React.useState([]);
        const [isLoading, setIsLoading] = React.useState(true);
        const [showForm, setShowForm] = React.useState(false);
        const [selectedCDP, setSelectedCDP] = React.useState(null);
        const [budgetItems, setBudgetItems] = React.useState([]);

        const formConfig = {
            fields: [
                {
                    type: 'text',
                    label: 'Número',
                    name: 'number',
                    required: true,
                    placeholder: 'CDP-2024-001',
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
                    gridColumn: 1
                },
                {
                    type: 'select',
                    label: 'Rubro Presupuestal',
                    name: 'budgetItemId',
                    required: true,
                    options: budgetItems.map(item => ({
                        value: item.id,
                        label: `${item.code} - ${item.name}`
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
                    type: 'text',
                    label: 'Solicitante',
                    name: 'requestedBy',
                    required: true,
                    placeholder: 'Nombre del solicitante',
                    gridColumn: 2
                },
                {
                    type: 'textarea',
                    label: 'Objeto',
                    name: 'description',
                    required: true,
                    placeholder: 'Descripción detallada del CDP',
                    gridColumn: 'span 2'
                },
                {
                    type: 'textarea',
                    label: 'Justificación',
                    name: 'justification',
                    required: true,
                    placeholder: 'Justificación de la solicitud',
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
                const [cdpsData, budgetItemsData] = await Promise.all([
                    api.getCDPs(),
                    api.getBudgetItems()
                ]);
                setCDPs(cdpsData || []);
                setBudgetItems(budgetItemsData || []);
            } catch (error) {
                console.error('Error loading CDP data:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleSubmit = async (formData) => {
            try {
                setIsLoading(true);
                if (selectedCDP) {
                    await api.updateCDP(selectedCDP.id, formData);
                } else {
                    await api.createCDP(formData);
                }
                await loadData();
                setShowForm(false);
                setSelectedCDP(null);
            } catch (error) {
                console.error('Error saving CDP:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleApprove = async (id) => {
            if (!confirm('¿Está seguro de aprobar este CDP?')) {
                return;
            }

            try {
                setIsLoading(true);
                await api.approveCDP(id);
                await loadData();
            } catch (error) {
                console.error('Error approving CDP:', error);
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
                await api.rejectCDP(id, { reason });
                await loadData();
            } catch (error) {
                console.error('Error rejecting CDP:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleCancel = async (id) => {
            if (!confirm('¿Está seguro de anular este CDP? Esta acción no se puede deshacer.')) {
                return;
            }

            try {
                setIsLoading(true);
                await api.cancelCDP(id);
                await loadData();
            } catch (error) {
                console.error('Error cancelling CDP:', error);
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
            <div data-name="cdp-page" className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Certificados de Disponibilidad Presupuestal</h1>
                    <button
                        className="btn-primary"
                        onClick={() => {
                            setSelectedCDP(null);
                            setShowForm(true);
                        }}
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Nuevo CDP
                    </button>
                </div>

                {showForm && (
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {selectedCDP ? 'Editar CDP' : 'Nuevo CDP'}
                            </h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => {
                                    setShowForm(false);
                                    setSelectedCDP(null);
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <DynamicForm
                            formConfig={formConfig}
                            onSubmit={handleSubmit}
                            initialData={selectedCDP}
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
                                    <th className="border px-4 py-2">Rubro</th>
                                    <th className="border px-4 py-2">Valor</th>
                                    <th className="border px-4 py-2">Estado</th>
                                    <th className="border px-4 py-2">Solicitante</th>
                                    <th className="border px-4 py-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cdps.map((cdp) => (
                                    <tr key={cdp.id} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{cdp.number}</td>
                                        <td className="border px-4 py-2">
                                            {new Date(cdp.date).toLocaleDateString()}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {budgetItems.find(item => item.id === cdp.budgetItemId)?.name}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {formatCurrency(cdp.amount)}
                                        </td>
                                        <td className="border px-4 py-2">
                                            <span className={`px-2 py-1 rounded-full text-sm ${
                                                cdp.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                cdp.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                cdp.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                cdp.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {cdp.status === 'approved' ? 'Aprobado' :
                                                 cdp.status === 'pending' ? 'Pendiente' :
                                                 cdp.status === 'rejected' ? 'Rechazado' :
                                                 cdp.status === 'cancelled' ? 'Anulado' :
                                                 'Borrador'}
                                            </span>
                                        </td>
                                        <td className="border px-4 py-2">{cdp.requestedBy}</td>
                                        <td className="border px-4 py-2">
                                            <div className="flex space-x-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800"
                                                    onClick={() => {
                                                        setSelectedCDP(cdp);
                                                        setShowForm(true);
                                                    }}
                                                    title="Editar"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                {cdp.status === 'pending' && (
                                                    <React.Fragment>
                                                        <button
                                                            className="text-green-600 hover:text-green-800"
                                                            onClick={() => handleApprove(cdp.id)}
                                                            title="Aprobar"
                                                        >
                                                            <i className="fas fa-check"></i>
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:text-red-800"
                                                            onClick={() => handleReject(cdp.id)}
                                                            title="Rechazar"
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </React.Fragment>
                                                )}
                                                {['draft', 'pending'].includes(cdp.status) && (
                                                    <button
                                                        className="text-gray-600 hover:text-gray-800"
                                                        onClick={() => handleCancel(cdp.id)}
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
        console.error('CDP page error:', error);
        reportError(error);
        return null;
    }
}
