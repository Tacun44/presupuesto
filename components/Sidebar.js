function Sidebar({ onNavigate, currentPage }) {
    try {
        const menuSections = [
            {
                title: 'Principal',
                items: [
                    { id: 'dashboard', label: 'Dashboard', icon: 'fa-dashboard', path: 'dashboard' }
                ]
            },
            {
                title: 'Maestros',
                items: [
                    { id: 'budget-structure', label: 'Estructura Presupuestal', icon: 'fa-sitemap', path: 'budget-structure' },
                    { id: 'chart-accounts', label: 'Plan de Cuentas', icon: 'fa-list-ol', path: 'chart-accounts' },
                    { id: 'taxes', label: 'Impuestos y Gravámenes', icon: 'fa-percent', path: 'taxes' },
                    { id: 'providers', label: 'Proveedores', icon: 'fa-truck', path: 'providers' }
                ]
            },
            {
                title: 'Ciclo Presupuestal',
                items: [
                    { id: 'budget', label: 'Presupuesto', icon: 'fa-money-bill', path: 'budget' },
                    { id: 'cdp', label: 'CDP', icon: 'fa-file-invoice', path: 'cdp' },
                    { id: 'rp', label: 'RP', icon: 'fa-file-contract', path: 'rp' },
                    { id: 'op', label: 'OP', icon: 'fa-receipt', path: 'op' },
                    { id: 'payments', label: 'Pagos', icon: 'fa-credit-card', path: 'payments' }
                ]
            },
            {
                title: 'Reportes',
                items: [
                    { id: 'reports', label: 'Informes', icon: 'fa-chart-bar', path: 'reports' }
                ]
            },
            {
                title: 'Desarrollo',
                items: [
                    { id: 'form-demo', label: 'Demo Formularios', icon: 'fa-database', path: 'form-demo' }
                ]
            }
        ];

        return (
            <aside data-name="sidebar" className="fixed left-0 top-16 w-64 h-full bg-gray-800 overflow-y-auto">
                <nav className="mt-5">
                    {menuSections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="mb-6">
                            <h3 className="px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                {section.title}
                            </h3>
                            {section.items.map((item) => (
                                <a
                                    key={item.id}
                                    href={`/${item.path}`}
                                    data-name={`menu-item-${item.id}`}
                                    className={`flex items-center px-6 py-3 text-sm hover:bg-gray-700 ${
                                        currentPage === item.path ? 'bg-gray-700 text-white' : 'text-gray-300'
                                    }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onNavigate(item.path);
                                    }}
                                >
                                    <i className={`fas ${item.icon} w-5`}></i>
                                    <span className="ml-3">{item.label}</span>
                                </a>
                            ))}
                        </div>
                    ))}
                </nav>
            </aside>
        );
    } catch (error) {
        console.error('Sidebar error:', error);
        reportError(error);
        return null;
    }
}
