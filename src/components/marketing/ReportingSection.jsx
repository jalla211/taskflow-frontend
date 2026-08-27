import React from 'react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import AnimatedBar from './AnimatedBar';

const metrics = [
    'Tasks created',
    'Tasks completed',
    'Tasks overdue',
    'Average completion time',
    'Tasks by priority',
    'Tasks by status',
    'Tasks by employee',
    'Project completion percentage',
];

const bars = [
    { label: 'W1', value: 20 },
    { label: 'W2', value: 65 },
    { label: 'W3', value: 45 },
    { label: 'W4', value: 100 },
];

const ReportingSection = () => (
    <section id="reporting" className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
                <SectionHeading
                    align="left"
                    title="Turn work data into better decisions."
                    subtitle="Managers can understand team performance and identify bottlenecks."
                    className="mb-8"
                />
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Track metrics such as:
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {metrics.map((m, i) => (
                        <Reveal key={m} delay={i * 50} as="span" className="text-sm text-gray-700 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4A90D9] flex-shrink-0" />
                            {m}
                        </Reveal>
                    ))}
                </div>
            </div>

            <Reveal delay={150} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p className="text-sm font-semibold text-gray-700 mb-6">Tasks Completed This Month</p>
                <div className="flex items-end justify-between gap-4 h-40">
                    {bars.map((b, i) => (
                        <div key={b.label} className="flex-1 flex flex-col items-center">
                            <div className="w-full flex flex-col justify-end" style={{ height: 120 }}>
                                <AnimatedBar
                                    value={b.value}
                                    axis="height"
                                    delay={i * 100}
                                    className="w-full bg-gradient-to-t from-[#1E3A5F] to-[#4A90D9] rounded-t-md"
                                />
                            </div>
                            <div className="text-xs font-medium text-gray-500 mt-2">{b.label}</div>
                        </div>
                    ))}
                </div>
            </Reveal>
        </div>
    </section>
);

export default ReportingSection;
