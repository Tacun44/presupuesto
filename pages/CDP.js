function CDP() {
    try {
        return (
            <div data-name="cdp-container">
                <h1 className="text-2xl font-bold mb-6">Certificados de Disponibilidad Presupuestal</h1>
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">En desarrollo</h2>
                    <p>Módulo de CDP en construcción.</p>
                </div>
            </div>
        );
    } catch (error) {
        console.error('CDP error:', error);
        reportError(error);
        return null;
    }
}
