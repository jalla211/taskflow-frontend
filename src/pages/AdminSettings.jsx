import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminSettings = () => {
    const { user } = useAuth();

    if (!user?.isAdmin()) {
        return (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">
                Access Denied. Only Administrators can view this page.
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F] mb-4">Admin Settings</h1>
            <p className="text-gray-600">Admin settings page coming soon...</p>
        </div>
    );
};

export default AdminSettings;