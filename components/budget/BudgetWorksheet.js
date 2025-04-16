function BudgetWorksheet({ budgetStructure, initialValues, year, isEditable, onSave }) {
    try {
        const [values, setValues] = React.useState(initialValues || {});
        const [expandedNodes, setExpandedNodes] = React.useState({});
        const [isLoading, setIsLoading] = React.useState(false);

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value || 0);
        };

        const handleValueChange = (nodeId, value) => {
            const numericValue = value.replace(/[^0-9]/g, '');
            setValues(prev => ({
                ...prev,
                [nodeId]: numericValue ? parseInt(numericValue) : 0
            }));
        };

        const toggleNode = (nodeId) => {
            setExpandedNodes(prev => ({
                ...prev,
                [nodeId]: !prev[nodeId]
            }));
        };

        const calculateNodeTotal = (node) => {
            let total = values[node.id] || 0;
            if (node.children) {
                total += node.children.reduce((sum, child) => sum + calculateNodeTotal(child), 0);
            }
            return total;
        };

        const handleSave = async () => {
            try {
                setIsLoading(true);
                await onSave(values);
                alert('Presupuesto guardado exitosamente');
            } catch (error) {
                console.error('Error saving budget:', error);
                reportError(error);
                alert('Error al guardar el presupuesto');
            } finally {
                setIsLoading(false);
            }
        };

        const renderNode = (node, level = 0) => {
            const isExpanded = expandedNodes[node.id];
            const hasChildren = node.children && node.children.length > 0;
            const isLeaf = !hasChildren;
            const paddingLeft = `${level * 20}px`;
            const total = calculateNodeTotal(node);

            return (
                <React.Fragment key={node.id}>
                    <tr className={`${isLeaf ? 'hover:bg-gray-50' : 'bg-gray-50 font-medium'}`}>
                        <td className="border px-4 py-2">
                            <div className="flex items-center" style={{ paddingLeft }}>
                                {hasChildren && (
                                    <button
                                        onClick={() => toggleNode(node.id)}
                                        className="mr-2 w-4 text-gray-500"
                                    >
                                        <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
                                    </button>
                                )}
                                {node.code} - {node.name}
                            </div>
                        </td>
                        <td className="border px-4 py-2 text-right w-48">
                            {isLeaf && isEditable ? (
                                <input
                                    type="text"
                                    value={formatCurrency(values[node.id] || 0)}
                                    onChange={(e) => handleValueChange(node.id, e.target.value)}
                                    className="w-full text-right px-2 py-1 border rounded"
                                />
                            ) : (
                                formatCurrency(total)
                            )}
                        </td>
                        <td className="border px-4 py-2 text-sm text-gray-500 w-48">
                            {node.type === 'movement' ? 'Movimiento' : 'Grupo'}
                        </td>
                    </tr>
                    {hasChildren && isExpanded && node.children.map(child => renderNode(child, level + 1))}
                </React.Fragment>
            );
        };

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        Presupuesto {year} - {isEditable ? 'Borrador' : 'Aprobado'}
                    </h2>
                    {isEditable && (
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="btn-primary"
                        >
                            {isLoading ? (
                                <React.Fragment>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    Guardando...
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <i className="fas fa-save mr-2"></i>
                                    Guardar Cambios
                                </React.Fragment>
                            )}
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2 text-left">Rubro</th>
                                <th className="border px-4 py-2 text-right w-48">Valor</th>
                                <th className="border px-4 py-2 text-left w-48">Tipo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgetStructure.map(node => renderNode(node))}
                        </tbody>
                    </table>
                </div>

                {!isEditable && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <p className="text-yellow-800">
                            <i className="fas fa-info-circle mr-2"></i>
                            Este presupuesto está aprobado y no puede ser modificado.
                        </p>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('BudgetWorksheet error:', error);
        reportError(error);
        return null;
    }
}
