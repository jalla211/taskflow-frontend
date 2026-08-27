import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FolderKanban,
    CheckSquare,
    Users,
    Calendar,
    FileText,
    Bell,
    ShieldCheck,
    ArrowRight,
} from 'lucide-react';

const features = [
    {
        icon: FolderKanban,
        title: 'Projects',
        description: 'Organize work into projects with clear timelines and ownership.',
    },
    {
        icon: CheckSquare,
        title: 'Tasks',
        description: 'Create, assign, and track tasks through to-do, in-progress, and done.',
    },
    {
        icon: Users,
        title: 'Team Management',
        description: 'Invite teammates and see workload and progress at a glance.',
    },
    {
        icon: Calendar,
        title: 'Calendar',
        description: 'Visualize deadlines and milestones across every project.',
    },
    {
        icon: FileText,
        title: 'Reports',
        description: 'Export progress and performance reports for stakeholders.',
    },
    {
        icon: Bell,
        title: 'Notifications',
        description: 'Stay on top of assignments, comments, and due dates in real time.',
    },
];

const roles = [
    { name: 'Admin', description: 'Full access to users, settings, and audit logs.' },
    { name: 'Project Manager', description: 'Creates projects and reports on progress.' },
    { name: 'Team Leader', description: 'Oversees tasks for their team.' },
    { name: 'Team Member', description: 'Manages their own assigned tasks.' },
];

const Home = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        navigate('/dashboard');
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Nav */}
            <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-[#1E3A5F] rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">T</span>
                        </div>
                        <span className="text-lg font-bold text-[#1E3A5F] tracking-tight">TaskFlow</span>
                    </div>
                    <Link
                        to="/login"
                        className="bg-[#1E3A5F] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-[#2E5A88] transition-colors"
                    >
                        Login
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section
                className="relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0b3b5c 0%, #2b7a9e 40%, #6db3d9 70%, #b5dffa 100%)' }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                        Organize work.
                        <br />
                        Ship faster, together.
                    </h1>
                    <p className="mt-6 text-lg text-white/85 max-w-2xl mx-auto">
                        TaskFlow helps your team plan projects, track tasks, and hit deadlines
                        with role-based dashboards built for every part of your organization.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-4">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 bg-white text-[#1E3A5F] font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Get Started <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
                <div className="text-center mb-14">
                    <h2 className="text-3xl font-bold text-[#1E3A5F]">Everything your team needs</h2>
                    <p className="text-gray-600 mt-2">One workspace for planning, tracking, and reporting.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="w-12 h-12 bg-[#1E3A5F]/10 rounded-xl flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6 text-[#1E3A5F]" />
                                </div>
                                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Roles */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-14">
                        <div className="w-12 h-12 bg-[#1E3A5F]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-6 h-6 text-[#1E3A5F]" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#1E3A5F]">Built for every role</h2>
                        <p className="text-gray-600 mt-2">Access adapts automatically to who's signed in.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {roles.map((role) => (
                            <div key={role.name} className="bg-white rounded-xl shadow-sm p-6 text-center">
                                <h3 className="font-semibold text-[#1E3A5F]">{role.name}</h3>
                                <p className="text-gray-600 text-sm mt-2">{role.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                    <span>&copy; {new Date().getFullYear()} TaskFlow. All rights reserved.</span>
                    <Link to="/login" className="text-[#1E3A5F] font-medium hover:underline">
                        Sign in to your workspace
                    </Link>
                </div>
            </footer>
        </div>
    );
};

export default Home;
