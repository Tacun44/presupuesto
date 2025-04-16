function RP() {
    try {
        return (
            <div data-name="rp-container">
                <h1 className="text-2xl font-bold mb-6">Registros Presupuestales</h1>
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">En desarrollo</h2>
                    <p>Módulo de RP en construcción.</p>
                </div>
            </div>
        );
    } catch (error) {
        console.error('RP error:', error);
        reportError(error);
        return null;
    }
}
