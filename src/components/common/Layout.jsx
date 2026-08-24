import React from 'react';
import Sidebar from './Sidebar';
import NotificationBell from '../notifications/NotificationBell';

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-64">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Notification Bell */}
                        <NotificationBell />
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;