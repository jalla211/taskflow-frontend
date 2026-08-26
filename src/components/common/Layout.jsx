import React, { useState } from 'react';
import Sidebar from './Sidebar';
import NotificationBell from '../notifications/NotificationBell';
import { Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar – hidden on mobile, slides in */}
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            {/* Main content */}
            <div className="flex-1 w-full lg:ml-64">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        {/* Hamburger button (mobile) */}
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                            aria-label="Toggle sidebar"
                        >
                            {sidebarOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 sm:p-6">
                    {children}
                </main>
            </div>

            {/* Backdrop overlay (mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}
        </div>
    );
};

export default Layout;