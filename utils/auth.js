function login(username, password) {
    try {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (username === 'admin' && password === 'admin123') {
                    const token = 'mock-jwt-token';
                    localStorage.setItem('authToken', token);
                    resolve({ token, user: { username, role: 'admin' } });
                } else {
                    reject(new Error('Credenciales inválidas'));
                }
            }, 1000);
        });
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

function logout() {
    try {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

function getAuthToken() {
    try {
        return localStorage.getItem('authToken');
    } catch (error) {
        console.error('Get auth token error:', error);
        throw error;
    }
}

function isAuthenticated() {
    try {
        const token = getAuthToken();
        return !!token;
    } catch (error) {
        console.error('Is authenticated error:', error);
        throw error;
    }
}
