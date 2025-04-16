function Payments() {
    try {
        return (
            <div data-name="payments-container">
                <h1 className="text-2xl font-bold mb-6">Gestión de Pagos</h1>
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">En desarrollo</h2>
                    <p>Módulo de pagos en construcción.</p>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Payments error:', error);
        reportError(error);
        return null;
    }
}
