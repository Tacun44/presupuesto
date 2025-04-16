function BudgetStructure({ onClose }) {
    try {
        const [nodes, setNodes] = React.useState([]);
        const [selectedNode, setSelectedNode] = React.useState(null);
        const [isLoading, setIsLoading] = React.useState(true);
        const [showForm, setShowForm] = React.useState(false);

        const formConfig = {
            fields: [
                {
                    type: 'text',
                    label: 'Código',
                    name: 'code',
                    required: true,
                    placeholder: 'Ej: 2.1.2'
                },
                {
                    type: 'text',
                    label: 'Nombre',
                    name: 'name',
                    required: true,
                    placeholder: 'Nombre del rubro'
                },
                {
                    type: 'select',
                    label: 'Tipo',
                    name: 'type',
                    required: true,
                    options: [
                        { value: 'group', label: 'Grupo (No permite movimientos)' },
                        { value: 'movement', label: 'Movimiento (Permite asignación)' }
                    ]
                },
                {
                    type: 'select',
                    label: 'Clasificación',
                    name: 'classification',
                    required: true,
                    options: [
                        { value: 'funcionamiento', label: 'Gastos de Funcionamiento' },
                        { value: 'inversion', label: 'Gastos de Inversión' },
                        { value: 'deuda', label: 'Servicio de la Deuda' }
                    ]
                },
                {
                    type: 'textarea',
                    label: 'Descripción',
                    name: 'description',
                    required: true,
                    placeholder: 'Descripción detallada del rubro'
                }
            ]
        };

        React.useEffect(() => {
            loadStructure();
        }, []);

        const loadStructure = async () => {
            try {
                setIsLoading(true);
                const data = await api.getBudgetStructure();
                setNodes(data || []);
            } catch (error) {
                console.error('Error loading budget structure:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleSubmit = async (formData) => {
            try {
                setIsLoading(true);
                if (selectedNode) {
                    await api.updateBudgetNode(selectedNode.id, {
                        ...formData,
                        parentId: selectedNode.parentId
                    });
                } else {
                    await api.createBudgetNode({
                        ...formData,
                        parentId: selectedNode?.id || null
                    });
                }
                await loadStructure();
                setShowForm(false);
                setSelectedNode(null);
            } catch (error) {
                console.error('Error saving budget node:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleDelete = async (nodeId) => {
            if (!confirm('¿Está seguro de eliminar este rubro? Esta acción no se puede deshacer.')) {
                return;
            }

            try {
                setIsLoading(true);
                await api.deleteBudgetNode(nodeId);
                await loadStructure();
            } catch (error) {
                console.error('Error deleting budget node:', error);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        const renderNode = (node, level = 0) => {
            const paddingLeft = `${level * 20}px`;
            
            return (
                <React.Fragment key={node.id}>
                    <div 
                        className="flex items-center p-2 hover:bg-gray-50 border-b"
                        style={{ paddingLeft }}
                    >
                        <div className="flex-1">
                            <div className="font-medium">{node.code} - {node.name}</div>
                            <div className="text-sm text-gray-500">
                                {node.type === 'group' ? 'Grupo' : 'Movimiento'} | {node.classification}
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => {
                                    setSelectedNode(node);
                                    setShowForm(true);
                                }}
                                title="Editar"
                            >
                                <i className="fas fa-edit"></i>
                            </button>
                            <button
                                className="text-green-600 hover:text-green-800"
                                onClick={() => {
                                    setSelectedNode({ parentId: node.id });
                                    setShowForm(true);
                                }}
                                title="Agregar subrubro"
                            >
                                <i className="fas fa-plus"></i>
                            </button>
                            {node.type === 'movement' && (
                                <button
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => handleDelete(node.id)}
                                    title="Eliminar"
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            )}
                        </div>
                    </div>
                    {node.children?.map(child => renderNode(child, level + 1))}
                </React.Fragment>
            );
        };

        if (isLoading) {
            return <LoadingSpinner />;
        }

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Estructura Presupuestal</h2>
                    <div className="space-x-2">
                        <button
                            className="btn-primary"
                            onClick={() => {
                                setSelectedNode(null);
                                setShowForm(true);
                            }}
                        >
                            <i className="fas fa-plus mr-2"></i>
                            Nuevo Rubro Raíz
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={onClose}
                        >
                            <i className="fas fa-times mr-2"></i>
                            Cerrar
                        </button>
                    </div>
                </div>

                {showForm && (
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {selectedNode?.id ? 'Editar Rubro' : 
                                 selectedNode?.parentId ? 'Nuevo Subrubro' : 'Nuevo Rubro Raíz'}
                            </h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => {
                                    setShowForm(false);
                                    setSelectedNode(null);
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <DynamicForm
                            formConfig={formConfig}
                            onSubmit={handleSubmit}
                            initialData={selectedNode?.id ? selectedNode : {}}
                        />
                    </div>
                )}

                <div className="card">
                    {nodes.length > 0 ? (
                        <div className="border rounded-lg">
                            {nodes.map(node => renderNode(node))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No hay rubros definidos en la estructura presupuestal
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('BudgetStructure error:', error);
        reportError(error);
        return null;
    }
}
