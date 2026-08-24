import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = ({ onClose }) => {
    const { notifications, unreadCount, markAllAsRead } = useNotifications();

    const recentNotifications = notifications.slice(0, 5);

    return (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-700">Notifications</h3>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={() => { markAllAsRead(); onClose(); }}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Mark all read
                        </button>
                    )}
                    <Link
                        to="/notifications"
                        onClick={onClose}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        View all
                    </Link>
                </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
                {recentNotifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                        No notifications yet.
                    </div>
                ) : (
                    recentNotifications.map(notification => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onClose={onClose}
                        />
                    ))
                )}
            </div>

            {/* Footer */}
            {notifications.length > 5 && (
                <div className="p-3 border-t border-gray-200 text-center">
                    <Link
                        to="/notifications"
                        onClick={onClose}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        See all {notifications.length} notifications
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;