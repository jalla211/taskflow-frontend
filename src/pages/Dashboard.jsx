import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, isToday, isTomorrow, format, parseISO, isValid } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import api from '../api/api';
import DashboardSection from '../components/dashboard/DashboardSection';
import { StatusBadge, PriorityBadge } from '../components/dashboard/Badges';
import {
    ClipboardList,
    Clock,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    Users,
    Plus,
    Settings,
    Bell,
} from 'lucide-react';

const isTerminalStatus = (status) => {
    const name = status?.name?.toLowerCase() || '';
    return name.includes('complet') || name.includes('cancel');
};

const isSameUser = (task, userId) =>
    String(task.assigned_to) === String(userId) || String(task.assignee?.id) === String(userId);

const dueDateLabel = (dateStr) => {
    const parsed = parseISO(dateStr);
    if (!isValid(parsed)) return dateStr;
    if (isToday(parsed)) return 'Today';
    if (isTomorrow(parsed)) return 'Tomorrow';
    return format(parsed, 'MMM d');
};

const Dashboard = () => {
    const { user, isAdmin, isProjectManager, isTeamLeader } = useAuth();
    const { notifications, unreadCount, loading: notificationsLoading } = useNotifications();

    const [summary, setSummary] = useState({ loading: true, error: '', data: null });
    const [tasksState, setTasksState] = useState({ loading: true, error: '', data: [] });
    const [activity, setActivity] = useState({ loading: true, error: '', data: [], source: 'tasks' });

    const canCreateTask = isAdmin() || isProjectManager() || isTeamLeader();
    const canSeeTeamData = isAdmin() || isProjectManager() || isTeamLeader();
    const canSeeOverdueProjectTasks = isAdmin() || isProjectManager();

    const fetchSummary = useCallback(async () => {
        setSummary((s) => ({ ...s, loading: true, error: '' }));
        try {
            const res = await api.get('/dashboard');
            setSummary({ loading: false, error: '', data: res.data });
        } catch {
            setSummary({ loading: false, error: 'Unable to load dashboard stats.', data: null });
        }
    }, []);

    const fetchTasks = useCallback(async () => {
        setTasksState((s) => ({ ...s, loading: true, error: '' }));
        try {
            const res = await api.get('/tasks');
            setTasksState({ loading: false, error: '', data: Array.isArray(res.data) ? res.data : [] });
        } catch {
            setTasksState({ loading: false, error: 'Unable to load tasks.', data: [] });
        }
    }, []);

    const fetchActivity = useCallback(async () => {
        setActivity((s) => ({ ...s, loading: true, error: '' }));
        if (isAdmin()) {
            try {
                const res = await api.get('/admin/audit-logs');
                setActivity({
                    loading: false,
                    error: '',
                    data: Array.isArray(res.data) ? res.data.slice(0, 6) : [],
                    source: 'audit',
                });
                return;
            } catch {
                // Fall back to task-derived activity below.
            }
        }
        setActivity({ loading: false, error: '', data: [], source: 'tasks' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchSummary();
        fetchTasks();
        fetchActivity();
    }, [fetchSummary, fetchTasks, fetchActivity]);

    const myTasks = useMemo(() => {
        return tasksState.data
            .filter((t) => isSameUser(t, user?.id))
            .sort((a, b) => new Date(a.due_date || '9999-12-31') - new Date(b.due_date || '9999-12-31'))
            .slice(0, 5);
    }, [tasksState.data, user]);

    const upcomingDeadlines = useMemo(() => {
        const scoped = canSeeTeamData ? tasksState.data : tasksState.data.filter((t) => isSameUser(t, user?.id));
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return scoped
            .filter((t) => t.due_date && !isTerminalStatus(t.status))
            .map((t) => ({ ...t, _due: parseISO(t.due_date) }))
            .filter((t) => isValid(t._due) && t._due >= now)
            .sort((a, b) => a._due - b._due)
            .slice(0, 5);
    }, [tasksState.data, user, canSeeTeamData]);

    const overdueProjectTasks = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return tasksState.data
            .filter((t) => t.due_date && !isTerminalStatus(t.status))
            .map((t) => ({ ...t, _due: parseISO(t.due_date) }))
            .filter((t) => isValid(t._due) && t._due < now)
            .sort((a, b) => a._due - b._due)
            .slice(0, 5);
    }, [tasksState.data]);

    const recentActivityItems = useMemo(() => {
        if (activity.source === 'audit') {
            return activity.data.map((log) => ({
                id: log.id,
                text: `${log.user?.name || 'System'} ${log.action}`,
                detail: log.details,
                time: log.created_at,
            }));
        }
        return [...tasksState.data]
            .filter((t) => t.updated_at || t.created_at)
            .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
            .slice(0, 5)
            .map((t) => ({
                id: t.id,
                text: `${t.assignee?.name || 'Someone'} updated "${t.title}"`,
                detail: t.status?.name,
                time: t.updated_at || t.created_at,
            }));
    }, [activity, tasksState.data]);

    const stats = summary.data?.stats;
    const statCards = [
        {
            key: 'total',
            title: 'Total Tasks',
            value: stats?.total_tasks ?? 0,
            icon: ClipboardList,
            color: 'text-[#1E3A5F]',
            bg: 'bg-[#1E3A5F]/10',
            border: 'border-[#1E3A5F]',
            href: '/tasks',
        },
        {
            key: 'todo',
            title: 'To Do',
            value: stats?.to_do ?? 0,
            icon: Clock,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
            border: 'border-yellow-500',
            href: '/tasks?filter=to+do',
        },
        {
            key: 'in_progress',
            title: 'In Progress',
            value: stats?.in_progress ?? 0,
            icon: TrendingUp,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-500',
            href: '/tasks?filter=in+progress',
        },
        {
            key: 'completed',
            title: 'Completed',
            value: stats?.completed ?? 0,
            icon: CheckCircle2,
            color: 'text-green-600',
            bg: 'bg-green-50',
            border: 'border-green-500',
            href: '/tasks?filter=completed',
        },
        {
            key: 'overdue',
            title: 'Overdue',
            value: stats?.overdue ?? 0,
            icon: AlertCircle,
            color: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-500',
            href: '/tasks?filter=overdue',
        },
    ];

    const roleMessage = isAdmin()
        ? 'You have full access to the system.'
        : isProjectManager()
        ? 'Manage your projects and team.'
        : isTeamLeader()
        ? 'Oversee your team tasks.'
        : "Here's an overview of your work.";

    return (
        <div>
            {/* Welcome Section */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-[#1E3A5F]">Welcome, {user?.name}!</h1>
                    <p className="text-gray-600 mt-1">{roleMessage}</p>
                </div>
                {canCreateTask && (
                    <Link
                        to="/tasks?new=1"
                        className="inline-flex items-center justify-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-md hover:bg-[#2E5A88] transition-colors self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" /> Create Task
                    </Link>
                )}
            </div>

            {/* Task Summary */}
            {summary.error ? (
                <div className="mb-8 bg-white rounded-xl shadow-sm p-6 text-center">
                    <p className="text-red-600 mb-2">{summary.error}</p>
                    <button onClick={fetchSummary} className="text-[#1E3A5F] font-medium hover:underline">
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    {summary.loading
                        ? Array.from({ length: 5 }).map((_, i) => (
                              <div key={i} className="bg-white rounded-xl shadow-sm p-6 h-[92px] animate-pulse" />
                          ))
                        : statCards.map((stat) => {
                              const Icon = stat.icon;
                              return (
                                  <Link
                                      key={stat.key}
                                      to={stat.href}
                                      className={`block bg-white rounded-xl shadow-sm p-6 border-l-4 ${stat.border} hover:shadow-md transition-shadow duration-200`}
                                  >
                                      <div className="flex items-center justify-between">
                                          <div>
                                              <p className="text-sm text-gray-500">{stat.title}</p>
                                              <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                                          </div>
                                          <div className={`${stat.bg} p-3 rounded-xl`}>
                                              <Icon className={`w-6 h-6 ${stat.color}`} />
                                          </div>
                                      </div>
                                  </Link>
                              );
                          })}
                </div>
            )}

            {/* My Tasks + Project Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <DashboardSection
                    title="My Tasks"
                    loading={tasksState.loading}
                    error={tasksState.error}
                    onRetry={fetchTasks}
                    empty={myTasks.length === 0}
                    emptyMessage="You currently have no assigned tasks."
                    action={
                        <Link to="/tasks" className="text-sm text-[#1E3A5F] font-medium hover:underline whitespace-nowrap">
                            View All Tasks
                        </Link>
                    }
                >
                    <div className="space-y-3">
                        {myTasks.map((task) => (
                            <Link
                                key={task.id}
                                to={`/tasks/${task.id}`}
                                className="block p-3 rounded-lg border border-gray-100 hover:border-[#1E3A5F]/30 hover:bg-gray-50 transition-colors"
                            >
                                <div className="font-medium text-gray-800 truncate mb-1">{task.title}</div>
                                <div className="text-xs text-gray-500 mb-2 truncate">{task.project?.name}</div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <PriorityBadge priority={task.priority} />
                                    <StatusBadge status={task.status} />
                                    {task.due_date && (
                                        <span className="text-xs text-gray-500 ml-auto">
                                            Due: {dueDateLabel(task.due_date)}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </DashboardSection>

                <DashboardSection
                    title="Project Progress"
                    loading={summary.loading}
                    error={summary.error}
                    onRetry={fetchSummary}
                    empty={!summary.data?.project_progress?.length}
                    emptyMessage="No projects yet."
                    action={
                        <Link to="/projects" className="text-sm text-[#1E3A5F] font-medium hover:underline whitespace-nowrap">
                            View All Projects
                        </Link>
                    }
                >
                    <div className="space-y-4">
                        {summary.data?.project_progress?.map((project) => (
                            <div key={project.id}>
                                <div className="flex justify-between text-sm mb-1 gap-2">
                                    <span className="text-gray-700 font-medium truncate">{project.name}</span>
                                    <span className="font-medium text-[#1E3A5F] whitespace-nowrap">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-[#1E3A5F] h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>
                                {project.end_date && (
                                    <div className="text-xs text-gray-400 mt-1">Due {project.end_date}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </DashboardSection>
            </div>

            {/* Upcoming Deadlines + Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <DashboardSection
                    title="Upcoming Deadlines"
                    loading={tasksState.loading}
                    error={tasksState.error}
                    onRetry={fetchTasks}
                    empty={upcomingDeadlines.length === 0}
                    emptyMessage="No upcoming deadlines."
                    action={
                        <Link to="/calendar" className="text-sm text-[#1E3A5F] font-medium hover:underline whitespace-nowrap">
                            View Calendar
                        </Link>
                    }
                >
                    <div className="space-y-1">
                        {upcomingDeadlines.map((task) => (
                            <Link
                                key={task.id}
                                to={`/tasks/${task.id}`}
                                className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="min-w-0">
                                    <div className="text-xs font-semibold text-[#1E3A5F]">{dueDateLabel(task.due_date)}</div>
                                    <div className="text-sm text-gray-700 truncate">{task.title}</div>
                                </div>
                                <PriorityBadge priority={task.priority} />
                            </Link>
                        ))}
                    </div>
                </DashboardSection>

                <DashboardSection
                    title="Notifications"
                    loading={notificationsLoading}
                    empty={(notifications || []).length === 0}
                    emptyMessage="You're all caught up."
                    action={
                        <Link
                            to="/notifications"
                            className="text-sm text-[#1E3A5F] font-medium hover:underline whitespace-nowrap"
                        >
                            View All{unreadCount > 0 ? ` (${unreadCount})` : ''}
                        </Link>
                    }
                >
                    <div className="space-y-1">
                        {(notifications || []).slice(0, 5).map((n) => (
                            <div
                                key={n.id}
                                className={`p-2 rounded-lg ${!n.is_read ? 'bg-blue-50' : 'hover:bg-gray-50'} transition-colors`}
                            >
                                <div className="flex items-start gap-2">
                                    <Bell className="w-4 h-4 text-[#1E3A5F] mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{n.title}</p>
                                        <p className="text-xs text-gray-400">
                                            {n.created_at
                                                ? formatDistanceToNow(new Date(n.created_at), { addSuffix: true })
                                                : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </DashboardSection>
            </div>

            {/* Team Workload (Team Leader / Project Manager / Admin) */}
            {canSeeTeamData && summary.data?.team_stats?.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
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
                                {summary.data.team_stats.map((member) => (
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

            {/* Overdue Project Tasks (Project Manager / Admin) */}
            {canSeeOverdueProjectTasks && (
                <DashboardSection
                    title="Overdue Project Tasks"
                    loading={tasksState.loading}
                    error={tasksState.error}
                    onRetry={fetchTasks}
                    empty={overdueProjectTasks.length === 0}
                    emptyMessage="Nothing overdue right now."
                    action={
                        <Link
                            to="/tasks?filter=overdue"
                            className="text-sm text-[#1E3A5F] font-medium hover:underline whitespace-nowrap"
                        >
                            View All
                        </Link>
                    }
                    className="mb-6"
                >
                    <div className="space-y-1">
                        {overdueProjectTasks.map((task) => (
                            <Link
                                key={task.id}
                                to={`/tasks/${task.id}`}
                                className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="min-w-0">
                                    <div className="text-sm text-gray-700 truncate">{task.title}</div>
                                    <div className="text-xs text-gray-500 truncate">{task.project?.name}</div>
                                </div>
                                <span className="text-xs text-red-600 font-medium whitespace-nowrap">
                                    Due {dueDateLabel(task.due_date)}
                                </span>
                            </Link>
                        ))}
                    </div>
                </DashboardSection>
            )}

            {/* Admin Shortcuts */}
            {isAdmin() && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-[#1E3A5F] mb-4">Admin Shortcuts</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link
                            to="/users"
                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                            <div className="bg-[#1E3A5F]/10 p-2 rounded-lg">
                                <Users className="w-5 h-5 text-[#1E3A5F]" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">User Management</span>
                        </Link>
                        <Link
                            to="/admin"
                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                            <div className="bg-[#1E3A5F]/10 p-2 rounded-lg">
                                <Settings className="w-5 h-5 text-[#1E3A5F]" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                System Configuration &amp; Audit Logs
                            </span>
                        </Link>
                    </div>
                </div>
            )}

            {/* Recent Activity */}
            <DashboardSection
                title="Recent Activity"
                loading={activity.loading}
                error={activity.error}
                onRetry={fetchActivity}
                empty={recentActivityItems.length === 0}
                emptyMessage="No recent activity yet."
            >
                <div className="divide-y divide-gray-100">
                    {recentActivityItems.map((item) => (
                        <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                            <span className="text-sm text-gray-700 truncate">
                                {item.text}
                                {item.detail ? ` — ${item.detail}` : ''}
                            </span>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                {item.time ? formatDistanceToNow(new Date(item.time), { addSuffix: true }) : ''}
                            </span>
                        </div>
                    ))}
                </div>
            </DashboardSection>
        </div>
    );
};

export default Dashboard;
