import React from 'react';
import { Link } from 'react-router-dom';
import {
    Type,
    AlignLeft,
    FolderKanban,
    UserCircle,
    Flag,
    CircleDot,
    CalendarDays,
    CalendarClock,
    Tag,
    Paperclip,
    ArrowRight,
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import AnimatedBar from './AnimatedBar';

const taskAttributes = [
    { icon: Type, label: 'Task title' },
    { icon: AlignLeft, label: 'Description' },
    { icon: FolderKanban, label: 'Project' },
    { icon: UserCircle, label: 'Assignee' },
    { icon: Flag, label: 'Priority' },
    { icon: CircleDot, label: 'Status' },
    { icon: CalendarDays, label: 'Start date' },
    { icon: CalendarClock, label: 'Due date' },
    { icon: Tag, label: 'Tags' },
    { icon: Paperclip, label: 'Attachments' },
];

const projectFields = [
    'Project name',
    'Description',
    'Project manager',
    'Team members',
    'Start date',
    'End date',
    'Status',
    'Tasks',
];

const FeaturesShowcase = () => (
    <section id="features" className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeading
                eyebrow="Features"
                title="Powerful task management without the complexity"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tasks */}
                <Reveal className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg hover:-translate-y-1 transition-shadow transition-transform duration-300">
                    <h3 className="font-display text-xl font-bold text-[#1E3A5F] mb-2">Tasks that everyone understands</h3>
                    <p className="text-gray-600 mb-6">Create tasks with the information your team needs.</p>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {taskAttributes.map((attr) => (
                            <div key={attr.label} className="flex items-center gap-2 text-sm text-gray-700">
                                <attr.icon className="w-4 h-4 text-[#4A90D9] flex-shrink-0" />
                                {attr.label}
                            </div>
                        ))}
                    </div>
                    <Link
                        to="/login"
                        className="group inline-flex items-center gap-1.5 text-[#1E3A5F] font-semibold hover:underline"
                    >
                        Explore Task Management{' '}
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                </Reveal>

                {/* Projects */}
                <Reveal
                    delay={120}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg hover:-translate-y-1 transition-shadow transition-transform duration-300"
                >
                    <h3 className="font-display text-xl font-bold text-[#1E3A5F] mb-2">Projects that stay on track</h3>
                    <p className="text-gray-600 mb-6">Organize related work into projects and see progress at a glance.</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
                        {projectFields.map((field) => (
                            <span key={field} className="text-sm text-gray-700 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4A90D9]" />
                                {field}
                            </span>
                        ))}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">Website Redesign</span>
                                <span className="font-medium text-[#1E3A5F]">80%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <AnimatedBar value={80} className="bg-[#1E3A5F] h-2 rounded-full" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">Mobile Application</span>
                                <span className="font-medium text-[#1E3A5F]">55%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <AnimatedBar value={55} className="bg-[#4A90D9] h-2 rounded-full" delay={150} />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">Project progress is based on the completion of associated tasks.</p>
                    </div>

                    <Link
                        to="/login"
                        className="group inline-flex items-center gap-1.5 text-[#1E3A5F] font-semibold hover:underline"
                    >
                        Manage Projects{' '}
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                </Reveal>
            </div>
        </div>
    </section>
);

export default FeaturesShowcase;
