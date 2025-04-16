function generateTaxes() {
    return [
        {
            id: '1',
            name: 'IVA 19%',
            type: 'iva',
            percentage: 19,
            accountCode: '2.4.08.05',
            description: 'Impuesto al Valor Agregado'
        },
        {
            id: '2',
            name: 'ReteFuente Servicios 4%',
            type: 'retefuente',
            percentage: 4,
            accountCode: '2.4.36.05',
            description: 'Retención en la Fuente por Servicios'
        },
        {
            id: '3',
            name: 'ReteFuente Honorarios 10%',
            type: 'retefuente',
            percentage: 10,
            accountCode: '2.4.36.10',
            description: 'Retención en la Fuente por Honorarios'
        },
        {
            id: '4',
            name: 'ReteFuente Compras 2.5%',
            type: 'retefuente',
            percentage: 2.5,
            accountCode: '2.4.36.15',
            description: 'Retención en la Fuente por Compras'
        },
        {
            id: '5',
            name: 'ReteICA 0.69%',
            type: 'reteica',
            percentage: 0.69,
            accountCode: '2.4.40.05',
            description: 'Retención de Industria y Comercio'
        },
        {
            id: '6',
            name: 'ReteIVA 15%',
            type: 'reteiva',
            percentage: 15,
            accountCode: '2.4.37.05',
            description: 'Retención de IVA'
        }
    ];
}
