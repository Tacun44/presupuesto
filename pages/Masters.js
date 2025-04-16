function Masters() {
    try {
        const [activeTab, setActiveTab] = React.useState('budget-structure');

        const tabs = [
            { id: 'budget-structure', label: 'Estructura Presupuestal', icon: 'fa-sitemap' },
            { id: 'providers', label: 'Proveedores', icon: 'fa-truck' },
            { id: 'contracts', label: 'Contratos', icon: 'fa-file-contract' },
            { id: 'accounts', label: 'Plan de Cuentas', icon: 'fa-list-ol' }
        ];

        return (
            <div data-name="masters-container">
                <h1 className="text-2xl font-bold mb-6">Datos Maestros</h1>

                <div className="card">
                    <div className="border-b mb-4">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        py-4 px-1 border-b-2 font-medium text-sm
                                        ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                    `}
                                >
                                    <i className={`fas ${tab.icon} mr-2`}></i>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-4">
                        {activeTab === 'budget-structure' && (
                            <BudgetStructure />
                        )}
                        {activeTab === 'providers' && (
                            <div>Módulo de Proveedores en desarrollo</div>
                        )}
                        {activeTab === 'contracts' && (
                            <div>Módulo de Contratos en desarrollo</div>
                        )}
                        {activeTab === 'accounts' && (
                            <div>Módulo de Plan de Cuentas en desarrollo</div>
                        )}
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Masters error:', error);
        reportError(error);
        return null;
    }
}
