import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Save, Bell } from 'lucide-react';

const NotificationPreferences = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preferences, setPreferences] = useState({
        task_assignment: true,
        status_change: true,
        mention: true,
        deadline_reminder: true,
        overdue: true,
        email_notifications: false,
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPreferences();
    }, []);

    const fetchPreferences = async () => {
        try {
            const res = await api.get('/notification-preferences');
            setPreferences(res.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load preferences');
            setLoading(false);
        }
    };

    const handleToggle = (key) => {
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccess('');
        setError('');

        try {
            await api.put('/notification-preferences', preferences);
            setSuccess('Preferences updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to update preferences');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-xl text-gray-600">Loading preferences...</div>
            </div>
        );
    }

    const toggleItems = [
        { key: 'task_assignment', label: 'Task Assignment', description: 'When a task is assigned to you' },
        { key: 'status_change', label: 'Status Change', description: 'When a task you own changes status' },
        { key: 'mention', label: '@Mentions', description: 'When someone mentions you in a comment' },
        { key: 'deadline_reminder', label: 'Deadline Reminders', description: 'When a task deadline is approaching' },
        { key: 'overdue', label: 'Overdue Alerts', description: 'When a task becomes overdue' },
        { key: 'email_notifications', label: 'Email Notifications', description: 'Receive notifications via email as well' },
    ];

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1E3A5F] flex items-center gap-2">
                    <Bell className="w-6 h-6" />
                    Notification Preferences
                </h1>
                <p className="text-gray-500 mt-1">Choose what notifications you want to receive.</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">{success}</div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                {toggleItems.map(({ key, label, description }) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div>
                            <p className="font-medium text-gray-700">{label}</p>
                            <p className="text-sm text-gray-500">{description}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleToggle(key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences[key] ? 'bg-[#1E3A5F]' : 'bg-gray-300'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    preferences[key] ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full mt-4 px-4 py-3 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2E5A88] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Preferences'}
                </button>
            </form>
        </div>
    );
};

export default NotificationPreferences;