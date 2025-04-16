function Dashboard() {
    try {
        const [stats, setStats] = React.useState({
            totalBudget: '1,500,000,000',
            executedBudget: '750,000,000',
            pendingCDPs: '25',
            pendingPayments: '15'
        });

        return (
            <div data-name="dashboard-container">
                <h1 className="text-2xl font-bold mb-6">Panel de Control</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div data-name="stat-card" className="card bg-white p-4">
                        <h3 className="text-gray-500 text-sm">Presupuesto Total</h3>
                        <p className="text-2xl font-bold text-gray-800">$ {stats.totalBudget}</p>
                    </div>
                    
                    <div data-name="stat-card" className="card bg-white p-4">
                        <h3 className="text-gray-500 text-sm">Presupuesto Ejecutado</h3>
                        <p className="text-2xl font-bold text-gray-800">$ {stats.executedBudget}</p>
                    </div>
                    
                    <div data-name="stat-card" className="card bg-white p-4">
                        <h3 className="text-gray-500 text-sm">CDP Pendientes</h3>
                        <p className="text-2xl font-bold text-gray-800">{stats.pendingCDPs}</p>
                    </div>
                    
                    <div data-name="stat-card" className="card bg-white p-4">
                        <h3 className="text-gray-500 text-sm">Pagos Pendientes</h3>
                        <p className="text-2xl font-bold text-gray-800">{stats.pendingPayments}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div data-name="recent-cdps" className="card">
                        <h2 className="text-xl font-semibold mb-4">CDP Recientes</h2>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Número</th>
                                        <th>Fecha</th>
                                        <th>Valor</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>CDP-2024-001</td>
                                        <td>2024-01-15</td>
                                        <td>$50,000,000</td>
                                        <td>Aprobado</td>
                                    </tr>
                                    <tr>
                                        <td>CDP-2024-002</td>
                                        <td>2024-01-14</td>
                                        <td>$35,000,000</td>
                                        <td>Pendiente</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div data-name="recent-payments" className="card">
                        <h2 className="text-xl font-semibold mb-4">Pagos Recientes</h2>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Número</th>
                                        <th>Fecha</th>
                                        <th>Valor</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>PAG-2024-001</td>
                                        <td>2024-01-15</td>
                                        <td>$25,000,000</td>
                                        <td>Procesado</td>
                                    </tr>
                                    <tr>
                                        <td>PAG-2024-002</td>
                                        <td>2024-01-14</td>
                                        <td>$15,000,000</td>
                                        <td>Pendiente</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Dashboard error:', error);
        reportError(error);
        return null;
    }
}
