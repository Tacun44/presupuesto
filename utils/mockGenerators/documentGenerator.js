function generateCDPs(budgetItems, year = 2024) {
    const cdps = [];
    const statuses = ['draft', 'pending', 'approved', 'rejected', 'cancelled'];
    const users = ['Juan Pérez', 'María Rodríguez', 'Carlos López', 'Ana Martínez'];

    for (let i = 1; i <= 10; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const budgetItem = budgetItems[Math.floor(Math.random() * budgetItems.length)];
        const requestedBy = users[Math.floor(Math.random() * users.length)];
        const amount = Math.floor(Math.random() * 100000000) + 10000000;

        cdps.push({
            id: `CDP${String(i).padStart(3, '0')}`,
            number: `CDP-${year}-${String(i).padStart(3, '0')}`,
            date: new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
            budgetItemId: budgetItem.id,
            amount,
            status,
            requestedBy,
            description: `Solicitud de disponibilidad para ${budgetItem.name.toLowerCase()}`,
            justification: `Necesidad de recursos para ${budgetItem.name.toLowerCase()} según plan de compras ${year}`
        });
    }

    return cdps;
}

function generateRPs(cdps, providers, year = 2024) {
    const rps = [];
    const statuses = ['draft', 'pending', 'approved', 'rejected', 'cancelled'];

    cdps.filter(cdp => cdp.status === 'approved').forEach((cdp, index) => {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const provider = providers[Math.floor(Math.random() * providers.length)];
        const amount = Math.floor(cdp.amount * 0.9); // Slightly less than CDP amount

        rps.push({
            id: `RP${String(index + 1).padStart(3, '0')}`,
            number: `RP-${year}-${String(index + 1).padStart(3, '0')}`,
            date: new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
            cdpId: cdp.id,
            providerId: provider.id,
            amount,
            status,
            description: `Registro presupuestal para ${provider.name} según CDP ${cdp.number}`
        });
    });

    return rps;
}

function generateOPs(rps, providers, year = 2024) {
    const ops = [];
    const statuses = ['draft', 'pending', 'approved', 'rejected'];

    rps.filter(rp => rp.status === 'approved').forEach((rp, index) => {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const provider = providers.find(p => p.id === rp.providerId);
        const grossAmount = rp.amount;
        const taxAmount = Math.floor(grossAmount * 0.19); // 19% IVA
        const retentionAmount = Math.floor(grossAmount * 0.04); // 4% retención
        const netAmount = grossAmount + taxAmount - retentionAmount;

        ops.push({
            id: `OP${String(index + 1).padStart(3, '0')}`,
            number: `OP-${year}-${String(index + 1).padStart(3, '0')}`,
            date: new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
            rpId: rp.id,
            providerId: provider.id,
            invoiceNumber: `FACT-${year}-${String(Math.floor(Math.random() * 1000) + 1).padStart(3, '0')}`,
            invoiceDate: new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
            grossAmount,
            taxAmount,
            retentionAmount,
            netAmount,
            status,
            description: `Obligación de pago a ${provider.name} según RP ${rp.number}`
        });
    });

    return ops;
}

function generatePayments(ops, providers, year = 2024) {
    const payments = [];
    const statuses = ['pending', 'approved', 'voided'];
    const paymentMethods = ['Transferencia', 'Cheque', 'ACH'];

    ops.filter(op => op.status === 'approved').forEach((op, index) => {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const provider = providers.find(p => p.id === op.providerId);
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

        payments.push({
            id: `PAG${String(index + 1).padStart(3, '0')}`,
            number: `PAG-${year}-${String(index + 1).padStart(3, '0')}`,
            date: new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
            opId: op.id,
            providerId: provider.id,
            paymentMethod,
            reference: `${paymentMethod === 'Cheque' ? 'CH' : 'TR'}-${String(Math.floor(Math.random() * 10000) + 1).padStart(5, '0')}`,
            amount: op.netAmount,
            status,
            observations: `Pago a ${provider.name} según OP ${op.number}`
        });
    });

    return payments;
}
