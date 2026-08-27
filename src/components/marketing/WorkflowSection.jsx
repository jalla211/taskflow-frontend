import React from 'react';
import { ArrowDown, History } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const FlowStep = ({ label, tone, delay }) => (
    <Reveal delay={delay}>
        <div
            className={`px-5 py-3 rounded-lg font-semibold text-sm text-center transition-transform duration-200 hover:scale-105 ${
                tone === 'danger'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : tone === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-white text-[#1E3A5F] border border-gray-200 shadow-sm'
            }`}
        >
            {label}
        </div>
    </Reveal>
);

const FlowArrow = () => <ArrowDown className="w-4 h-4 text-gray-300 my-1" />;

const WorkflowSection = () => (
    <section className="py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <SectionHeading title="Move work forward, one step at a time." subtitle="TaskManage gives teams a clear workflow for every task." />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-14">
                <div className="flex flex-col items-center">
                    <FlowStep label="TO DO" delay={0} />
                    <FlowArrow />
                    <FlowStep label="IN PROGRESS" delay={100} />
                    <FlowArrow />
                    <FlowStep label="UNDER REVIEW" delay={200} />
                    <FlowArrow />
                    <FlowStep label="COMPLETED" tone="success" delay={300} />
                </div>

                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500 mb-3">When something goes wrong:</p>
                    <FlowStep label="IN PROGRESS" delay={0} />
                    <FlowArrow />
                    <FlowStep label="BLOCKED" tone="danger" delay={100} />
                    <FlowArrow />
                    <FlowStep label="RESOLVED" tone="success" delay={200} />
                    <FlowArrow />
                    <FlowStep label="IN PROGRESS" delay={300} />
                </div>
            </div>

            <Reveal>
                <div className="flex items-start gap-4 bg-gray-50 rounded-xl p-6 max-w-2xl mx-auto">
                    <History className="w-6 h-6 text-[#1E3A5F] flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-[#1E3A5F] mb-1">Every status change stays visible.</h3>
                        <p className="text-sm text-gray-600">
                            Teams can track who changed a task, what changed, and when it happened.
                        </p>
                    </div>
                </div>
            </Reveal>
        </div>
    </section>
);

export default WorkflowSection;
