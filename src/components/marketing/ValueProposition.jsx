import React from 'react';
import { LayoutGrid, Flag, MessageSquare, TrendingUp, Rocket } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const values = [
    { icon: LayoutGrid, title: 'Organize', description: 'Keep projects and tasks structured in one centralized workspace.' },
    { icon: Flag, title: 'Prioritize', description: 'Know what needs attention first with clear task priorities.' },
    { icon: MessageSquare, title: 'Collaborate', description: 'Discuss work, mention teammates, and keep conversations connected to tasks.' },
    { icon: TrendingUp, title: 'Track', description: 'See task and project progress without chasing status updates.' },
    { icon: Rocket, title: 'Deliver', description: 'Stay ahead of deadlines and keep work moving toward completion.' },
];

const ValueProposition = () => (
    <section className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeading title="Everything your team needs to stay on track." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {values.map((v, i) => (
                    <Reveal key={v.title} delay={i * 90} className="text-center px-2 group">
                        <div className="w-14 h-14 bg-[#1E3A5F]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#1E3A5F]/15">
                            <v.icon className="w-7 h-7 text-[#1E3A5F]" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{v.title}</h3>
                        <p className="text-sm text-gray-600">{v.description}</p>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

export default ValueProposition;
