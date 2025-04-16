function Payments() {
    try {
        const [payments, setPayments] = React.useState([]);
        const [ops, setOPs] = React.useState([]);
        const [providers, setProviders] = React.useState([]);
        const [isLoading, setIsLoading] = React.useState(true);
        const [showForm, setShowForm] = React.useState(false);
        const [selectedPayment, setSelectedPayment] = React.useState(null);

        const formConfig = {
            fields: [
                {
                    type: 'text',
                    label: 'Número',
                    name: 'number',
                    required: true,
                    placeholder: 'PAG-2024-001',
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
                    label: 'Obligación',
                    name: 'opId',
                    required: true,
                    options: ops.filter(op => op.status === 'approved').map(op => ({
                        value: op.id,
                        label: `${op.number} - ${op.description}`
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
                    label: 'Método de Pago',
                    name: 'paymentMethod',
                    required: true,
                    placeholder: 'Transferencia, Cheque, etc.',
                    gridColumn: 1
                },
                {
                    type: 'text',
                    label: 'Referencia',
                    name: 'reference',
                    required: true,
                    placeholder: 'Número de transferencia o cheque',
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
                    type: 'textarea',
                    label: 'Observaciones',
                    name: 'observations',
                    required: true,
                    placeholder: 'Observaciones del pago',
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
                const [paymentsData, opsData, providersData] = await Promise.all([
                    api.getPayments(),
                    api.getOPs(),
                    api.getProviders()
                ]);
                setPayments(paymentsData || []);
                setOPs(opsData || []);
                setProviders(providersData || []);
            } catch (error) {
                console.error('Error loading payment data:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleSubmit = async (formData) => {
            try {
                setIsLoading(true);
                if (selectedPayment) {
                    await api.updatePayment(selectedPayment.id, formData);
                } else {
                    await api.createPayment(formData);
                }
                await loadData();
                setShowForm(false);
                setSelectedPayment(null);
            } catch (error) {
                console.error('Error saving payment:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleApprove = async (id) => {
            if (!confirm('¿Está seguro de aprobar este pago?')) {
                return;
            }

            try {
                setIsLoading(true);
                await api.approvePayment(id);
                await loadData();
            } catch (error) {
                console.error('Error approving payment:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleVoid = async (id) => {
            if (!confirm('¿Está seguro de anular este pago? Esta acción no se puede deshacer.')) {
                return;
            }

            try {
                setIsLoading(true);
                await api.voidPayment(id);
                await loadData();
            } catch (error) {
                console.error('Error voiding payment:', error);
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
            <div data-name="payments-page" className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Pagos</h1>
                    <button
                        className="btn-primary"
                        onClick={() => {
                            setSelectedPayment(null);
                            setShowForm(true);
                        }}
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Nuevo Pago
                    </button>
                </div>

                {showForm && (
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {selectedPayment ? 'Editar Pago' : 'Nuevo Pago'}
                            </h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => {
                                    setShowForm(false);
                                    setSelectedPayment(null);
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <DynamicForm
                            formConfig={formConfig}
                            onSubmit={handleSubmit}
                            initialData={selectedPayment}
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
                                    <th className="border px-4 py-2">Obligación</th>
                                    <th className="border px-4 py-2">Proveedor</th>
                                    <th className="border px-4 py-2">Método</th>
                                    <th className="border px-4 py-2">Referencia</th>
                                    <th className="border px-4 py-2">Valor</th>
                                    <th className="border px-4 py-2">Estado</th>
                                    <th className="border px-4 py-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{payment.number}</td>
                                        <td className="border px-4 py-2">
                                            {new Date(payment.date).toLocaleDateString()}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {ops.find(op => op.id === payment.opId)?.number}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {providers.find(provider => provider.id === payment.providerId)?.name}
                                        </td>
                                        <td className="border px-4 py-2">{payment.paymentMethod}</td>
                                        <td className="border px-4 py-2">{payment.reference}</td>
                                        <td className="border px-4 py-2">{formatCurrency(payment.amount)}</td>
                                        <td className="border px-4 py-2">
                                            <span className={`px-2 py-1 rounded-full text-sm ${
                                                payment.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                payment.status === 'voided' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {payment.status === 'approved' ? 'Aprobado' :
                                                 payment.status === 'pending' ? 'Pendiente' :
                                                 payment.status === 'voided' ? 'Anulado' :
                                                 'Borrador'}
                                            </span>
                                        </td>
                                        <td className="border px-4 py-2">
                                            <div className="flex space-x-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800"
                                                    onClick={() => {
                                                        setSelectedPayment(payment);
                                                        setShowForm(true);
                                                    }}
                                                    title="Editar"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                {payment.status === 'pending' && (
                                                    <React.Fragment>
                                                        <button
                                                            className="text-green-600 hover:text-green-800"
                                                            onClick={() => handleApprove(payment.id)}
                                                            title="Aprobar"
                                                        >
                                                            <i className="fas fa-check"></i>
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:text-red-800"
                                                            onClick={() => handleVoid(payment.id)}
                                                            title="Anular"
                                                        >
                                                            <i className="fas fa-ban"></i>
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
        console.error('Payments page error:', error);
        reportError(error);
        return null;
    }
}
