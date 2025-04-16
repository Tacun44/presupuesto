// Mock data for Budget Items (rubros presupuestales)
const mockBudgetItems = [
    {
        id: '1',
        code: '2.1.2.01',
        name: 'MEDICAMENTOS E INSUMOS HOSPITALARIOS',
        type: 'movement',
        classification: 'funcionamiento',
        description: 'Adquisición de medicamentos e insumos médicos',
        available: 300000000
    },
    {
        id: '2',
        code: '2.1.2.02',
        name: 'MATERIALES Y SUMINISTROS',
        type: 'movement',
        classification: 'funcionamiento',
        description: 'Materiales y suministros generales',
        available: 150000000
    },
    {
        id: '3',
        code: '2.1.2.03',
        name: 'SERVICIOS PÚBLICOS',
        type: 'movement',
        classification: 'funcionamiento',
        description: 'Servicios públicos de la entidad',
        available: 100000000
    }
];

// Mock data for PUC Accounts (Plan Único de Cuentas)
const mockPUCAccounts = [
    // Clase 1 - Activos
    {
        id: '1',
        code: '1',
        name: 'ACTIVOS',
        nature: 'debit',
        type: 'group',
        description: 'Recursos controlados por la entidad'
    },
    {
        id: '11',
        code: '1.1',
        name: 'EFECTIVO Y EQUIVALENTES AL EFECTIVO',
        nature: 'debit',
        type: 'group',
        description: 'Recursos de liquidez inmediata'
    },
    {
        id: '1105',
        code: '1.1.05',
        name: 'CAJA',
        nature: 'debit',
        type: 'group',
        description: 'Efectivo en caja'
    },
    {
        id: '110505',
        code: '1.1.05.05',
        name: 'CAJA GENERAL',
        nature: 'debit',
        type: 'detail',
        description: 'Efectivo en caja general'
    },
    {
        id: '1110',
        code: '1.1.10',
        name: 'BANCOS',
        nature: 'debit',
        type: 'group',
        description: 'Depósitos en instituciones financieras'
    },
    {
        id: '111005',
        code: '1.1.10.05',
        name: 'CUENTA CORRIENTE',
        nature: 'debit',
        type: 'detail',
        description: 'Depósitos en cuenta corriente'
    },
    // Clase 2 - Pasivos
    {
        id: '2',
        code: '2',
        name: 'PASIVOS',
        nature: 'credit',
        type: 'group',
        description: 'Obligaciones presentes de la entidad'
    },
    {
        id: '21',
        code: '2.1',
        name: 'PASIVOS CORRIENTES',
        nature: 'credit',
        type: 'group',
        description: 'Obligaciones a corto plazo'
    },
    {
        id: '2105',
        code: '2.1.05',
        name: 'PROVEEDORES',
        nature: 'credit',
        type: 'group',
        description: 'Obligaciones con proveedores'
    },
    {
        id: '210505',
        code: '2.1.05.05',
        name: 'PROVEEDORES NACIONALES',
        nature: 'credit',
        type: 'detail',
        description: 'Obligaciones con proveedores nacionales'
    },
    // Clase 3 - Patrimonio
    {
        id: '3',
        code: '3',
        name: 'PATRIMONIO',
        nature: 'credit',
        type: 'group',
        description: 'Capital y resultados de la entidad'
    },
    {
        id: '31',
        code: '3.1',
        name: 'CAPITAL SOCIAL',
        nature: 'credit',
        type: 'group',
        description: 'Aportes de los propietarios'
    },
    {
        id: '3105',
        code: '3.1.05',
        name: 'CAPITAL SUSCRITO Y PAGADO',
        nature: 'credit',
        type: 'detail',
        description: 'Capital efectivamente pagado'
    },
    // Clase 4 - Ingresos
    {
        id: '4',
        code: '4',
        name: 'INGRESOS',
        nature: 'credit',
        type: 'group',
        description: 'Ingresos de la entidad'
    },
    {
        id: '41',
        code: '4.1',
        name: 'INGRESOS OPERACIONALES',
        nature: 'credit',
        type: 'group',
        description: 'Ingresos de la actividad principal'
    },
    {
        id: '4105',
        code: '4.1.05',
        name: 'SERVICIOS DE SALUD',
        nature: 'credit',
        type: 'group',
        description: 'Ingresos por servicios de salud'
    },
    {
        id: '410505',
        code: '4.1.05.05',
        name: 'UNIDAD FUNCIONAL DE URGENCIAS',
        nature: 'credit',
        type: 'detail',
        description: 'Ingresos por servicios de urgencias'
    },
    // Clase 5 - Gastos
    {
        id: '5',
        code: '5',
        name: 'GASTOS',
        nature: 'debit',
        type: 'group',
        description: 'Gastos de la entidad'
    },
    {
        id: '51',
        code: '5.1',
        name: 'GASTOS OPERACIONALES',
        nature: 'debit',
        type: 'group',
        description: 'Gastos de la operación principal'
    },
    {
        id: '5105',
        code: '5.1.05',
        name: 'GASTOS DE PERSONAL',
        nature: 'debit',
        type: 'group',
        description: 'Gastos relacionados con el personal'
    }
];

// Mock data for Taxes
const mockTaxes = [
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
        name: 'ReteICA 0.69%',
        type: 'reteica',
        percentage: 0.69,
        accountCode: '2.4.40.05',
        description: 'Retención de Industria y Comercio'
    }
];

// Mock data for Providers
const mockProviders = [
    {
        id: '1',
        taxId: '900123456-7',
        name: 'SUMINISTROS MÉDICOS S.A.',
        type: 'juridica',
        regime: 'comun',
        address: 'Calle 123 #45-67',
        phone: '3001234567',
        email: 'contacto@suministrosmedicos.com',
        contact: 'Juan Pérez',
        observations: 'Proveedor principal de insumos médicos'
    },
    {
        id: '2',
        taxId: '901234567-8',
        name: 'EQUIPOS HOSPITALARIOS LTDA.',
        type: 'juridica',
        regime: 'comun',
        address: 'Carrera 78 #90-12',
        phone: '3109876543',
        email: 'ventas@equiposhospitalarios.com',
        contact: 'María Rodríguez',
        observations: 'Proveedor de equipos médicos especializados'
    },
    {
        id: '3',
        taxId: '12345678-9',
        name: 'DR. CARLOS GONZÁLEZ',
        type: 'natural',
        regime: 'simplificado',
        address: 'Avenida 45 #23-45',
        phone: '3157894561',
        email: 'dr.gonzalez@gmail.com',
        contact: 'Carlos González',
        observations: 'Prestador de servicios profesionales'
    }
];

// Mock data for Budget Structure
window.mockBudgetStructure = mockBudgetStructure;

// Mock data for Budget Values
window.mockBudgetData = {
    2024: {
        status: 'draft',
        values: {
            '1': 1000000000,
            '1.1': 500000000,
            '1.1.1': 300000000
        }
    }
};

// Mock data for CDPs
window.mockCDPs = [
    {
        id: 'CDP001',
        number: 'CDP-2024-001',
        date: '2024-01-15',
        budgetItemId: '1',
        amount: 50000000,
        status: 'approved',
        requestedBy: 'Juan Pérez',
        description: 'Compra de medicamentos primer trimestre',
        justification: 'Abastecimiento programado Q1 2024'
    },
    {
        id: 'CDP002',
        number: 'CDP-2024-002',
        date: '2024-01-16',
        budgetItemId: '2',
        amount: 25000000,
        status: 'pending',
        requestedBy: 'María Rodríguez',
        description: 'Materiales de oficina',
        justification: 'Suministros administrativos Q1 2024'
    }
];

// Mock data for RPs
window.mockRPs = [
    {
        id: 'RP001',
        number: 'RP-2024-001',
        date: '2024-01-17',
        cdpId: 'CDP001',
        providerId: '1',
        amount: 45000000,
        status: 'approved',
        description: 'Contrato suministro de medicamentos'
    },
    {
        id: 'RP002',
        number: 'RP-2024-002',
        date: '2024-01-18',
        cdpId: 'CDP002',
        providerId: '2',
        amount: 20000000,
        status: 'pending',
        description: 'Orden de compra materiales'
    }
];

// Mock data for OPs
window.mockOPs = [
    {
        id: 'OP001',
        number: 'OP-2024-001',
        date: '2024-01-20',
        rpId: 'RP001',
        providerId: '1',
        invoiceNumber: 'FACT-001',
        invoiceDate: '2024-01-19',
        grossAmount: 45000000,
        taxAmount: 8550000,
        retentionAmount: 4500000,
        netAmount: 49050000,
        status: 'approved',
        description: 'Pago factura medicamentos'
    }
];

// Mock data for Payments
window.mockPayments = [
    {
        id: 'PAG001',
        number: 'PAG-2024-001',
        date: '2024-01-25',
        opId: 'OP001',
        providerId: '1',
        paymentMethod: 'Transferencia',
        reference: 'TRANS-001',
        amount: 49050000,
        status: 'approved',
        observations: 'Pago realizado a cuenta bancaria registrada'
    }
];

// Make mock data available globally
window.mockBudgetItems = mockBudgetItems;
window.mockPUCAccounts = mockPUCAccounts;
window.mockTaxes = mockTaxes;
window.mockProviders = mockProviders;
