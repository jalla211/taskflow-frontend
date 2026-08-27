import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Tasks = () => {
    const { user, isAdmin, isProjectManager, isTeamLeader } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        project_id: '',
        assigned_to: '',
        priority_id: '',
        status_id: '',
        due_date: '',
        start_date: '',
    });

    const canManageTasks = isAdmin() || isProjectManager() || isTeamLeader();

    const [searchParams, setSearchParams] = useSearchParams();
    const filterParam = searchParams.get('filter');
    const autoOpenHandled = useRef(false);

    useEffect(() => {
        fetchAllData();
    }, []);

    // Deep link from the dashboard's "Create Task" button (?new=1).
    useEffect(() => {
        if (!loading && !autoOpenHandled.current && searchParams.get('new') === '1' && canManageTasks) {
            autoOpenHandled.current = true;
            openCreateModal();
            const next = new URLSearchParams(searchParams);
            next.delete('new');
            setSearchParams(next, { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    const visibleTasks = useMemo(() => {
        if (!filterParam) return tasks;
        if (filterParam === 'overdue') {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            return tasks.filter((t) => {
                if (!t.due_date) return false;
                const statusName = t.status?.name?.toLowerCase() || '';
                if (statusName.includes('complet') || statusName.includes('cancel')) return false;
                return new Date(t.due_date) < now;
            });
        }
        return tasks.filter((t) => t.status?.name?.toLowerCase() === filterParam.toLowerCase());
    }, [tasks, filterParam]);

    const clearFilter = () => {
        const next = new URLSearchParams(searchParams);
        next.delete('filter');
        setSearchParams(next);
    };

    const filterLabel = filterParam === 'overdue' ? 'Overdue' : filterParam
        ? filterParam.replace(/\b\w/g, (c) => c.toUpperCase())
        : '';

    const fetchAllData = async () => {
        setLoading(true);
        await Promise.all([
            fetchTasks(),
            fetchProjects(),
            fetchUsers(),
            fetchStatuses(),
            fetchPriorities(),
        ]);
        setLoading(false);
    };

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            // Ensure tasks is always an array
            setTasks(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Failed to load tasks:', err);
            setError('Failed to load tasks');
            setTasks([]); // Set to empty array on error
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Failed to load projects:', err);
            setProjects([]);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            const usersData = Array.isArray(response.data) ? response.data : [];
            setUsers(usersData.filter(u => u.is_active !== false));
        } catch (err) {
            console.error('Failed to load users:', err);
            setUsers([]);
        }
    };

  const fetchStatuses = async () => {
    try {
        const response = await api.get('/task-statuses');   // changed from /admin/statuses
        setStatuses(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
        console.error('Failed to load statuses:', err);
        setStatuses([]);
    }
};

  const fetchPriorities = async () => {
    try {
        const response = await api.get('/task-priorities'); // changed from /admin/priorities
        setPriorities(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
        console.error('Failed to load priorities:', err);
        setPriorities([]);
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (editingTask) {
                await api.put(`/tasks/${editingTask.id}`, formData);
            } else {
                await api.post('/tasks', formData);
            }
            setShowModal(false);
            setEditingTask(null);
            setFormData({
                title: '',
                description: '',
                project_id: '',
                assigned_to: '',
                priority_id: '',
                status_id: '',
                due_date: '',
                start_date: '',
            });
            fetchTasks();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save task');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${id}`);
                fetchTasks();
            } catch (err) {
                setError('Failed to delete task');
            }
        }
    };

    const openCreateModal = () => {
        setEditingTask(null);
        const defaultStatus = statuses.find(s => s.is_default);
        setFormData({
            title: '',
            description: '',
            project_id: '',
            assigned_to: '',
            priority_id: '',
            status_id: defaultStatus?.id || '',
            due_date: '',
            start_date: '',
        });
        setShowModal(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setFormData({
            title: task.title || '',
            description: task.description || '',
            project_id: task.project_id || '',
            assigned_to: task.assigned_to || '',
            priority_id: task.priority_id || '',
            status_id: task.status_id || '',
            due_date: task.due_date || '',
            start_date: task.start_date || '',
        });
        setShowModal(true);
    };

    const getStatusColor = (status) => {
        return status?.color || '#6B7280';
    };

    const getPriorityColor = (priority) => {
        return priority?.color || '#6B7280';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-2xl text-gray-600">Loading tasks...</div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#1E3A5F]">Tasks</h1>
                    <p className="text-gray-600">Manage your tasks</p>
                </div>
                {canManageTasks && (
                    <button
                        onClick={openCreateModal}
                        className="bg-[#1E3A5F] text-white px-4 py-2 rounded-md hover:bg-[#2E5A88] transition-colors"
                    >
                        + New Task
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}

            {filterParam && (
                <div className="mb-4 flex items-center gap-2 text-sm">
                    <span className="px-3 py-1 bg-[#1E3A5F]/10 text-[#1E3A5F] rounded-full font-medium">
                        Filtered: {filterLabel}
                    </span>
                    <button onClick={clearFilter} className="text-gray-500 hover:text-gray-700 hover:underline">
                        Clear filter
                    </button>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {tasks.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No tasks yet.</p>
                        {canManageTasks && (
                            <button
                                onClick={openCreateModal}
                                className="mt-4 text-[#1E3A5F] hover:underline"
                            >
                                Create your first task
                            </button>
                        )}
                    </div>
                ) : visibleTasks.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No tasks match this filter.</p>
                        <button onClick={clearFilter} className="mt-4 text-[#1E3A5F] hover:underline">
                            Clear filter
                        </button>
                    </div>
                ) : (
                      <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Project</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Assignee</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {visibleTasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-800">
                                        <Link 
                                            to={`/tasks/${task.id}`} 
                                            className="hover:text-[#1E3A5F] hover:underline"
                                        >
                                            {task.title}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{task.project?.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{task.assignee?.name}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <span 
                                            className="px-2 py-1 rounded-full text-xs text-white"
                                            style={{ backgroundColor: getStatusColor(task.status) }}
                                        >
                                            {task.status?.name}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span 
                                            className="px-2 py-1 rounded-full text-xs text-white"
                                            style={{ backgroundColor: getPriorityColor(task.priority) }}
                                        >
                                            {task.priority?.name}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{task.due_date}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex gap-2">
                                            {canManageTasks && (
                                                <>
                                                    <button
                                                        onClick={() => openEditModal(task)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(task.id)}
                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                )}
            </div>

            {/* Modal - Create/Edit Task */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4 text-[#1E3A5F]">
                            {editingTask ? 'Edit Task' : 'Create New Task'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Task Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    placeholder="Enter task title"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    rows="3"
                                    placeholder="Describe the task details"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Project <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.project_id}
                                    onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    required
                                >
                                    <option value="">Select a project</option>
                                    {Array.isArray(projects) && projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Assign To <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.assigned_to}
                                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    required
                                >
                                    <option value="">Select a user</option>
                                    {Array.isArray(users) && users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.role?.name})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Priority <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.priority_id}
                                    onChange={(e) => setFormData({ ...formData, priority_id: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    required
                                >
                                    <option value="">Select priority</option>
                                    {Array.isArray(priorities) && priorities.map((priority) => (
                                        <option key={priority.id} value={priority.id}>
                                            {priority.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Status
                                </label>
                                <select
                                    value={formData.status_id}
                                    onChange={(e) => setFormData({ ...formData, status_id: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                >
                                    {Array.isArray(statuses) && statuses.map((status) => (
                                        <option key={status.id} value={status.id}>
                                            {status.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Due Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#1E3A5F] text-white py-2 px-4 rounded-md hover:bg-[#2E5A88] transition-colors"
                                >
                                    {editingTask ? 'Update Task' : 'Create Task'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingTask(null);
                                        setError('');
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

export default Tasks;