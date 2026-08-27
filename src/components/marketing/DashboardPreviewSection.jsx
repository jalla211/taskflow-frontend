import React from 'react';
import { ClipboardList, Clock, TrendingUp, CheckCircle2, AlertCircle, User, FolderKanban, Users } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import CountUp from './CountUp';

const stats = [
    { label: 'Total Tasks', value: 25, icon: ClipboardList, color: 'text-[#1E3A5F]', bg: 'bg-[#1E3A5F]/10' },
    { label: 'To Do', value: 10, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'In Progress', value: 7, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Completed', value: 6, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Overdue', value: 2, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
];

const tracked = [
    { icon: User, label: 'Personal workload' },
    { icon: FolderKanban, label: 'Project progress' },
    { icon: Clock, label: 'Pending tasks' },
    { icon: AlertCircle, label: 'Overdue work' },
    { icon: CheckCircle2, label: 'Completed tasks' },
    { icon: Users, label: 'Team-level statistics' },
];

const DashboardPreviewSection = () => (
    <section className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeading
                title="Know what's happening at a glance."
                subtitle="Your personalized dashboard gives you a clear picture of your workload."
            />

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-4xl mx-auto mb-14">
                {stats.map((s, i) => (
                    <Reveal
                        key={s.label}
                        delay={i * 90}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-shadow transition-transform duration-300"
                    >
                        <div className={`${s.bg} w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                            <s.icon className={`w-5 h-5 ${s.color}`} />
                        </div>
                        <div className={`text-2xl font-bold ${s.color}`}>
                            <CountUp value={s.value} duration={900} />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                    </Reveal>
                ))}
            </div>

            <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
                See more than numbers
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
                {tracked.map((t, i) => (
                    <Reveal
                        key={t.label}
                        delay={i * 60}
                        className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg px-4 py-3 shadow-sm"
                    >
                        <t.icon className="w-4 h-4 text-[#4A90D9] flex-shrink-0" />
                        <span className="text-sm text-gray-700">{t.label}</span>
                    </Reveal>
                ))}
            </div>

            <p className="text-center text-sm text-gray-500 max-w-2xl mx-auto">
                The dashboard requirements specifically include personalized dashboards, task statistics,
                project progress, and team-level statistics for managers.
            </p>
        </div>
    </section>
);

export default DashboardPreviewSection;
