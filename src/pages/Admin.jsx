import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import {
  Settings,
  Tag,
  AlertCircle,
  Bell,
  FileText,
  Plus,
  Trash2,
  Edit2,
  Save,
  X
} from 'lucide-react';

const Admin = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('statuses');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Data states
    const [statuses, setStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [tags, setTags] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);

    // Form states for adding new items
    const [newStatus, setNewStatus] = useState({ name: '', color: '#6B7280' });
    const [newPriority, setNewPriority] = useState({ name: '', color: '#6B7280', level: 1 });
    const [newTag, setNewTag] = useState({ name: '', color: '#6B7280' });

    // Edit states
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', color: '', level: 1 });

    const tabs = [
        { id: 'statuses', label: 'Task Statuses', icon: AlertCircle },
        { id: 'priorities', label: 'Priorities', icon: Settings },
        { id: 'tags', label: 'Tags', icon: Tag },
        { id: 'audit', label: 'Audit Logs', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Bell },
    ];

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            
            if (activeTab === 'statuses') {
                const res = await api.get('/admin/statuses');
                setStatuses(res.data);
            } else if (activeTab === 'priorities') {
                const res = await api.get('/admin/priorities');
                setPriorities(res.data);
            } else if (activeTab === 'tags') {
                const res = await api.get('/admin/tags');
                setTags(res.data);
            } else if (activeTab === 'audit') {
                const res = await api.get('/admin/audit-logs');
                setAuditLogs(res.data);
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to load data');
            setLoading(false);
        }
    };

    // ---------- STATUS HANDLERS ----------
    const handleAddStatus = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/statuses', newStatus);
            setSuccess('Status added successfully');
            setNewStatus({ name: '', color: '#6B7280' });
            fetchData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to add status');
        }
    };

    const handleDeleteStatus = async (id) => {
        if (window.confirm('Are you sure you want to delete this status?')) {
            try {
                await api.delete(`/admin/statuses/${id}`);
                setSuccess('Status deleted');
                fetchData();
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError('Failed to delete status');
            }
        }
    };

    // ---------- PRIORITY HANDLERS ----------
    const handleAddPriority = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/priorities', newPriority);
            setSuccess('Priority added successfully');
            setNewPriority({ name: '', color: '#6B7280', level: 1 });
            fetchData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to add priority');
        }
    };

    const handleDeletePriority = async (id) => {
        if (window.confirm('Are you sure you want to delete this priority?')) {
            try {
                await api.delete(`/admin/priorities/${id}`);
                setSuccess('Priority deleted');
                fetchData();
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError('Failed to delete priority');
            }
        }
    };

    // ---------- TAG HANDLERS ----------
    const handleAddTag = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/tags', newTag);
            setSuccess('Tag added successfully');
            setNewTag({ name: '', color: '#6B7280' });
            fetchData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to add tag');
        }
    };

    const handleDeleteTag = async (id) => {
        if (window.confirm('Are you sure you want to delete this tag?')) {
            try {
                await api.delete(`/admin/tags/${id}`);
                setSuccess('Tag deleted');
                fetchData();
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError('Failed to delete tag');
            }
        }
    };

    // ---------- EDIT HANDLERS (Status, Priority, Tag) ----------
    const startEdit = (item, type) => {
        setEditingItem({ ...item, type });
        setEditForm({
            name: item.name,
            color: item.color,
            level: item.level || 1,
        });
    };

    const cancelEdit = () => {
        setEditingItem(null);
        setEditForm({ name: '', color: '', level: 1 });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingItem) return;
        
        try {
            const endpoint = `/admin/${editingItem.type}s/${editingItem.id}`;
            await api.put(endpoint, editForm);
            setSuccess(`${editingItem.type} updated successfully`);
            fetchData();
            cancelEdit();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to update');
        }
    };

    const colorOptions = [
        '#6B7280', '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
        '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1'
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-2xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1E3A5F]">Admin Settings</h1>
                <p className="text-gray-600 mt-1">Configure system settings and manage configurations</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">{success}</div>
            )}

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-6">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? 'border-[#1E3A5F] text-[#1E3A5F]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ============ STATUSES TAB ============ */}
            {activeTab === 'statuses' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">Task Statuses</h3>
                    <p className="text-gray-600 mb-4">Manage task statuses (To Do, In Progress, etc.)</p>

                    <form onSubmit={handleAddStatus} className="flex gap-3 mb-6">
                        <input
                            type="text"
                            value={newStatus.name}
                            onChange={(e) => setNewStatus({ ...newStatus, name: e.target.value })}
                            placeholder="Status name..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                            required
                        />
                        <select
                            value={newStatus.color}
                            onChange={(e) => setNewStatus({ ...newStatus, color: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                        >
                            {colorOptions.map(color => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2E5A88] transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </form>

                    <div className="space-y-2">
                        {statuses.map((status) => (
                            <div key={status.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                {editingItem?.id === status.id && editingItem?.type === 'status' ? (
                                    <form onSubmit={handleUpdate} className="flex-1 flex gap-3">
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                        />
                                        <select
                                            value={editForm.color}
                                            onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                                            className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                        >
                                            {colorOptions.map(color => (
                                                <option key={color} value={color}>{color}</option>
                                            ))}
                                        </select>
                                        <button type="submit" className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">Save</button>
                                        <button type="button" onClick={cancelEdit} className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm">Cancel</button>
                                    </form>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 flex-1">
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></span>
                                            <span>{status.name}</span>
                                            {status.is_default && (
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Default</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            {!status.is_default && (
                                                <>
                                                    <button
                                                        onClick={() => startEdit(status, 'status')}
                                                        className="text-blue-500 hover:text-blue-700 transition-colors text-sm flex items-center gap-1"
                                                    >
                                                        <Edit2 className="w-4 h-4" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteStatus(status.id)}
                                                        className="text-red-500 hover:text-red-700 transition-colors text-sm flex items-center gap-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ============ PRIORITIES TAB ============ */}
            {activeTab === 'priorities' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">Priorities</h3>
                    <p className="text-gray-600 mb-4">Manage task priorities (Low, Medium, High, Critical)</p>

                    <form onSubmit={handleAddPriority} className="flex gap-3 mb-6">
                        <input
                            type="text"
                            value={newPriority.name}
                            onChange={(e) => setNewPriority({ ...newPriority, name: e.target.value })}
                            placeholder="Priority name..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                            required
                        />
                        <select
                            value={newPriority.color}
                            onChange={(e) => setNewPriority({ ...newPriority, color: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                        >
                            {colorOptions.map(color => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={newPriority.level}
                            onChange={(e) => setNewPriority({ ...newPriority, level: parseInt(e.target.value) })}
                            placeholder="Level"
                            className="w-20 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                            min="1"
                            max="5"
                        />
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2E5A88] transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </form>

                    <div className="space-y-2">
                        {priorities.map((priority) => (
                            <div key={priority.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                {editingItem?.id === priority.id && editingItem?.type === 'priority' ? (
                                    <form onSubmit={handleUpdate} className="flex-1 flex gap-3">
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                        />
                                        <select
                                            value={editForm.color}
                                            onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                                            className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                        >
                                            {colorOptions.map(color => (
                                                <option key={color} value={color}>{color}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            value={editForm.level}
                                            onChange={(e) => setEditForm({ ...editForm, level: parseInt(e.target.value) })}
                                            className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                            min="1"
                                            max="5"
                                        />
                                        <button type="submit" className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">Save</button>
                                        <button type="button" onClick={cancelEdit} className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm">Cancel</button>
                                    </form>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 flex-1">
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: priority.color }}></span>
                                            <span>{priority.name}</span>
                                            <span className="text-sm text-gray-500">Level: {priority.level}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEdit(priority, 'priority')}
                                                className="text-blue-500 hover:text-blue-700 transition-colors text-sm flex items-center gap-1"
                                            >
                                                <Edit2 className="w-4 h-4" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeletePriority(priority.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors text-sm flex items-center gap-1"
                                            >
                                                <Trash2 className="w-4 h-4" /> Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ============ TAGS TAB ============ */}
            {activeTab === 'tags' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">Tags</h3>
                    <p className="text-gray-600 mb-4">Manage task tags for better organization</p>

                    <form onSubmit={handleAddTag} className="flex gap-3 mb-6">
                        <input
                            type="text"
                            value={newTag.name}
                            onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                            placeholder="Tag name..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                            required
                        />
                        <select
                            value={newTag.color}
                            onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                        >
                            {colorOptions.map(color => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2E5A88] transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </form>

                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <div key={tag.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                {editingItem?.id === tag.id && editingItem?.type === 'tag' ? (
                                    <form onSubmit={handleUpdate} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] w-32"
                                        />
                                        <select
                                            value={editForm.color}
                                            onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                                            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                        >
                                            {colorOptions.map(color => (
                                                <option key={color} value={color}>{color}</option>
                                            ))}
                                        </select>
                                        <button type="submit" className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">Save</button>
                                        <button type="button" onClick={cancelEdit} className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs">Cancel</button>
                                    </form>
                                ) : (
                                    <>
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }}></span>
                                        <span>{tag.name}</span>
                                        <button
                                            onClick={() => startEdit(tag, 'tag')}
                                            className="text-blue-500 hover:text-blue-700 transition-colors ml-1 text-xs"
                                        >
                                            <Edit2 className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTag(tag.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors text-xs"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ============ AUDIT LOGS TAB ============ */}
            {activeTab === 'audit' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">Audit Logs</h3>
                    <p className="text-gray-600 mb-4">System activity history and changes</p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-gray-700">User</th>
                                    <th className="px-4 py-3 text-left text-gray-700">Action</th>
                                    <th className="px-4 py-3 text-left text-gray-700">Details</th>
                                    <th className="px-4 py-3 text-left text-gray-700">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {auditLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                            No audit logs yet. Actions will appear here.
                                        </td>
                                    </tr>
                                ) : (
                                    auditLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">{log.user?.name || 'System'}</td>
                                            <td className="px-4 py-3">{log.action}</td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {log.details || 'No details'}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 text-xs">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ============ SETTINGS TAB ============ */}
            {activeTab === 'settings' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">Notification Settings</h3>
                    <p className="text-gray-600 mb-4">System-wide notification configuration</p>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-700">Task Assignment Notifications</p>
                                <p className="text-sm text-gray-500">Notify users when tasks are assigned</p>
                            </div>
                            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-[#1E3A5F] rounded-full">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform translate-x-6"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-700">Status Change Notifications</p>
                                <p className="text-sm text-gray-500">Notify when task status changes</p>
                            </div>
                            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-[#1E3A5F] rounded-full">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform translate-x-6"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-700">Deadline Reminders</p>
                                <p className="text-sm text-gray-500">Send reminders 2 days before due date</p>
                            </div>
                            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-[#1E3A5F] rounded-full">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform translate-x-6"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-700">Mention Notifications</p>
                                <p className="text-sm text-gray-500">Notify when users are @mentioned</p>
                            </div>
                            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-[#1E3A5F] rounded-full">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform translate-x-6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;