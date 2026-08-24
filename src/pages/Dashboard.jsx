import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import {
  ClipboardList,
  CircleCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Users,
  FolderKanban
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const isAdmin = user?.role?.slug === 'admin';
    const isPM = user?.role?.slug === 'project-manager';
    const isTeamLeader = user?.role?.slug === 'team-leader';
    const isMember = user?.role?.slug === 'team-member';

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await api.get('/dashboard');
            setStats(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load dashboard');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-2xl text-gray-600">Loading dashboard...</div>
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

    const statCards = [
        {
            title: 'Total Tasks',
            value: stats?.stats?.total_tasks || 0,
            icon: ClipboardList,
            color: 'text-[#1E3A5F]',
            bg: 'bg-[#1E3A5F]/10',
            border: 'border-[#1E3A5F]'
        },
        {
            title: 'To Do',
            value: stats?.stats?.to_do || 0,
            icon: Clock,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
            border: 'border-yellow-500'
        },
        {
            title: 'In Progress',
            value: stats?.stats?.in_progress || 0,
            icon: TrendingUp,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-500'
        },
        {
            title: 'Completed',
            value: stats?.stats?.completed || 0,
            icon: CheckCircle2,
            color: 'text-green-600',
            bg: 'bg-green-50',
            border: 'border-green-500'
        },
        {
            title: 'Overdue',
            value: stats?.stats?.overdue || 0,
            icon: AlertCircle,
            color: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-500'
        }
    ];

    return (
        <div>
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1E3A5F]">
                    Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600 mt-1">
                    {isAdmin && 'You have full access to the system.'}
                    {isPM && 'Manage your projects and team.'}
                    {isTeamLeader && 'Oversee your team tasks.'}
                    {isMember && 'Here are your assigned tasks.'}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${stat.border} hover:shadow-md transition-shadow duration-200`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{stat.title}</p>
                                    <p className={`text-3xl font-bold ${stat.color} mt-1`}>
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`${stat.bg} p-3 rounded-xl`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Project Progress - Takes 2/3 */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-[#1E3A5F]">
                            {isAdmin ? 'All Projects Progress' : 'My Projects Progress'}
                        </h2>
                        <span className="text-sm text-gray-500">
                            {stats?.project_progress?.length || 0} Projects
                        </span>
                    </div>
                    {stats?.project_progress?.length > 0 ? (
                        <div className="space-y-4">
                            {stats.project_progress.map((project) => (
                                <div key={project.id}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700 font-medium">{project.name}</span>
                                        <span className="font-medium text-[#1E3A5F]">{project.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-[#1E3A5F] h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No projects yet.</p>
                    )}
                </div>

                {/* Recent Activity / Team Stats - Takes 1/3 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-[#1E3A5F] mb-4">Quick Stats</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-[#1E3A5F]" />
                                <span className="text-gray-600">Team Members</span>
                            </div>
                            <span className="font-semibold">
                                {stats?.team_stats?.length || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FolderKanban className="w-5 h-5 text-[#1E3A5F]" />
                                <span className="text-gray-600">Active Projects</span>
                            </div>
                            <span className="font-semibold">
                                {stats?.project_progress?.filter(p => p.status === 'active').length || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span className="text-gray-600">Completed Tasks</span>
                            </div>
                            <span className="font-semibold text-green-600">
                                {stats?.stats?.completed || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Workload Table */}
            {(isAdmin || isPM || isTeamLeader) && stats?.team_stats?.length > 0 && (
                <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-[#1E3A5F] mb-4">Team Workload</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-gray-700 font-medium">Team Member</th>
                                    <th className="px-4 py-3 text-left text-gray-700 font-medium">Role</th>
                                    <th className="px-4 py-3 text-center text-gray-700 font-medium">Total</th>
                                    <th className="px-4 py-3 text-center text-gray-700 font-medium">Completed</th>
                                    <th className="px-4 py-3 text-center text-gray-700 font-medium">Overdue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.team_stats.map((member) => (
                                    <tr key={member.user_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-gray-800 font-medium">{member.name}</td>
                                        <td className="px-4 py-3 text-gray-600">{member.role}</td>
                                        <td className="px-4 py-3 text-center font-medium">{member.total_tasks}</td>
                                        <td className="px-4 py-3 text-center text-green-600">{member.completed_tasks}</td>
                                        <td className="px-4 py-3 text-center text-red-600">{member.overdue_tasks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;