import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/api';

const NotificationContext = createContext();

export const useNotifications = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch notifications and unread count
    const fetchNotifications = useCallback(async () => {
        try {
            // Check if user is logged in (has token)
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const [notifsRes, countRes] = await Promise.all([
                api.get('/notifications'),
                api.get('/notifications/unread-count'),
            ]);
            setNotifications(notifsRes.data || []);
            setUnreadCount(countRes.data?.unread_count || 0);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            setLoading(false);
        }
    }, []);

    // Mark a single notification as read
    const markAsRead = useCallback(async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n =>
                    n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback(async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev =>
                prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    }, []);

    // Delete a notification
    const deleteNotification = useCallback(async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
            // If it was unread, decrease count
            const deleted = notifications.find(n => n.id === id);
            if (deleted && !deleted.is_read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    }, [notifications]);

    // Refresh notifications
    const refresh = useCallback(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Fetch on mount and set up polling (only if authenticated)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchNotifications();
            
            // Refresh every 30 seconds
            const interval = setInterval(() => {
                // Only fetch if still authenticated
                if (localStorage.getItem('token')) {
                    fetchNotifications();
                }
            }, 30000);
            
            return () => clearInterval(interval);
        } else {
            setLoading(false);
        }
    }, [fetchNotifications]);

    const value = {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refresh,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};