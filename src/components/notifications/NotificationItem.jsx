import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';

const NotificationItem = ({ notification, onClose }) => {
    const { markAsRead, deleteNotification } = useNotifications();

    const handleClick = () => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
        if (notification.data?.task_id) {
            onClose?.();
            // Navigate to task details (handled by parent)
            window.location.href = `/tasks/${notification.data.task_id}`;
        }
    };

    const handleMarkRead = (e) => {
        e.stopPropagation();
        markAsRead(notification.id);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Delete this notification?')) {
            deleteNotification(notification.id);
        }
    };

    const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });

    return (
        <div
            className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notification.is_read ? 'bg-blue-50' : ''
            }`}
            onClick={handleClick}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                        {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                        {notification.message}
                    </p>
                    <span className="text-xs text-gray-400">{timeAgo}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    {!notification.is_read && (
                        <button
                            onClick={handleMarkRead}
                            className="text-xs text-blue-600 hover:text-blue-800"
                            title="Mark as read"
                        >
                            ✓
                        </button>
                    )}
                    <button
                        onClick={handleDelete}
                        className="text-xs text-gray-400 hover:text-red-600"
                        title="Delete"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationItem;