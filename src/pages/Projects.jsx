import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Projects = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
    });

    const isManager = user?.role?.slug === 'admin' || user?.role?.slug === 'project-manager';

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load projects');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProject) {
                await api.put(`/projects/${editingProject.id}`, formData);
            } else {
                await api.post('/projects', formData);
            }
            setShowModal(false);
            setEditingProject(null);
            setFormData({ name: '', description: '', start_date: '', end_date: '' });
            fetchProjects();
        } catch (err) {
            setError('Failed to save project');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await api.delete(`/projects/${id}`);
                fetchProjects();
            } catch (err) {
                setError('Failed to delete project');
            }
        }
    };

    const handleArchive = async (id) => {
        try {
            await api.put(`/projects/${id}/archive`);
            fetchProjects();
        } catch (err) {
            setError('Failed to archive project');
        }
    };

    const openCreateModal = () => {
        setEditingProject(null);
        setFormData({ name: '', description: '', start_date: '', end_date: '' });
        setShowModal(true);
    };

    const openEditModal = (project) => {
        setEditingProject(project);
        setFormData({
            name: project.name,
            description: project.description || '',
            start_date: project.start_date,
            end_date: project.end_date,
        });
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-2xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#1E3A5F]">Projects</h1>
                    <p className="text-gray-600">Manage your projects</p>
                </div>
                {isManager && (
                    <button
                        onClick={openCreateModal}
                        className="bg-[#1E3A5F] text-white px-4 py-2 rounded-md hover:bg-[#2E5A88] transition-colors"
                    >
                        + New Project
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-semibold text-[#1E3A5F]">{project.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                project.status === 'active' ? 'bg-green-100 text-green-700' :
                                project.status === 'archived' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                                {project.status}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{project.description || 'No description'}</p>
                        <div className="text-sm text-gray-500 mb-4">
                            <div>Start: {project.start_date}</div>
                            <div>End: {project.end_date}</div>
                            <div>Manager: {project.manager?.name || 'N/A'}</div>
                            <div>Members: {project.members?.length || 0}</div>
                        </div>
                        {isManager && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(project)}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Edit
                                </button>
                                {project.status === 'active' && (
                                    <button
                                        onClick={() => handleArchive(project.id)}
                                        className="text-yellow-600 hover:text-yellow-800 text-sm"
                                    >
                                        Archive
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No projects yet.</p>
                    {isManager && (
                        <button
                            onClick={openCreateModal}
                            className="mt-4 text-[#1E3A5F] hover:underline"
                        >
                            Create your first project
                        </button>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingProject ? 'Edit Project' : 'New Project'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Project Name *
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
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    rows="3"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Start Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    End Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#1E3A5F] text-white py-2 px-4 rounded-md hover:bg-[#2E5A88] transition-colors"
                                >
                                    {editingProject ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingProject(null);
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

export default Projects;