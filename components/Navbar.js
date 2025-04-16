function Navbar() {
    try {
        return (
            <nav data-name="navbar" className="bg-white shadow-sm fixed w-full z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <img 
                                data-name="logo"
                                src="https://via.placeholder.com/40x40" 
                                alt="Logo" 
                                className="h-8 w-8"
                            />
                            <span data-name="app-title" className="ml-2 text-xl font-semibold">
                                Sistema Presupuestal
                            </span>
                        </div>
                        <div className="flex items-center">
                            <button 
                                data-name="user-menu"
                                className="flex items-center text-gray-700 hover:text-gray-900"
                            >
                                <i className="fas fa-user-circle text-2xl mr-2"></i>
                                <span className="hidden md:block">Admin</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        );
    } catch (error) {
        console.error('Navbar error:', error);
        reportError(error);
        return null;
    }
}
