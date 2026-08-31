import React from 'react';
import { User, Edit3, Clock } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const items = [
    { icon: User, label: 'Who', description: 'made the change' },
    { icon: Edit3, label: 'What', description: 'changed' },
    { icon: Clock, label: 'When', description: 'it changed' },
];

const SecuritySection = () => (
    <section id="security" className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <SectionHeading
                title="Every important action stays traceable."
                subtitle="TaskManage maintains activity history for important task changes."
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {items.map((item, i) => (
                    <Reveal
                        key={item.label}
                        delay={i * 100}
                        className="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors duration-200"
                    >
                        <div className="w-12 h-12 bg-[#1E3A5F]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <item.icon className="w-6 h-6 text-[#1E3A5F]" />
                        </div>
                        <p>
                            <span className="font-bold text-[#1E3A5F]">{item.label}</span>{' '}
                            <span className="text-gray-600">{item.description}</span>
                        </p>
                    </Reveal>
                ))}
            </div>
            <p className="text-center text-sm text-gray-500">
                This supports accountability and traceability throughout the task lifecycle.
            </p>
        </div>
    </section>
);

export default SecuritySection;
