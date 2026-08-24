import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAdmin, isProjectManager } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-[#1E3A5F] text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/dashboard" className="text-xl font-bold">
                            TaskFlow
                        </Link>
                        <div className="flex space-x-4">
                            <Link to="/dashboard" className="hover:text-gray-300 transition">
                                Dashboard
                            </Link>
                            <Link to="/projects" className="hover:text-gray-300 transition">
                                Projects
                            </Link>
                            <Link to="/tasks" className="hover:text-gray-300 transition">
                                Tasks
                            </Link>
                            {isAdmin() && (
                                <Link to="/users" className="hover:text-gray-300 transition">
                                    Users
                                </Link>
                            )}
                            {isAdmin() && (
                                <Link to="/admin" className="hover:text-gray-300 transition">
                                    Admin
                                </Link>
                            )}
                            {(isAdmin() || isProjectManager()) && (
                                <Link to="/reports" className="hover:text-gray-300 transition">
                                    Reports
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                       <Link
    to="/profile"
    className="flex items-center gap-2 text-sm hover:text-gray-300 transition px-3 py-1 rounded-md hover:bg-white/10"
>
    {/* Profile Picture or Default Icon */}
    <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
        {user?.profile_picture ? (
            <img
                src={`/storage/${user?.profile_picture}`}
                alt={user.name}
                className="w-full h-full object-cover"
            />
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        )}
    </div>
    <span>{user?.name}</span>
    <span className="text-xs opacity-70">({user?.role?.name})</span>
</Link>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;