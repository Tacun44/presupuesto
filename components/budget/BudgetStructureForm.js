function BudgetStructureForm({ onClose }) {
    try {
        const [activeTab, setActiveTab] = React.useState('tree');
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
                    placeholder: 'Ej: 2.1.2',
                    gridColumn: 1
                },
                {
                    type: 'text',
                    label: 'Nombre',
                    name: 'name',
                    required: true,
                    placeholder: 'Nombre del rubro',
                    gridColumn: 2
                },
                {
                    type: 'select',
                    label: 'Tipo',
                    name: 'type',
                    required: true,
                    options: [
                        { value: 'group', label: 'Grupo (No permite movimientos)' },
                        { value: 'movement', label: 'Movimiento (Permite asignación)' }
                    ],
                    gridColumn: 1
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
                    ],
                    gridColumn: 2
                },
                {
                    type: 'textarea',
                    label: 'Descripción',
                    name: 'description',
                    required: true,
                    placeholder: 'Descripción detallada del rubro',
                    gridColumn: 'span 2'
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
                if (selectedNode?.id) {
                    await api.updateBudgetNode(selectedNode.id, formData);
                } else {
                    await api.createBudgetNode({
                        ...formData,
                        parentId: selectedNode?.parentId || null
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

        const renderTreeView = () => {
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

            return (
                <div className="border rounded-lg">
                    {nodes.map(node => renderNode(node))}
                </div>
            );
        };

        const renderGridView = () => {
            const flattenNodes = (nodes, parent = '') => {
                let result = [];
                nodes.forEach(node => {
                    result.push({
                        ...node,
                        parent: parent
                    });
                    if (node.children?.length) {
                        result = [...result, ...flattenNodes(node.children, node.name)];
                    }
                });
                return result;
            };

            const flatNodes = flattenNodes(nodes);

            return (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Código</th>
                                <th className="border px-4 py-2">Nombre</th>
                                <th className="border px-4 py-2">Tipo</th>
                                <th className="border px-4 py-2">Clasificación</th>
                                <th className="border px-4 py-2">Padre</th>
                                <th className="border px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flatNodes.map((node) => (
                                <tr key={node.id} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2">{node.code}</td>
                                    <td className="border px-4 py-2">{node.name}</td>
                                    <td className="border px-4 py-2">{node.type}</td>
                                    <td className="border px-4 py-2">{node.classification}</td>
                                    <td className="border px-4 py-2">{node.parent}</td>
                                    <td className="border px-4 py-2">
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
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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

                <div className="border-b mb-4">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('tree')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'tree'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <i className="fas fa-sitemap mr-2"></i>
                            Vista Árbol
                        </button>
                        <button
                            onClick={() => setActiveTab('grid')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'grid'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <i className="fas fa-table mr-2"></i>
                            Vista Tabla
                        </button>
                    </nav>
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
                        <div className="grid grid-cols-2 gap-4">
                            <DynamicForm
                                formConfig={formConfig}
                                onSubmit={handleSubmit}
                                initialData={selectedNode?.id ? selectedNode : {}}
                            />
                        </div>
                    </div>
                )}

                <div className="card">
                    {nodes.length > 0 ? (
                        activeTab === 'tree' ? renderTreeView() : renderGridView()
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No hay rubros definidos en la estructura presupuestal
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('BudgetStructureForm error:', error);
        reportError(error);
        return null;
    }
}
