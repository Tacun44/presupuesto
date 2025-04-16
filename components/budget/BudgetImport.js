function BudgetImport({ onImportComplete }) {
    try {
        const [file, setFile] = React.useState(null);
        const [isLoading, setIsLoading] = React.useState(false);
        const [preview, setPreview] = React.useState([]);
        const [errors, setErrors] = React.useState([]);

        const downloadTemplate = () => {
            // Crear el contenido CSV de la plantilla
            const headers = [
                'Código Rubro',
                'Descripción',
                'Tipo Gasto',
                'Valor Inicial',
                'Observaciones'
            ].join(',');
            
            const example = [
                '2.1.2.02.02.008',
                'Servicios prestados a las empresas y servicios de producción',
                'funcionamiento',
                '1000000',
                'Rubro para servicios profesionales'
            ].join(',');

            const content = `${headers}\n${example}`;
            
            // Crear y descargar el archivo
            const blob = new Blob([content], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'plantilla_presupuesto.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        };

        const validateRow = (row, index) => {
            const errors = [];
            
            // Validar código de rubro
            if (!row['Código Rubro'] || !/^\d+(\.\d+)*$/.test(row['Código Rubro'])) {
                errors.push(`Fila ${index + 1}: Código de rubro inválido`);
            }

            // Validar descripción
            if (!row['Descripción'] || row['Descripción'].length < 5) {
                errors.push(`Fila ${index + 1}: Descripción demasiado corta`);
            }

            // Validar tipo de gasto
            const tiposValidos = ['funcionamiento', 'inversion', 'deuda'];
            if (!tiposValidos.includes(row['Tipo Gasto']?.toLowerCase())) {
                errors.push(`Fila ${index + 1}: Tipo de gasto inválido`);
            }

            // Validar valor inicial
            if (!row['Valor Inicial'] || isNaN(row['Valor Inicial']) || Number(row['Valor Inicial']) <= 0) {
                errors.push(`Fila ${index + 1}: Valor inicial inválido`);
            }

            return errors;
        };

        const handleFileChange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            setFile(file);
            setErrors([]);
            
            try {
                const text = await file.text();
                const rows = text.split('\n').map(row => row.split(','));
                const headers = rows[0];
                
                const data = rows.slice(1).map(row => {
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header.trim()] = row[index]?.trim();
                    });
                    return obj;
                });

                // Validar cada fila
                let validationErrors = [];
                data.forEach((row, index) => {
                    validationErrors = [...validationErrors, ...validateRow(row, index)];
                });

                setErrors(validationErrors);
                setPreview(data.slice(0, 5)); // Mostrar primeras 5 filas como preview
            } catch (error) {
                console.error('Error al leer el archivo:', error);
                setErrors(['Error al procesar el archivo. Asegúrese de que sea un CSV válido.']);
                reportError(error);
            }
        };

        const handleImport = async () => {
            if (!file || errors.length > 0) return;

            try {
                setIsLoading(true);
                const text = await file.text();
                const rows = text.split('\n').map(row => row.split(','));
                const headers = rows[0];
                
                const data = rows.slice(1).map(row => {
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header.trim()] = row[index]?.trim();
                    });
                    return {
                        rubroCode: obj['Código Rubro'],
                        description: obj['Descripción'],
                        expenseType: obj['Tipo Gasto'].toLowerCase(),
                        initialValue: Number(obj['Valor Inicial']),
                        observations: obj['Observaciones'] || ''
                    };
                });

                await api.importBudgetEntries(data);
                onImportComplete();
            } catch (error) {
                console.error('Error al importar:', error);
                setErrors(['Error al importar los datos. Por favor, intente nuevamente.']);
                reportError(error);
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div data-name="budget-import" className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Importar Presupuesto</h2>
                    <button
                        data-name="download-template"
                        className="btn-secondary"
                        onClick={downloadTemplate}
                    >
                        <i className="fas fa-download mr-2"></i>
                        Descargar Plantilla
                    </button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                        data-name="file-input"
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileInput"
                    />
                    <label
                        htmlFor="fileInput"
                        className="cursor-pointer block"
                    >
                        <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                        <p className="text-gray-600">
                            Arrastra tu archivo CSV aquí o haz clic para seleccionar
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Solo archivos CSV
                        </p>
                    </label>
                </div>

                {errors.length > 0 && (
                    <div data-name="error-list" className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="text-red-800 font-semibold mb-2">Errores encontrados:</h3>
                        <ul className="list-disc list-inside text-red-600">
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {preview.length > 0 && (
                    <div data-name="preview-section" className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Vista previa:</h3>
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Código Rubro</th>
                                        <th>Descripción</th>
                                        <th>Tipo</th>
                                        <th>Valor Inicial</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {preview.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row['Código Rubro']}</td>
                                            <td>{row['Descripción']}</td>
                                            <td>{row['Tipo Gasto']}</td>
                                            <td>{Number(row['Valor Inicial']).toLocaleString('es-CO')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        data-name="import-button"
                        className="btn-primary"
                        onClick={handleImport}
                        disabled={!file || errors.length > 0 || isLoading}
                    >
                        {isLoading ? (
                            <React.Fragment>
                                <i className="fas fa-spinner fa-spin mr-2"></i>
                                Importando...
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <i className="fas fa-file-import mr-2"></i>
                                Importar Datos
                            </React.Fragment>
                        )}
                    </button>
                </div>
            </div>
        );
    } catch (error) {
        console.error('BudgetImport error:', error);
        reportError(error);
        return null;
    }
}
