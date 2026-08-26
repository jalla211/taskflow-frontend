import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Users,
  BarChart3,
  PieChart
} from 'lucide-react';

const Reports = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [error, setError] = useState('');
    const [dateRange, setDateRange] = useState('this-month');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
        { id: 'projects', label: 'Projects', icon: TrendingUp },
        { id: 'team', label: 'Team Workload', icon: Users },
    ];

    useEffect(() => {
        fetchReports();
    }, [dateRange]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await api.get('/reports', {
                params: { range: dateRange }
            });
            setReports(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load reports');
            setLoading(false);
        }
    };

    const exportReport = async (format) => {
        try {
            const response = await api.get('/reports/export', {
                params: { format, range: dateRange },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(response.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = `report.${format === 'pdf' ? 'pdf' : 'csv'}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            setError('Failed to export report');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-2xl text-gray-600">Loading reports...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#1E3A5F]">Reports & Analytics</h1>
                    <p className="text-gray-600 mt-1">Track performance and project progress</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] text-sm"
                    >
                        <option value="today">Today</option>
                        <option value="this-week">This Week</option>
                        <option value="this-month">This Month</option>
                        <option value="last-month">Last Month</option>
                        <option value="this-quarter">This Quarter</option>
                    </select>
                    <button
                        onClick={() => exportReport('pdf')}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2E5A88] transition-colors text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export PDF
                    </button>
                    <button
                        onClick={() => exportReport('csv')}
                        className="flex items-center gap-2 px-4 py-2 border border-[#1E3A5F] text-[#1E3A5F] rounded-lg hover:bg-[#1E3A5F]/10 transition-colors text-sm"
                    >
                        <FileText className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Tasks Completed</p>
                            <p className="text-2xl font-bold text-green-600">
                                {reports?.stats?.completed || 0}
                            </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-xl">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Overdue Tasks</p>
                            <p className="text-2xl font-bold text-red-600">
                                {reports?.stats?.overdue || 0}
                            </p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-xl">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active Projects</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {reports?.stats?.active_projects || 0}
                            </p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Team Members</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {reports?.stats?.team_members || 0}
                            </p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-xl">
                            <Users className="w-6 h-6 text-purple-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-gray-200 mb-6">
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

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                {activeTab === 'overview' && (
                    <div>
                        <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">Overview</h3>
                        <p className="text-gray-600">Overall system performance summary.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-500">Completion Rate</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {reports?.stats?.completion_rate || 0}%
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-500">Average Time</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {reports?.stats?.avg_completion_time || 'N/A'}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-500">On Time Rate</p>
                                <p className="text-2xl font-bold text-emerald-600">
                                    {reports?.stats?.on_time_rate || 0}%
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div>
                        <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">Task Reports</h3>
                        <p className="text-gray-600">Task completion and overdue analysis.</p>
                        <div className="overflow-x-auto mt-4">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-gray-700">Task</th>
                                        <th className="px-4 py-3 text-left text-gray-700">Project</th>
                                        <th className="px-4 py-3 text-center text-gray-700">Status</th>
                                        <th className="px-4 py-3 text-center text-gray-700">Priority</th>
                                        <th className="px-4 py-3 text-center text-gray-700">Due Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {reports?.tasks?.map((task) => (
                                        <tr key={task.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">{task.title}</td>
                                            <td className="px-4 py-3 text-gray-600">{task.project?.name}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: task.status?.color + '20', color: task.status?.color }}>
                                                    {task.status?.name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">{task.priority?.name}</td>
                                            <td className="px-4 py-3 text-center text-gray-600">{task.due_date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'projects' && (
                    <div>
                        <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">Project Progress Reports</h3>
                        <p className="text-gray-600">Progress of all projects.</p>
                        <div className="space-y-4 mt-4">
                            {reports?.projects?.map((project) => (
                                <div key={project.id}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700">{project.name}</span>
                                        <span className="font-medium text-[#1E3A5F]">{project.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-[#1E3A5F] h-2.5 rounded-full transition-all duration-500"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>{project.completed_tasks || 0} completed</span>
                                        <span>{project.total_tasks || 0} total tasks</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'team' && (
                    <div>
                        <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">Team Workload Report</h3>
                        <p className="text-gray-600">Workload distribution across team members.</p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-gray-700">Team Member</th>
                                        <th className="px-4 py-3 text-center text-gray-700">Role</th>
                                        <th className="px-4 py-3 text-center text-gray-700">Total Tasks</th>
                                        <th className="px-4 py-3 text-center text-gray-700">Completed</th>
                                        <th className="px-4 py-3 text-center text-gray-700">In Progress</th>
                                        <th className="px-4 py-3 text-center text-gray-700">Overdue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {reports?.team_stats?.map((member) => (
                                        <tr key={member.user_id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium">{member.name}</td>
                                            <td className="px-4 py-3 text-center text-gray-600">{member.role}</td>
                                            <td className="px-4 py-3 text-center font-medium">{member.total_tasks}</td>
                                            <td className="px-4 py-3 text-center text-green-600">{member.completed_tasks}</td>
                                            <td className="px-4 py-3 text-center text-blue-600">{member.in_progress_tasks || 0}</td>
                                            <td className="px-4 py-3 text-center text-red-600">{member.overdue_tasks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Coming Soon Section */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                    <PieChart className="w-4 h-4" />
                    More Reports Coming Soon
                </h3>
                <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                    <li>Task Completion Trend (Charts)</li>
                    <li>Priority Distribution Analysis</li>
                    <li>Project Health Dashboard</li>
                    <li>Employee Performance Metrics</li>
                </ul>
            </div>
        </div>
    );
};

export default Reports;