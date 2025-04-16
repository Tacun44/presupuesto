function ChartAccounts() {
    try {
        const [accounts, setAccounts] = React.useState([]);
        const [isLoading, setIsLoading] = React.useState(true);
        const [showForm, setShowForm] = React.useState(false);
        const [selectedAccount, setSelectedAccount] = React.useState(null);

        React.useEffect(() => {
            loadAccounts();
        }, []);

        const loadAccounts = async () => {
            try {
                setIsLoading(true);
                const data = await api.getPUCAccounts();
                setAccounts(data || []);
            } catch (error) {
                console.error('Error loading accounts:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleSubmit = async (formData) => {
            try {
                setIsLoading(true);
                if (selectedAccount) {
                    await api.updatePUCAccount(selectedAccount.id, formData);
                } else {
                    await api.createPUCAccount(formData);
                }
                await loadAccounts();
                setShowForm(false);
                setSelectedAccount(null);
            } catch (error) {
                console.error('Error saving account:', error);
                reportError(error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        };

        const handleDelete = async (accountId) => {
            if (!confirm('¿Está seguro de eliminar esta cuenta? Esta acción no se puede deshacer.')) {
                return;
            }

            try {
                setIsLoading(true);
                await api.deletePUCAccount(accountId);
                await loadAccounts();
            } catch (error) {
                console.error('Error deleting account:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const formConfig = {
            fields: [
                {
                    type: 'text',
                    label: 'Código',
                    name: 'code',
                    required: true,
                    placeholder: 'Ej: 1.1.1.01',
                    gridColumn: 1
                },
                {
                    type: 'text',
                    label: 'Nombre',
                    name: 'name',
                    required: true,
                    placeholder: 'Nombre de la cuenta',
                    gridColumn: 2
                },
                {
                    type: 'select',
                    label: 'Naturaleza',
                    name: 'nature',
                    required: true,
                    options: [
                        { value: 'debit', label: 'Débito' },
                        { value: 'credit', label: 'Crédito' }
                    ],
                    gridColumn: 1
                },
                {
                    type: 'select',
                    label: 'Tipo',
                    name: 'type',
                    required: true,
                    options: [
                        { value: 'group', label: 'Grupo' },
                        { value: 'detail', label: 'Detalle' }
                    ],
                    gridColumn: 2
                },
                {
                    type: 'textarea',
                    label: 'Descripción',
                    name: 'description',
                    required: true,
                    placeholder: 'Descripción de la cuenta',
                    span2: true
                }
            ]
        };

        if (isLoading) {
            return <LoadingSpinner />;
        }
        
        return (
            <div data-name="chart-accounts-page" className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Plan Único de Cuentas</h1>
                    <button
                        className="btn-primary"
                        onClick={() => {
                            setSelectedAccount(null);
                            setShowForm(true);
                        }}
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Nueva Cuenta
                    </button>
                </div>

                {showForm && (
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {selectedAccount ? 'Editar Cuenta' : 'Nueva Cuenta'}
                            </h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => {
                                    setShowForm(false);
                                    setSelectedAccount(null);
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <DynamicForm
                            formConfig={formConfig}
                            onSubmit={handleSubmit}
                            initialData={selectedAccount}
                            onCancel={() => {
                                setShowForm(false);
                                setSelectedAccount(null);
                            }}
                        />
                    </div>
                )}

                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-4 py-2">Código</th>
                                    <th className="border px-4 py-2">Nombre</th>
                                    <th className="border px-4 py-2">Naturaleza</th>
                                    <th className="border px-4 py-2">Tipo</th>
                                    <th className="border px-4 py-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map((account) => (
                                    <tr key={account.id} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{account.code}</td>
                                        <td className="border px-4 py-2">{account.name}</td>
                                        <td className="border px-4 py-2">
                                            {account.nature === 'debit' ? 'Débito' : 'Crédito'}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {account.type === 'group' ? 'Grupo' : 'Detalle'}
                                        </td>
                                        <td className="border px-4 py-2">
                                            <div className="flex space-x-2 justify-center">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800"
                                                    onClick={() => {
                                                        setSelectedAccount(account);
                                                        setShowForm(true);
                                                    }}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-800"
                                                    onClick={() => handleDelete(account.id)}
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
        console.error('Error en página de Plan de Cuentas:', error);
        reportError(error);
        return null;
    }
}
