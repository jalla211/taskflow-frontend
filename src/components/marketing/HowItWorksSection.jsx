import React from 'react';
import { ArrowRight } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const steps = [
    { number: '01', title: 'Create your workspace', description: 'Set up your team and projects.' },
    { number: '02', title: 'Add and assign work', description: 'Create tasks, set priorities, assign owners, and define deadlines.' },
    { number: '03', title: 'Track and deliver', description: 'Monitor progress, collaborate with your team, and complete the work.' },
];

const flow = ['CREATE', 'ASSIGN', 'TRACK', 'COLLABORATE', 'COMPLETE'];

const HowItWorksSection = () => (
    <section id="how-it-works" className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeading title="Get your team organized in three simple steps." />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
                {steps.map((step, i) => (
                    <Reveal
                        key={step.number}
                        delay={i * 130}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-shadow transition-transform duration-300"
                    >
                        <div className="font-display text-3xl font-bold text-[#4A90D9]/40 mb-3">{step.number}</div>
                        <h3 className="font-semibold text-[#1E3A5F] mb-1">{step.title}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                    </Reveal>
                ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
                {flow.map((step, i) => (
                    <Reveal key={step} delay={i * 90} as="span" className="flex items-center gap-3">
                        <span className="px-4 py-2 bg-[#1E3A5F] text-white text-sm font-semibold rounded-full">
                            {step}
                        </span>
                        {i < flow.length - 1 && <ArrowRight className="w-4 h-4 text-gray-300" />}
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

export default HowItWorksSection;
