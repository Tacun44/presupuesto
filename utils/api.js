const API_BASE_URL = 'https://api.example.com';

async function fetchWithAuth(endpoint, options = {}) {
    try {
        // Simulación de respuesta para desarrollo
        if (endpoint === '/budget/structure') {
            return Promise.resolve(window.mockBudgetStructure);
        }

        if (endpoint === '/budget/items') {
            return Promise.resolve(window.mockBudgetItems);
        }

        if (endpoint === '/puc-accounts') {
            return Promise.resolve(window.mockPUCAccounts);
        }

        if (endpoint === '/taxes') {
            return Promise.resolve(window.mockTaxes);
        }

        if (endpoint === '/providers') {
            return Promise.resolve(window.mockProviders);
        }

        if (endpoint.startsWith('/budget/values/')) {
            const year = endpoint.split('/').pop();
            return Promise.resolve(window.mockBudgetData[year] || { status: 'draft', values: {} });
        }

        if (endpoint === '/cdps') {
            return Promise.resolve(window.mockCDPs);
        }

        if (endpoint === '/rps') {
            return Promise.resolve(window.mockRPs);
        }

        if (endpoint === '/ops') {
            return Promise.resolve(window.mockOPs);
        }

        if (endpoint === '/payments') {
            return Promise.resolve(window.mockPayments);
        }

        // Si no es una ruta simulada, intentar hacer la llamada real
        const token = localStorage.getItem('authToken');
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        // En desarrollo, devolver datos simulados según el endpoint
        switch (true) {
            case endpoint === '/budget/structure':
                return window.mockBudgetStructure;
            case endpoint === '/budget/items':
                return window.mockBudgetItems;
            case endpoint === '/puc-accounts':
                return window.mockPUCAccounts;
            case endpoint === '/taxes':
                return window.mockTaxes;
            case endpoint === '/providers':
                return window.mockProviders;
            case endpoint.startsWith('/budget/values/'):
                const year = endpoint.split('/').pop();
                return { status: 'draft', values: window.mockBudgetData[year]?.values || {} };
            case endpoint === '/cdps':
                return window.mockCDPs;
            case endpoint === '/rps':
                return window.mockRPs;
            case endpoint === '/ops':
                return window.mockOPs;
            case endpoint === '/payments':
                return window.mockPayments;
            default:
                throw error;
        }
    }
}

// Make api object available globally
window.api = {
    // PUC Accounts endpoints
    getPUCAccounts: () => fetchWithAuth('/puc-accounts'),
    createPUCAccount: (data) => fetchWithAuth('/puc-accounts', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updatePUCAccount: (id, data) => fetchWithAuth(`/puc-accounts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    deletePUCAccount: (id) => fetchWithAuth(`/puc-accounts/${id}`, {
        method: 'DELETE'
    }),

    // Taxes endpoints
    getTaxes: () => fetchWithAuth('/taxes'),
    createTax: (data) => fetchWithAuth('/taxes', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateTax: (id, data) => fetchWithAuth(`/taxes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    deleteTax: (id) => fetchWithAuth(`/taxes/${id}`, {
        method: 'DELETE'
    }),

    // Providers endpoints
    getProviders: () => fetchWithAuth('/providers'),
    createProvider: (data) => fetchWithAuth('/providers', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateProvider: (id, data) => fetchWithAuth(`/providers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    deleteProvider: (id) => fetchWithAuth(`/providers/${id}`, {
        method: 'DELETE'
    }),

    // Budget Structure endpoints
    getBudgetStructure: () => fetchWithAuth('/budget/structure'),
    createBudgetNode: (data) => fetchWithAuth('/budget/structure', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateBudgetNode: (id, data) => fetchWithAuth(`/budget/structure/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    deleteBudgetNode: (id) => fetchWithAuth(`/budget/structure/${id}`, {
        method: 'DELETE'
    }),

    // Budget Items endpoints
    getBudgetItems: () => fetchWithAuth('/budget/items'),
    createBudgetItem: (data) => fetchWithAuth('/budget/items', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateBudgetItem: (id, data) => fetchWithAuth(`/budget/items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    deleteBudgetItem: (id) => fetchWithAuth(`/budget/items/${id}`, {
        method: 'DELETE'
    }),

    // Budget Values endpoints
    getBudgetValues: (year) => fetchWithAuth(`/budget/values/${year}`),
    saveBudgetValues: (year, values) => fetchWithAuth(`/budget/values/${year}`, {
        method: 'POST',
        body: JSON.stringify(values)
    }),
    approveBudget: (year) => fetchWithAuth(`/budget/approve/${year}`, {
        method: 'POST'
    }),

    // CDP endpoints
    getCDPs: () => fetchWithAuth('/cdps'),
    createCDP: (data) => fetchWithAuth('/cdps', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateCDP: (id, data) => fetchWithAuth(`/cdps/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    approveCDP: (id) => fetchWithAuth(`/cdps/${id}/approve`, {
        method: 'POST'
    }),
    rejectCDP: (id, reason) => fetchWithAuth(`/cdps/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify(reason)
    }),
    cancelCDP: (id) => fetchWithAuth(`/cdps/${id}/cancel`, {
        method: 'POST'
    }),

    // RP endpoints
    getRPs: () => fetchWithAuth('/rps'),
    createRP: (data) => fetchWithAuth('/rps', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateRP: (id, data) => fetchWithAuth(`/rps/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    approveRP: (id) => fetchWithAuth(`/rps/${id}/approve`, {
        method: 'POST'
    }),
    rejectRP: (id, reason) => fetchWithAuth(`/rps/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify(reason)
    }),
    cancelRP: (id) => fetchWithAuth(`/rps/${id}/cancel`, {
        method: 'POST'
    }),

    // OP endpoints
    getOPs: () => fetchWithAuth('/ops'),
    createOP: (data) => fetchWithAuth('/ops', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateOP: (id, data) => fetchWithAuth(`/ops/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    approveOP: (id) => fetchWithAuth(`/ops/${id}/approve`, {
        method: 'POST'
    }),
    rejectOP: (id, reason) => fetchWithAuth(`/ops/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify(reason)
    }),

    // Payment endpoints
    getPayments: () => fetchWithAuth('/payments'),
    createPayment: (data) => fetchWithAuth('/payments', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updatePayment: (id, data) => fetchWithAuth(`/payments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    approvePayment: (id) => fetchWithAuth(`/payments/${id}/approve`, {
        method: 'POST'
    }),
    voidPayment: (id) => fetchWithAuth(`/payments/${id}/void`, {
        method: 'POST'
    })
};
