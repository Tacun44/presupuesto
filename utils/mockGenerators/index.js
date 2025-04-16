function generateMockDatabase(year = 2024) {
    // Generate basic data
    const accounts = generatePUCAccounts();
    const taxes = generateTaxes();
    const providers = generateProviders();
    const budgetStructure = generateBudgetStructure();
    const budgetValues = generateBudgetValues(year);

    // Generate documents
    const cdps = generateCDPs(budgetStructure, year);
    const rps = generateRPs(cdps, providers, year);
    const ops = generateOPs(rps, providers, year);
    const payments = generatePayments(ops, providers, year);

    // Make data available globally
    window.mockPUCAccounts = accounts;
    window.mockTaxes = taxes;
    window.mockProviders = providers;
    window.mockBudgetStructure = budgetStructure;
    window.mockBudgetData = budgetValues;
    window.mockCDPs = cdps;
    window.mockRPs = rps;
    window.mockOPs = ops;
    window.mockPayments = payments;

    console.log('Mock database generated successfully:', {
        accounts: accounts.length,
        taxes: taxes.length,
        providers: providers.length,
        budgetNodes: budgetStructure.length,
        cdps: cdps.length,
        rps: rps.length,
        ops: ops.length,
        payments: payments.length
    });

    return {
        accounts,
        taxes,
        providers,
        budgetStructure,
        budgetValues,
        cdps,
        rps,
        ops,
        payments
    };
}
