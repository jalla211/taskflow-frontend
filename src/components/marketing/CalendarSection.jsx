import React from 'react';
import { Eye, PenLine, FolderKanban, CircleDot, Repeat2 } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import AnimatedBar from './AnimatedBar';

const features = [
    { icon: Eye, label: 'View task deadlines.' },
    { icon: PenLine, label: 'Change task dates where authorized.' },
    { icon: FolderKanban, label: 'Filter by project.' },
    { icon: CircleDot, label: 'Filter by status.' },
    { icon: Repeat2, label: 'Support recurring tasks where required.' },
];

const days = [
    { day: 'MON', task: 'Login', height: 60 },
    { day: 'TUE', task: 'API', height: 40 },
    { day: 'WED', task: 'Review', height: 75, deadline: true },
    { day: 'THU', task: 'Testing', height: 25 },
    { day: 'FRI', task: 'Deploy', height: 90 },
];

const CalendarSection = () => (
    <section id="calendar" className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
                <SectionHeading
                    align="left"
                    title="See your workload on the calendar."
                    subtitle="Turn task deadlines into a clear schedule."
                    className="mb-8"
                />
                <div className="space-y-3">
                    {features.map((f, i) => (
                        <Reveal key={f.label} delay={i * 70} className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 bg-[#1E3A5F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <f.icon className="w-4 h-4 text-[#1E3A5F]" />
                            </div>
                            <span className="text-sm">{f.label}</span>
                        </Reveal>
                    ))}
                </div>
                <p className="text-sm text-gray-500 mt-6">
                    The system requirements include calendar-based task visualization and deadline management.
                </p>
            </div>

            <Reveal delay={150} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="grid grid-cols-5 gap-3 items-end">
                    {days.map((d, i) => (
                        <div key={d.day} className="flex flex-col items-center">
                            {d.deadline ? (
                                <span className="text-[10px] font-semibold text-red-600 mb-1">Deadline</span>
                            ) : (
                                <span className="text-[10px] mb-1">&nbsp;</span>
                            )}
                            <div className="w-full flex flex-col justify-end" style={{ height: 140 }}>
                                <AnimatedBar
                                    value={d.height}
                                    axis="height"
                                    delay={i * 80}
                                    className={`w-full rounded-t-md ${d.deadline ? 'bg-red-400' : 'bg-[#4A90D9]'}`}
                                />
                            </div>
                            <div className="text-xs font-semibold text-gray-500 mt-2">{d.day}</div>
                            <div className="text-[11px] text-gray-400">{d.task}</div>
                        </div>
                    ))}
                </div>
            </Reveal>
        </div>
    </section>
);

export default CalendarSection;
