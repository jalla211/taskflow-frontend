import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        role: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                email: user.email || '',
                role: user.role?.name || '',
            });
            setProfilePicture(user.profile_picture || '');
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // 1. Update profile info (name/phone)
            await api.put('/profile', {
                name: formData.name,
                phone: formData.phone,
            });

            // 2. Upload picture if selected
            if (selectedFile) {
                const formDataFile = new FormData();
                formDataFile.append('profile_picture', selectedFile);
                await api.post('/profile/picture', formDataFile, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                // Clear the selected file after upload
                setSelectedFile(null);
                setPreviewUrl('');
            }

            // 3. Refresh user data
            const response = await api.get('/me');
            const updatedUser = response.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setProfilePicture(updatedUser.profile_picture || '');

            setSuccess('Profile updated successfully!');
            setLoading(false);

            // Reload to reflect changes in navbar (or we can use context)
            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (!user) {
        return (
            <div className="p-6">
                <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
                    Please login to view your profile.
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-[#1E3A5F] mb-6">My Profile</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
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

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-[#1E3A5F] flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : profilePicture ? (
                                    <img
                                        src={`https://taskflow-backend-ck9g.onrender.com/storage/${profilePicture}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>{getInitials(formData.name)}</span>
                                )}
                            </div>
                            <label
                                htmlFor="profile-picture-input"
                                className="absolute bottom-0 right-0 bg-[#1E3A5F] text-white rounded-full p-2 cursor-pointer hover:bg-[#2E5A88] transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </label>
                            <input
                                id="profile-picture-input"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                            Click the camera icon to upload a photo
                        </p>
                        {selectedFile && (
                            <button
                                onClick={() => {
                                    setSelectedFile(null);
                                    setPreviewUrl('');
                                }}
                                className="text-sm text-red-600 hover:text-red-800"
                            >
                                Remove selected photo
                            </button>
                        )}
                    </div>

                    {/* Profile Form */}
                    <div className="flex-1">
                        <form onSubmit={handleProfileUpdate}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Full Name
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
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Role
                                </label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">Role assigned by Admin</p>
                            </div>

                            <div className="mb-4">
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#1E3A5F] text-white py-2 px-4 rounded-md hover:bg-[#2E5A88] transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Tips Section */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800">Profile Tips:</h3>
                <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                    <li>Click the camera icon on your avatar to upload a profile picture</li>
                    <li>You can update your name and phone number anytime</li>
                    <li>Email and Role are managed by the Administrator</li>
                </ul>
            </div>
        </div>
    );
};

export default Profile;