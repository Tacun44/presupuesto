function OP() {
    try {
        return (
            <div data-name="op-container">
                <h1 className="text-2xl font-bold mb-6">Obligaciones Presupuestales</h1>
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">En desarrollo</h2>
                    <p>Módulo de OP en construcción.</p>
                </div>
            </div>
        );
    } catch (error) {
        console.error('OP error:', error);
        reportError(error);
        return null;
    }
}
