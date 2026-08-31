import React from 'react';
import { Search, Hash, Type, AlignLeft } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const searchBy = [
    { icon: Hash, label: 'Task ID' },
    { icon: Type, label: 'Title' },
    { icon: AlignLeft, label: 'Description' },
];

const narrowBy = ['Project', 'Status', 'Priority', 'Assignee', 'Due date', 'Creation date', 'Tags'];

const SearchSection = () => (
    <section className="py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <SectionHeading
                title="Find what you need in seconds."
                subtitle="Stop searching through spreadsheets, emails, and chat messages."
            />

            <Reveal className="relative max-w-lg mx-auto mb-8 group">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-hover:text-[#4A90D9]" />
                <div className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full text-left text-gray-400 shadow-sm bg-white transition-shadow duration-200 group-hover:shadow-md">
                    Search tasks by ID, title, or description…
                </div>
            </Reveal>

            <Reveal delay={100} className="flex items-center justify-center gap-6 mb-8 text-sm font-medium text-gray-500">
                {searchBy.map((s) => (
                    <span key={s.label} className="flex items-center gap-1.5">
                        <s.icon className="w-4 h-4 text-[#4A90D9]" />
                        {s.label}
                    </span>
                ))}
            </Reveal>

            <Reveal delay={180}>
                <p className="text-sm text-gray-500 mb-4">Then narrow your results using:</p>
                <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                    {narrowBy.map((f) => (
                        <span
                            key={f}
                            className="text-xs font-medium text-[#1E3A5F] bg-[#1E3A5F]/10 px-3 py-1.5 rounded-full hover:bg-[#1E3A5F]/20 transition-colors cursor-default"
                        >
                            {f}
                        </span>
                    ))}
                </div>
            </Reveal>

            <p className="text-sm text-gray-500">
                The source requirements explicitly include task search, filtering, sorting, and saved filters.
            </p>
        </div>
    </section>
);

export default SearchSection;
