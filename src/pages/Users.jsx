import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Users = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '',
        phone: '',
    });

    // Check if user is admin directly
    const isAdmin = user?.role?.slug === 'admin';

    // Only Admin can access
    if (!isAdmin) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-700 p-4 rounded-md">
                    Access Denied. Only Administrators can view this page.
                </div>
            </div>
        );
    }

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Fetch users error:', err);
            setError('Failed to load users');
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await api.get('/roles');
            setRoles(response.data);
        } catch (err) {
            console.error('Fetch roles error:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editingUser) {
                const updateData = {
                    name: formData.name,
                    email: formData.email,
                    role_id: formData.role_id,
                    phone: formData.phone,
                };
                await api.put(`/users/${editingUser.id}`, updateData);
                setSuccess('User updated successfully!');
            } else {
                await api.post('/users', formData);
                setSuccess('User created successfully!');
            }
            setShowModal(false);
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', password_confirmation: '', role_id: '', phone: '' });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save user');
        }
    };

    const handleDeactivate = async (id) => {
        if (window.confirm('Are you sure you want to deactivate this user?')) {
            try {
                await api.put(`/users/${id}/deactivate`);
                fetchUsers();
                setSuccess('User deactivated successfully!');
            } catch (err) {
                setError('Failed to deactivate user');
            }
        }
    };

    const handleReactivate = async (id) => {
        try {
            await api.put(`/users/${id}/reactivate`);
            fetchUsers();
            setSuccess('User reactivated successfully!');
        } catch (err) {
            setError('Failed to reactivate user');
        }
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', password_confirmation: '', role_id: '', phone: '' });
        setShowModal(true);
        setError('');
        setSuccess('');
    };

    const openEditModal = (userItem) => {
        setEditingUser(userItem);
        setFormData({
            name: userItem.name,
            email: userItem.email,
            role_id: userItem.role_id,
            phone: userItem.phone || '',
            password: '',
            password_confirmation: '',
        });
        setShowModal(true);
        setError('');
        setSuccess('');
    };

    const getRoleColor = (roleSlug) => {
        switch (roleSlug) {
            case 'admin':
                return 'bg-purple-100 text-purple-700';
            case 'project-manager':
                return 'bg-blue-100 text-blue-700';
            case 'team-leader':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-2xl">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#1E3A5F]">User Management</h1>
                    <p className="text-gray-600">Manage system users and their roles</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="bg-[#1E3A5F] text-white px-4 py-2 rounded-md hover:bg-[#2E5A88] transition-colors"
                >
                    + New User
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                    {success}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((userItem) => (
                                <tr key={userItem.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{userItem.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{userItem.email}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(userItem.role?.slug)}`}>
                                            {userItem.role?.name || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            userItem.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {userItem.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{userItem.phone || '—'}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(userItem)}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                Edit
                                            </button>
                                            {userItem.is_active ? (
                                                <button
                                                    onClick={() => handleDeactivate(userItem.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleReactivate(userItem.id)}
                                                    className="text-green-600 hover:text-green-800 text-sm"
                                                >
                                                    Reactivate
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No users found. Create your first user!</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4 text-[#1E3A5F]">
                            {editingUser ? 'Edit User' : 'Create New User'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    required
                                />
                            </div>
                            {!editingUser && (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                            required={!editingUser}
                                            minLength="8"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Confirm Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password_confirmation}
                                            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                            required={!editingUser}
                                        />
                                    </div>
                                </>
                            )}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.role_id}
                                    onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    required
                                >
                                    <option value="">Select Role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#1E3A5F] text-white py-2 px-4 rounded-md hover:bg-[#2E5A88] transition-colors"
                                >
                                    {editingUser ? 'Update User' : 'Create User'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingUser(null);
                                        setError('');
                                        setSuccess('');
                                    }}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;