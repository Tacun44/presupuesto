function Reports() {
    try {
        return (
            <div data-name="reports-container">
                <h1 className="text-2xl font-bold mb-6">Informes</h1>
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">En desarrollo</h2>
                    <p>Módulo de informes en construcción.</p>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Reports error:', error);
        reportError(error);
        return null;
    }
}
