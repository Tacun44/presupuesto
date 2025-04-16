function App() {
    try {
        const [currentPage, setCurrentPage] = React.useState('dashboard');

        React.useEffect(() => {
            // Handle initial page load and navigation
            const path = window.location.pathname.slice(1) || 'dashboard';
            setCurrentPage(path);

            // Add event listener for navigation
            window.addEventListener('popstate', handleNavigation);
            return () => window.removeEventListener('popstate', handleNavigation);
        }, []);

        const handleNavigation = (event) => {
            const path = window.location.pathname.slice(1) || 'dashboard';
            setCurrentPage(path);
        };

        const navigate = (page) => {
            window.history.pushState({}, '', `/${page}`);
            setCurrentPage(page);
        };

        const renderPage = () => {
            switch(currentPage) {
                case 'dashboard':
                    return <Dashboard />;
                // Maestros
                case 'budget-structure':
                    return <BudgetStructure />;
                case 'chart-accounts':
                    return <ChartAccounts />;
                case 'taxes':
                    return <Taxes />;
                case 'providers':
                    return <Providers />;
                // Ciclo Presupuestal
                case 'budget':
                    return <Budget />;
                case 'cdp':
                    return <CDP />;
                case 'rp':
                    return <RP />;
                case 'op':
                    return <OP />;
                case 'payments':
                    return <Payments />;
                case 'reports':
                    return <Reports />;
                // New Database Form Demo page
                case 'form-demo':
                    return <FormDemo />;
                default:
                    return <Dashboard />;
            }
        };

        return (
            <div data-name="app-container" className="app-container">
                <Navbar />
                <Sidebar onNavigate={navigate} currentPage={currentPage} />
                <main data-name="main-content" className="main-content">
                    {renderPage()}
                </main>
            </div>
        );
    } catch (error) {
        console.error('App error:', error);
        reportError(error);
        return null;
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
