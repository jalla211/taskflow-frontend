import React from 'react';
import { FileSpreadsheet, MessageCircle, Mail, FileText, LayoutGrid, RefreshCw } from 'lucide-react';
import Reveal from './Reveal';

const scattered = [
    { icon: FileSpreadsheet, label: 'Spreadsheets' },
    { icon: MessageCircle, label: 'Chat messages' },
    { icon: Mail, label: 'Emails' },
    { icon: FileText, label: 'Documents' },
    { icon: LayoutGrid, label: 'Separate project tools' },
    { icon: RefreshCw, label: 'Manual status updates' },
];

const questions = [
    "What needs to be done?",
    'Who is responsible?',
    "What's overdue?",
    "What's blocking the team?",
    'Are we on track?',
];

const ProblemSection = () => (
    <section className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <Reveal>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1E3A5F] leading-tight">
                    Work shouldn&apos;t feel this complicated.
                </h2>
                <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">Teams often manage work across:</p>
            </Reveal>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8 mb-14">
                {scattered.map((item, i) => (
                    <Reveal key={item.label} delay={i * 60}>
                        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-3 text-sm text-gray-600 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                            <item.icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{item.label}</span>
                        </div>
                    </Reveal>
                ))}
            </div>

            <Reveal>
                <p className="text-gray-500 mb-6">This makes it difficult to answer simple questions:</p>
            </Reveal>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
                {questions.map((q, i) => (
                    <Reveal key={q} delay={i * 70}>
                        <span className="italic text-[#1E3A5F] bg-white border border-gray-200 rounded-full px-4 py-2 text-sm shadow-sm">
                            &ldquo;{q}&rdquo;
                        </span>
                    </Reveal>
                ))}
            </div>

            <Reveal>
                <div className="bg-[#1E3A5F] rounded-2xl px-6 sm:px-10 py-10 text-white">
                    <h3 className="font-display text-2xl font-bold mb-2">TaskManage brings everything together.</h3>
                    <p className="text-white/80">
                        One workspace for your tasks, projects, people, deadlines, and progress.
                    </p>
                </div>
            </Reveal>
        </div>
    </section>
);

export default ProblemSection;
