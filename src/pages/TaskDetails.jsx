import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAdmin, isProjectManager, isTeamLeader } = useAuth();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [comment, setComment] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [statuses, setStatuses] = useState([]);
    const [showSubtaskInput, setShowSubtaskInput] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const [auditLogs, setAuditLogs] = useState([]);
    const [users, setUsers] = useState([]);
    
    // Subtask form fields
    const [subtaskTitle, setSubtaskTitle] = useState('');
    const [subtaskDescription, setSubtaskDescription] = useState('');
    const [subtaskAssignee, setSubtaskAssignee] = useState('');
    const [subtaskDueDate, setSubtaskDueDate] = useState('');
    
    // Edit Subtask
    const [editingSubtask, setEditingSubtask] = useState(null);
    const [editSubtaskTitle, setEditSubtaskTitle] = useState('');
    const [editSubtaskDescription, setEditSubtaskDescription] = useState('');
    const [editSubtaskAssignee, setEditSubtaskAssignee] = useState('');
    const [editSubtaskDueDate, setEditSubtaskDueDate] = useState('');

    const canManageTask = isAdmin() || isProjectManager() || isTeamLeader();

    useEffect(() => {
        fetchTaskDetails();
        fetchStatuses();
        fetchAuditLogs();
        fetchUsers();
    }, [id]);

    const fetchTaskDetails = async () => {
        try {
            const response = await api.get(`/tasks/${id}`);
            setTask(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load task details');
            setLoading(false);
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await api.get('/admin/statuses');
            setStatuses(response.data);
        } catch (err) {
            console.error('Failed to load statuses');
        }
    };

    const fetchAuditLogs = async () => {
        try {
            const response = await api.get(`/audit-logs/task/${id}`);
            setAuditLogs(response.data);
        } catch (err) {
            console.error('Failed to load audit logs');
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data.filter(u => u.is_active));
        } catch (err) {
            console.error('Failed to load users');
        }
    };

    // Helper function to get user name by ID
    const getUserName = (userId) => {
        if (!userId) return 'Unassigned';
        const foundUser = users.find(u => u.id === userId);
        return foundUser ? foundUser.name : 'Unassigned';
    };

    const handleStatusChange = async (e) => {
        const statusId = e.target.value;
        if (!statusId) return;

        try {
            await api.put(`/tasks/${id}/status`, { 
                status_id: statusId,
                blocked_reason: statusId === '3' ? 'Task is blocked' : null
            });
            fetchTaskDetails();
            fetchAuditLogs();
        } catch (err) {
            setError('Failed to update status');
        }
    };

    const handleReassign = async (newAssigneeId) => {
        if (!newAssigneeId) return;
        try {
            await api.put(`/tasks/${id}/assign`, { user_id: newAssigneeId });
            fetchTaskDetails();
            fetchAuditLogs();
        } catch (err) {
            setError('Failed to reassign task');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            await api.post(`/tasks/${id}/comments`, { content: comment });
            setComment('');
            fetchTaskDetails();
        } catch (err) {
            setError('Failed to add comment');
        }
    };

    const handleEditComment = async (commentId) => {
        try {
            await api.put(`/comments/${commentId}`, { content: editingCommentContent });
            setEditingCommentId(null);
            setEditingCommentContent('');
            fetchTaskDetails();
        } catch (err) {
            setError('Failed to edit comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await api.delete(`/comments/${commentId}`);
                fetchTaskDetails();
            } catch (err) {
                setError('Failed to delete comment');
            }
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post(`/tasks/${id}/attachments`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setFile(null);
            fetchTaskDetails();
        } catch (err) {
            setError('Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteAttachment = async (attachmentId) => {
        if (window.confirm('Are you sure you want to delete this attachment?')) {
            try {
                await api.delete(`/attachments/${attachmentId}`);
                fetchTaskDetails();
            } catch (err) {
                setError('Failed to delete attachment');
            }
        }
    };

    // Create Subtask
    const handleAddSubtask = async (e) => {
        e.preventDefault();
        
        if (!subtaskTitle.trim()) {
            setError('Please enter a subtask title');
            return;
        }
        if (!subtaskAssignee) {
            setError('Please select a user to assign this subtask');
            return;
        }

        const defaultStatus = statuses.find(s => s.is_default)?.id || 1;

        try {
            await api.post(`/tasks/${id}/subtasks`, {
                title: subtaskTitle,
                description: subtaskDescription || '',
                assigned_to: subtaskAssignee,
                status_id: defaultStatus,
                due_date: subtaskDueDate || null,
            });
            
            // Reset form
            setSubtaskTitle('');
            setSubtaskDescription('');
            setSubtaskAssignee('');
            setSubtaskDueDate('');
            setShowSubtaskInput(false);
            setError('');
            fetchTaskDetails();
        } catch (err) {
            console.error('Subtask error:', err);
            setError(err.response?.data?.message || 'Failed to add subtask');
        }
    };

    // Toggle Subtask Complete
    const handleSubtaskToggle = async (subtask) => {
        try {
            const newStatus = !subtask.is_completed ? 5 : 1;
            await api.put(`/subtasks/${subtask.id}`, {
                is_completed: !subtask.is_completed,
                status_id: newStatus,
            });
            fetchTaskDetails();
        } catch (err) {
            console.error('Subtask update error:', err);
            setError('Failed to update subtask');
        }
    };

    // Delete Subtask
    const handleDeleteSubtask = async (subtaskId) => {
        if (window.confirm('Are you sure you want to delete this subtask?')) {
            try {
                await api.delete(`/subtasks/${subtaskId}`);
                fetchTaskDetails();
            } catch (err) {
                setError('Failed to delete subtask');
            }
        }
    };

    // Open Edit Subtask Modal
    const openEditSubtask = (subtask) => {
        setEditingSubtask(subtask);
        setEditSubtaskTitle(subtask.title);
        setEditSubtaskDescription(subtask.description || '');
        setEditSubtaskAssignee(subtask.assigned_to || '');
        setEditSubtaskDueDate(subtask.due_date || '');
    };

    // Save Edited Subtask
    const handleEditSubtask = async (e) => {
        e.preventDefault();
        
        if (!editSubtaskTitle.trim()) {
            setError('Please enter a subtask title');
            return;
        }
        if (!editSubtaskAssignee) {
            setError('Please select a user to assign this subtask');
            return;
        }

        try {
            await api.put(`/subtasks/${editingSubtask.id}`, {
                title: editSubtaskTitle,
                description: editSubtaskDescription || '',
                assigned_to: editSubtaskAssignee,
                due_date: editSubtaskDueDate || null,
            });
            
            setEditingSubtask(null);
            setEditSubtaskTitle('');
            setEditSubtaskDescription('');
            setEditSubtaskAssignee('');
            setEditSubtaskDueDate('');
            setError('');
            fetchTaskDetails();
        } catch (err) {
            console.error('Subtask edit error:', err);
            setError(err.response?.data?.message || 'Failed to update subtask');
        }
    };

    const getStatusColor = (status) => {
        return status?.color || '#6B7280';
    };

    const getPriorityColor = (priority) => {
        return priority?.color || '#6B7280';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-2xl">Loading...</div>
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="bg-red-50 text-red-700 p-4 rounded-md">
                    {error || 'Task not found'}
                </div>
                <Link to="/tasks" className="mt-4 inline-block text-[#1E3A5F] hover:underline">
                    ← Back to Tasks
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Back Button */}
            <Link to="/tasks" className="text-[#1E3A5F] hover:underline mb-4 inline-block">
                ← Back to Tasks
            </Link>

            {/* Task Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1E3A5F]">{task.title}</h1>
                        <p className="text-gray-600 mt-2">{task.description || 'No description'}</p>
                    </div>
                    {canManageTask && (
                        <Link
                            to={`/tasks/${id}/edit`}
                            className="bg-[#1E3A5F] text-white px-4 py-2 rounded-md hover:bg-[#2E5A88] transition-colors"
                        >
                            Edit Task
                        </Link>
                    )}
                </div>

                {/* Task Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <div>
                        <div className="text-sm text-gray-500">Project</div>
                        <div className="font-medium">{task.project?.name}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Assignee</div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="font-medium">{task.assignee?.name}</span>
                            {canManageTask && (
                                <select
                                    onChange={(e) => handleReassign(e.target.value)}
                                    className="text-xs px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    defaultValue=""
                                >
                                    <option value="">Reassign</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Priority</div>
                        <span 
                            className="px-2 py-1 rounded-full text-xs text-white inline-block"
                            style={{ backgroundColor: getPriorityColor(task.priority) }}
                        >
                            {task.priority?.name}
                        </span>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Due Date</div>
                        <div className="font-medium">{task.due_date}</div>
                    </div>
                </div>

                {/* Status & Progress */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="flex items-center gap-3 mt-1">
                            <span 
                                className="px-3 py-1 rounded-full text-sm text-white"
                                style={{ backgroundColor: getStatusColor(task.status) }}
                            >
                                {task.status?.name}
                            </span>
                            {canManageTask && (
                                <select
                                    value=""
                                    onChange={handleStatusChange}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                >
                                    <option value="">Change Status</option>
                                    {statuses.map((status) => (
                                        <option key={status.id} value={status.id}>
                                            {status.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Progress</div>
                        <div className="flex items-center gap-3 mt-1">
                            <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-[#1E3A5F] h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${task.progress || 0}%` }}
                                ></div>
                            </div>
                            <span className="text-sm font-medium">{task.progress || 0}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtasks - Fixed Assignee Display */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-[#1E3A5F]">Subtasks</h2>
                    <button
                        onClick={() => {
                            setShowSubtaskInput(!showSubtaskInput);
                            setError('');
                        }}
                        className="text-[#1E3A5F] hover:underline text-sm"
                    >
                        + Add Subtask
                    </button>
                </div>

                {showSubtaskInput && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="font-medium mb-3 text-[#1E3A5F]">Create Subtask</h3>
                        <form onSubmit={handleAddSubtask} className="space-y-3">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Subtask Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={subtaskTitle}
                                    onChange={(e) => setSubtaskTitle(e.target.value)}
                                    placeholder="Enter subtask title..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={subtaskDescription}
                                    onChange={(e) => setSubtaskDescription(e.target.value)}
                                    placeholder="Enter subtask description..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    rows="2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Assign To <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={subtaskAssignee}
                                    onChange={(e) => setSubtaskAssignee(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    required
                                >
                                    <option value="">Select a user</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.role?.name})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={subtaskDueDate}
                                    onChange={(e) => setSubtaskDueDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-[#1E3A5F] text-white px-4 py-2 rounded-md hover:bg-[#2E5A88] transition-colors"
                                >
                                    Create Subtask
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowSubtaskInput(false);
                                        setSubtaskTitle('');
                                        setSubtaskDescription('');
                                        setSubtaskAssignee('');
                                        setSubtaskDueDate('');
                                        setError('');
                                    }}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {task.subtasks?.length > 0 ? (
                    <ul className="space-y-2">
                        {task.subtasks.map((subtask) => (
                            <li key={subtask.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded border border-gray-100">
                                <input
                                    type="checkbox"
                                    checked={subtask.is_completed}
                                    onChange={() => handleSubtaskToggle(subtask)}
                                    className="w-4 h-4 cursor-pointer"
                                />
                                <div className="flex-1">
                                    <span className={subtask.is_completed ? 'line-through text-gray-400' : 'font-medium'}>
                                        {subtask.title}
                                    </span>
                                    {subtask.description && (
                                        <p className="text-sm text-gray-500">{subtask.description}</p>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Assigned to: {getUserName(subtask.assigned_to)}
                                </div>
                                {subtask.due_date && (
                                    <div className="text-sm text-gray-500">
                                        Due: {subtask.due_date}
                                    </div>
                                )}
                                {canManageTask && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditSubtask(subtask)}
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSubtask(subtask.id)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No subtasks yet.</p>
                )}
            </div>

            {/* Edit Subtask Modal */}
            {editingSubtask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold mb-4 text-[#1E3A5F]">Edit Subtask</h2>
                        <form onSubmit={handleEditSubtask} className="space-y-3">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Subtask Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editSubtaskTitle}
                                    onChange={(e) => setEditSubtaskTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={editSubtaskDescription}
                                    onChange={(e) => setEditSubtaskDescription(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    rows="2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Assign To <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={editSubtaskAssignee}
                                    onChange={(e) => setEditSubtaskAssignee(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    required
                                >
                                    <option value="">Select a user</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.role?.name})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={editSubtaskDueDate}
                                    onChange={(e) => setEditSubtaskDueDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                />
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#1E3A5F] text-white py-2 px-4 rounded-md hover:bg-[#2E5A88] transition-colors"
                                >
                                    Update Subtask
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingSubtask(null);
                                        setError('');
                                    }}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                            {error && (
                                <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md text-sm">
                                    {error}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}

            {/* Comments */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-[#1E3A5F] mb-4">Comments</h2>

                <form onSubmit={handleAddComment} className="mb-4">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment... (use @username to mention someone)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                        rows="3"
                    />
                    <button
                        type="submit"
                        className="mt-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-md hover:bg-[#2E5A88] transition-colors"
                    >
                        Add Comment
                    </button>
                </form>

                {task.comments?.length > 0 ? (
                    <div className="space-y-4">
                        {task.comments.map((comment) => (
                            <div key={comment.id} className="border-b border-gray-100 pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="font-medium">{comment.user?.name}</span>
                                        <span className="text-sm text-gray-500 ml-2">
                                            {new Date(comment.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    {comment.user_id === user.id && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingCommentId(comment.id);
                                                    setEditingCommentContent(comment.content);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {editingCommentId === comment.id ? (
                                    <div className="mt-2">
                                        <textarea
                                            value={editingCommentContent}
                                            onChange={(e) => setEditingCommentContent(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                            rows="2"
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleEditComment(comment.id)}
                                                className="bg-[#1E3A5F] text-white px-3 py-1 rounded-md text-sm hover:bg-[#2E5A88] transition-colors"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingCommentId(null)}
                                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-700 mt-1">{comment.content}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No comments yet.</p>
                )}
            </div>

            {/* Attachments */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-[#1E3A5F] mb-4">Attachments</h2>

                <form onSubmit={handleFileUpload} className="mb-4 flex gap-2">
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                    />
                    <button
                        type="submit"
                        disabled={!file || uploading}
                        className="bg-[#1E3A5F] text-white px-4 py-2 rounded-md hover:bg-[#2E5A88] transition-colors disabled:opacity-50"
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>

                {task.attachments?.length > 0 ? (
                    <ul className="space-y-2">
                        {task.attachments.map((attachment) => (
                            <li key={attachment.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                <div>
                                    <span className="font-medium">{attachment.original_filename}</span>
                                    <span className="text-sm text-gray-500 ml-2">
                                        ({Math.round(attachment.file_size / 1024)} KB)
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2">
                                        Uploaded by {attachment.uploader?.name} on {new Date(attachment.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={`http://localhost:8000/api/attachments/${attachment.id}`}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            fetch(`http://localhost:8000/api/attachments/${attachment.id}`, {
                                                headers: {
                                                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                                },
                                            })
                                            .then(response => response.blob())
                                            .then(blob => {
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = attachment.original_filename;
                                                document.body.appendChild(a);
                                                a.click();
                                                a.remove();
                                                window.URL.revokeObjectURL(url);
                                            })
                                            .catch(err => {
                                                console.error('Download error:', err);
                                                setError('Failed to download file');
                                            });
                                        }}
                                    >
                                        Download
                                    </a>
                                    {attachment.uploaded_by === user.id && (
                                        <button
                                            onClick={() => handleDeleteAttachment(attachment.id)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No attachments yet.</p>
                )}
            </div>

            {/* History - Improved Audit Logs */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-[#1E3A5F] mb-4">Activity History</h2>
                {auditLogs.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {auditLogs.map((log) => (
                            <div key={log.id} className="flex items-start gap-3 text-sm border-b border-gray-100 pb-2">
                                <div className="w-2 h-2 rounded-full bg-[#1E3A5F] mt-2 flex-shrink-0"></div>
                                <div>
                                    <span className="font-medium">{log.user?.name || 'System'}</span>
                                    <span className="mx-2 text-gray-400">•</span>
                                    <span className="text-gray-600">{log.action}</span>
                                    <span className="mx-2 text-gray-400">•</span>
                                    <span className="text-gray-400 text-xs">
                                        {new Date(log.created_at).toLocaleString()}
                                    </span>
                                    {log.old_values && log.new_values && Object.keys(log.old_values).length > 0 && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            <span className="text-red-500">Changed: {Object.keys(log.old_values).join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No activity recorded yet.</p>
                )}
            </div>
        </div>
    );
};

// Helper function for priority color
const getPriorityColor = (priority) => {
    return priority?.color || '#6B7280';
};

export default TaskDetails;