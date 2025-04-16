function Budget() {
    try {
        const [budgetData, setBudgetData] = React.useState(null);
        const [budgetStructure, setBudgetStructure] = React.useState([]);
        const [isLoading, setIsLoading] = React.useState(true);
        const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
        const [budgetStatus, setBudgetStatus] = React.useState('draft'); // draft, approved

        // Definir los años disponibles (año actual + 4 años siguientes)
        const years = React.useMemo(() => {
            const currentYear = new Date().getFullYear();
            return Array.from({length: 5}, (_, i) => currentYear + i);
        }, []);

        React.useEffect(() => {
            loadBudgetData();
        }, [selectedYear]);

        const loadBudgetData = async () => {
            try {
                setIsLoading(true);
                const [structure, values] = await Promise.all([
                    api.getBudgetStructure(),
                    api.getBudgetValues(selectedYear)
                ]);
                setBudgetStructure(structure);
                setBudgetData(values);
                setBudgetStatus(values?.status || 'draft');
            } catch (error) {
                console.error('Error loading budget data:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleSaveBudget = async (values) => {
            try {
                await api.saveBudgetValues(selectedYear, values);
                await loadBudgetData();
            } catch (error) {
                console.error('Error saving budget:', error);
                reportError(error);
                throw error;
            }
        };

        const handleApproveBudget = async () => {
            if (!confirm('¿Está seguro de aprobar el presupuesto? Esta acción no se puede deshacer.')) {
                return;
            }

            try {
                setIsLoading(true);
                await api.approveBudget(selectedYear);
                await loadBudgetData();
                alert('Presupuesto aprobado exitosamente');
            } catch (error) {
                console.error('Error approving budget:', error);
                reportError(error);
                alert('Error al aprobar el presupuesto');
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoading) {
            return <LoadingSpinner />;
        }

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Gestión de Presupuesto</h1>
                    <div className="flex space-x-4">
                        <select
                            className="form-input w-32"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        {budgetStatus === 'draft' && (
                            <button
                                onClick={handleApproveBudget}
                                className="btn-primary"
                            >
                                <i className="fas fa-check-circle mr-2"></i>
                                Aprobar Presupuesto
                            </button>
                        )}
                    </div>
                </div>

                <div className="card">
                    <BudgetWorksheet
                        budgetStructure={budgetStructure}
                        initialValues={budgetData?.values || {}}
                        year={selectedYear}
                        isEditable={budgetStatus === 'draft'}
                        onSave={handleSaveBudget}
                    />
                </div>
            </div>
        );
    } catch (error) {
        console.error('Budget page error:', error);
        reportError(error);
        return null;
    }
}
