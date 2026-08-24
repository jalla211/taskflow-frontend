import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import NotificationItem from '../components/notifications/NotificationItem';
import { Bell } from 'lucide-react';

const Notifications = () => {
    const { notifications, unreadCount, markAllAsRead, loading } = useNotifications();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-xl text-gray-600">Loading notifications...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#1E3A5F]">Notifications</h1>
                    <p className="text-gray-500">
                        {unreadCount > 0
                            ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                            : 'All caught up! 🎉'}
                    </p>
                </div>
                <div className="flex gap-3">
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2E5A88] transition-colors text-sm"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No notifications yet.</p>
                    <p className="text-sm text-gray-400">You'll see notifications here when actions happen.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
                    {notifications.map(notification => (
                        <NotificationItem key={notification.id} notification={notification} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;