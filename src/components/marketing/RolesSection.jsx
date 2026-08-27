import React from 'react';
import { UserCircle, Users, Briefcase, ShieldCheck } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const roles = [
    {
        icon: UserCircle,
        title: 'For Team Members',
        description: 'Know exactly what you need to work on.',
        tags: ['My Tasks', 'Deadlines', 'Priorities', 'Notifications'],
    },
    {
        icon: Users,
        title: 'For Team Leaders',
        description: 'Keep your team moving.',
        tags: ['Assignments', 'Team Progress', 'Workload'],
    },
    {
        icon: Briefcase,
        title: 'For Project Managers',
        description: 'Stay ahead of projects.',
        tags: ['Project Progress', 'Team Performance', 'Reports'],
    },
    {
        icon: ShieldCheck,
        title: 'For Administrators',
        description: 'Control the platform.',
        tags: ['Users', 'Roles', 'Permissions', 'Configuration', 'Audit Logs'],
    },
];

const RolesSection = () => (
    <section id="solutions" className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeading eyebrow="Solutions" title="One platform. Different roles. One shared goal." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {roles.map((role, i) => (
                    <Reveal
                        key={role.title}
                        delay={i * 100}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-shadow transition-transform duration-300"
                    >
                        <div className="w-12 h-12 bg-[#1E3A5F]/10 rounded-xl flex items-center justify-center mb-4">
                            <role.icon className="w-6 h-6 text-[#1E3A5F]" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{role.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                            {role.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-xs font-medium text-[#1E3A5F] bg-[#1E3A5F]/10 px-2 py-1 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </Reveal>
                ))}
            </div>
            <p className="text-center text-sm text-gray-500 max-w-2xl mx-auto mt-10">
                The source specification defines these four user roles and role-based access requirements.
            </p>
        </div>
    </section>
);

export default RolesSection;
