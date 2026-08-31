import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const faqs = [
    {
        q: 'Is there a free trial on paid plans?',
        a: 'Yes — the Team plan includes a free trial with no credit card required. You can start on the Free plan and upgrade whenever your team needs more.',
    },
    {
        q: 'Can I change plans later?',
        a: 'You can move between plans at any time as your team grows. Your projects, tasks, and history carry over automatically.',
    },
    {
        q: "What's included in Enterprise?",
        a: 'Enterprise adds role-based permissions, full audit logs, custom task configuration, SSO, and dedicated onboarding — built for organizations that need administrative control at scale.',
    },
    {
        q: 'How does per-user pricing work?',
        a: 'Team plan pricing is per active team member per month. Annual billing gives you a discount over paying monthly.',
    },
];

const FaqItem = ({ item, isOpen, onToggle }) => (
    <div className="border-b border-gray-100 last:border-0">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between gap-4 py-5 text-left"
        >
            <span className="font-medium text-gray-800">{item.q}</span>
            <ChevronDown
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                }`}
            />
        </button>
        <div
            className="grid transition-all duration-300 ease-out"
            style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
        >
            <div className="overflow-hidden">
                <p className="text-sm text-gray-600 pb-5 pr-8">{item.a}</p>
            </div>
        </div>
    </div>
);

const PricingFaq = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-20 sm:py-24">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                <SectionHeading title="Frequently asked questions" />
                <Reveal className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6">
                    {faqs.map((item, i) => (
                        <FaqItem
                            key={item.q}
                            item={item}
                            isOpen={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                        />
                    ))}
                </Reveal>
            </div>
        </section>
    );
};

export default PricingFaq;
