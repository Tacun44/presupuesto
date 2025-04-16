function BudgetStructure() {
    try {
        return (
            <div data-name="budget-structure-page" className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Estructura Presupuestal</h1>
                </div>
                <div className="card">
                    <BudgetStructureForm onClose={() => {}} />
                </div>
            </div>
        );
    } catch (error) {
        console.error('BudgetStructure page error:', error);
        reportError(error);
        return null;
    }
}
