import React from 'react';
import { Target, UserCheck, Eye, ShieldCheck, BellRing } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const reasons = [
    { icon: Target, title: 'One source of truth', description: 'Everyone works from the same tasks, projects, deadlines, and updates.' },
    { icon: UserCheck, title: 'Clear ownership', description: 'Every task has an owner and a clear responsibility.' },
    { icon: Eye, title: 'Complete visibility', description: 'Know what’s happening across your projects and teams.' },
    { icon: ShieldCheck, title: 'Better accountability', description: 'Track important changes and activity throughout the task lifecycle.' },
    { icon: BellRing, title: 'Fewer missed deadlines', description: 'Get reminders before work becomes overdue.' },
];

const WhySection = () => (
    <section className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeading eyebrow="Why TaskManage?" title="Less chasing. More doing." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {reasons.map((r, i) => (
                    <Reveal key={r.title} delay={i * 90} className="text-center px-2 group">
                        <div className="w-14 h-14 bg-[#1E3A5F]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#1E3A5F]/15">
                            <r.icon className="w-7 h-7 text-[#1E3A5F]" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{r.title}</h3>
                        <p className="text-sm text-gray-600">{r.description}</p>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

export default WhySection;
