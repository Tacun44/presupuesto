function generatePUCAccounts() {
    const accounts = [];
    let id = 1;

    // Utility function to add account
    function addAccount(code, name, nature, type, description) {
        accounts.push({
            id: String(id++),
            code,
            name,
            nature,
            type,
            description
        });
    }

    // Clase 1 - Activos
    addAccount('1', 'ACTIVOS', 'debit', 'group', 'Recursos controlados por la entidad');
    addAccount('1.1', 'EFECTIVO Y EQUIVALENTES', 'debit', 'group', 'Recursos de liquidez inmediata');
    addAccount('1.1.05', 'CAJA', 'debit', 'group', 'Efectivo en caja');
    addAccount('1.1.05.01', 'CAJA PRINCIPAL', 'debit', 'detail', 'Caja principal de la entidad');
    addAccount('1.1.10', 'BANCOS', 'debit', 'group', 'Depósitos en instituciones financieras');
    addAccount('1.1.10.01', 'CUENTA CORRIENTE', 'debit', 'detail', 'Cuenta corriente bancaria');
    addAccount('1.1.10.02', 'CUENTA DE AHORROS', 'debit', 'detail', 'Cuenta de ahorros bancaria');

    // Clase 2 - Pasivos
    addAccount('2', 'PASIVOS', 'credit', 'group', 'Obligaciones presentes de la entidad');
    addAccount('2.1', 'PASIVOS CORRIENTES', 'credit', 'group', 'Obligaciones a corto plazo');
    addAccount('2.1.05', 'PROVEEDORES', 'credit', 'group', 'Obligaciones con proveedores');
    addAccount('2.1.05.01', 'PROVEEDORES NACIONALES', 'credit', 'detail', 'Proveedores nacionales');
    addAccount('2.1.10', 'CUENTAS POR PAGAR', 'credit', 'group', 'Otras cuentas por pagar');
    addAccount('2.1.10.01', 'SERVICIOS PÚBLICOS', 'credit', 'detail', 'Servicios públicos por pagar');

    // Clase 3 - Patrimonio
    addAccount('3', 'PATRIMONIO', 'credit', 'group', 'Capital y resultados de la entidad');
    addAccount('3.1', 'CAPITAL SOCIAL', 'credit', 'group', 'Aportes de los propietarios');
    addAccount('3.1.05', 'CAPITAL SUSCRITO Y PAGADO', 'credit', 'detail', 'Capital efectivamente pagado');

    // Clase 4 - Ingresos
    addAccount('4', 'INGRESOS', 'credit', 'group', 'Ingresos de la entidad');
    addAccount('4.1', 'INGRESOS OPERACIONALES', 'credit', 'group', 'Ingresos de la actividad principal');
    addAccount('4.1.05', 'SERVICIOS DE SALUD', 'credit', 'group', 'Ingresos por servicios de salud');
    addAccount('4.1.05.01', 'CONSULTA EXTERNA', 'credit', 'detail', 'Servicios de consulta externa');
    addAccount('4.1.05.02', 'URGENCIAS', 'credit', 'detail', 'Servicios de urgencias');
    addAccount('4.1.05.03', 'HOSPITALIZACIÓN', 'credit', 'detail', 'Servicios de hospitalización');

    // Clase 5 - Gastos
    addAccount('5', 'GASTOS', 'debit', 'group', 'Gastos de la entidad');
    addAccount('5.1', 'GASTOS OPERACIONALES', 'debit', 'group', 'Gastos de la operación principal');
    addAccount('5.1.05', 'GASTOS DE PERSONAL', 'debit', 'group', 'Gastos relacionados con el personal');
    addAccount('5.1.05.01', 'SUELDOS', 'debit', 'detail', 'Sueldos del personal');
    addAccount('5.1.05.02', 'HORAS EXTRAS', 'debit', 'detail', 'Horas extras y recargos');
    addAccount('5.1.10', 'HONORARIOS', 'debit', 'detail', 'Honorarios profesionales');

    return accounts;
}
