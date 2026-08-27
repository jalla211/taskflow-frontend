import React from 'react';
import { MessageSquare, AtSign, Paperclip, History } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const items = [
    { icon: MessageSquare, title: 'Comments', description: 'Discuss tasks directly where the work happens.' },
    { icon: AtSign, title: 'Mentions', description: 'Mention teammates when you need their attention.' },
    { icon: Paperclip, title: 'Attachments', description: 'Attach documents, images, specifications, and other files directly to tasks.' },
    { icon: History, title: 'Activity History', description: 'Keep a record of important task activity.' },
];

const CollaborationSection = () => (
    <section id="collaboration" className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeading title="Work together without losing the context." subtitle="Keep conversations connected to the work." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {items.map((item, i) => (
                    <Reveal
                        key={item.title}
                        delay={i * 100}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-shadow transition-transform duration-300"
                    >
                        <div className="w-12 h-12 bg-[#1E3A5F]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <item.icon className="w-6 h-6 text-[#1E3A5F]" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                    </Reveal>
                ))}
            </div>
            <p className="text-center text-sm text-gray-500 max-w-2xl mx-auto">
                The system specification supports comments, mentions, discussion history, attachments,
                and task activity tracking.
            </p>
        </div>
    </section>
);

export default CollaborationSection;
