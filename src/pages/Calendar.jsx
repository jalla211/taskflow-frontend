import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Calendar = () => {
    const { user, isAdmin, isProjectManager } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [events, setEvents] = useState([]);
    const [projects, setProjects] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedAssignee, setSelectedAssignee] = useState('');

    const calendarRef = useRef(null);

    const getStatusColor = (status) => status?.color || '#6B7280';

    const fetchTasks = async () => {
        try {
            let url = '/tasks';
            const params = new URLSearchParams();
            if (selectedProject) params.append('project_id', selectedProject);
            if (selectedStatus) params.append('status_id', selectedStatus);
            if (selectedAssignee) params.append('assigned_to', selectedAssignee);
            if (params.toString()) url += '?' + params.toString();

            const response = await api.get(url);
            setTasks(response.data);

            const calendarEvents = response.data
                .filter(task => task.due_date)
                .map(task => ({
                    id: String(task.id),
                    title: task.title,
                    start: task.due_date,
                    allDay: true,
                    backgroundColor: getStatusColor(task.status),
                    borderColor: getStatusColor(task.status),
                    textColor: '#fff',
                    extendedProps: { task },
                }));
            setEvents(calendarEvents);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
            setError('Failed to load calendar data');
            setLoading(false);
        }
    };

    const fetchFilterData = async () => {
        try {
            const [projectsRes, statusesRes, usersRes] = await Promise.all([
                api.get('/projects'),
                api.get('/admin/statuses'),
                api.get('/users'),
            ]);
            setProjects(projectsRes.data || []);
            setStatuses(statusesRes.data || []);
            setUsers(usersRes.data || []);
        } catch (err) {
            console.error('Failed to fetch filter data:', err);
        }
    };

    useEffect(() => {
        fetchFilterData();
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [selectedProject, selectedStatus, selectedAssignee]);

    const handleEventDrop = async (info) => {
        const taskId = info.event.id;
        const newDate = info.event.startStr;
        try {
            await api.put(`/tasks/${taskId}`, { due_date: newDate });
            fetchTasks();
        } catch (err) {
            console.error('Failed to update task date:', err);
            setError('Failed to update task date');
            info.revert();
        }
    };

    const handleEventClick = (info) => {
        const taskId = info.event.id;
        window.location.href = `/tasks/${taskId}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-2xl text-gray-600">Loading calendar...</div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#1E3A5F]">Calendar</h1>
                    <p className="text-gray-600">View and manage task deadlines</p>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>
            )}

            {/* Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                    <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                    >
                        <option value="">All Projects</option>
                        {projects.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                    >
                        <option value="">All Statuses</option>
                        {statuses.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                    <select
                        value={selectedAssignee}
                        onChange={(e) => setSelectedAssignee(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                    >
                        <option value="">All Users</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={() => {
                        setSelectedProject('');
                        setSelectedStatus('');
                        setSelectedAssignee('');
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors text-sm"
                >
                    Clear Filters
                </button>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,dayGridWeek',
                    }}
                    initialView="dayGridMonth"
                    editable={isAdmin() || isProjectManager()}
                    selectable={true}
                    events={events}
                    eventDrop={handleEventDrop}
                    eventClick={handleEventClick}
                    eventTimeFormat={{
                        hour: 'numeric',
                        minute: '2-digit',
                        meridiem: 'short',
                    }}
                    height="auto"
                    slotMinTime="06:00:00"
                    slotMaxTime="22:00:00"
                    dayMaxEvents={3}
                    weekends={true}
                    nowIndicator={true}
                    eventDidMount={(info) => {
                        const task = info.event.extendedProps.task;
                        if (task) {
                            info.el.title = `${task.title}\nProject: ${task.project?.name || 'N/A'}\nStatus: ${task.status?.name || 'N/A'}\nAssignee: ${task.assignee?.name || 'Unassigned'}`;
                        }
                    }}
                />
            </div>

            <div className="mt-4 text-sm text-gray-500">
                <p>💡 Drag a task to a new date to reschedule (if you have permission).</p>
                <p>📌 Click on a task to view its details.</p>
                <p>🎨 Task colors represent status.</p>
            </div>
        </div>
    );
};

export default Calendar;