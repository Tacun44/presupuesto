function LoadingSpinner() {
    try {
        return (
            <div data-name="loading-spinner" className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Cargando...</span>
            </div>
        );
    } catch (error) {
        console.error('LoadingSpinner error:', error);
        reportError(error);
        return null;
    }
}
