function generateBudgetStructure() {
    const structure = [];
    let id = 1;

    // Utility function to create a budget node
    function createNode(code, name, type, classification, description, children = []) {
        return {
            id: String(id++),
            code,
            name,
            type,
            classification,
            description,
            children
        };
    }

    // Generate income structure
    const incomeStructure = createNode('1', 'INGRESOS', 'group', 'ingresos', 'Ingresos totales de la E.S.E.', [
        createNode('1.1', 'INGRESOS CORRIENTES', 'group', 'ingresos', 'Ingresos operacionales', [
            createNode('1.1.1', 'VENTA DE SERVICIOS DE SALUD', 'group', 'ingresos', 'Ingresos por servicios', [
                createNode('1.1.1.01', 'EPS RÉGIMEN CONTRIBUTIVO', 'movement', 'ingresos', 'Servicios a EPS contributivas'),
                createNode('1.1.1.02', 'EPS RÉGIMEN SUBSIDIADO', 'movement', 'ingresos', 'Servicios a EPS subsidiadas'),
                createNode('1.1.1.03', 'PLANES COMPLEMENTARIOS', 'movement', 'ingresos', 'Servicios complementarios')
            ])
        ]),
        createNode('1.2', 'RECURSOS DE CAPITAL', 'group', 'ingresos', 'Ingresos de capital', [
            createNode('1.2.1', 'RENDIMIENTOS FINANCIEROS', 'movement', 'ingresos', 'Intereses y rendimientos'),
            createNode('1.2.2', 'RECUPERACIÓN DE CARTERA', 'movement', 'ingresos', 'Recuperación de cartera')
        ])
    ]);

    // Generate expense structure
    const expenseStructure = createNode('2', 'GASTOS', 'group', 'funcionamiento', 'Gastos totales de la E.S.E.', [
        createNode('2.1', 'GASTOS DE PERSONAL', 'group', 'funcionamiento', 'Gastos de personal', [
            createNode('2.1.1', 'SERVICIOS PERSONALES ASOCIADOS A NÓMINA', 'group', 'funcionamiento', 'Gastos de nómina', [
                createNode('2.1.1.01', 'SUELDOS PERSONAL DE NÓMINA', 'movement', 'funcionamiento', 'Sueldos básicos'),
                createNode('2.1.1.02', 'HORAS EXTRAS Y FESTIVOS', 'movement', 'funcionamiento', 'Recargos y extras'),
                createNode('2.1.1.03', 'PRIMAS LEGALES', 'movement', 'funcionamiento', 'Primas de ley')
            ])
        ]),
        createNode('2.2', 'GASTOS GENERALES', 'group', 'funcionamiento', 'Gastos generales', [
            createNode('2.2.1', 'ADQUISICIÓN DE BIENES', 'group', 'funcionamiento', 'Compra de bienes', [
                createNode('2.2.1.01', 'MEDICAMENTOS', 'movement', 'funcionamiento', 'Medicamentos e insumos'),
                createNode('2.2.1.02', 'MATERIAL MÉDICO QUIRÚRGICO', 'movement', 'funcionamiento', 'Material quirúrgico'),
                createNode('2.2.1.03', 'PAPELERÍA', 'movement', 'funcionamiento', 'Útiles y papelería')
            ])
        ])
    ]);

    structure.push(incomeStructure, expenseStructure);
    return structure;
}

function generateBudgetValues(year = 2024) {
    const values = {};
    const structure = generateBudgetStructure();

    function assignRandomValues(node) {
        if (node.type === 'movement') {
            values[node.id] = Math.floor(Math.random() * 1000000000) + 100000000;
        }
        node.children?.forEach(child => assignRandomValues(child));
    }

    structure.forEach(node => assignRandomValues(node));

    return {
        [year]: {
            status: 'draft',
            values
        }
    };
}
