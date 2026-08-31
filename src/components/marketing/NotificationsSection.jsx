import React from 'react';
import { UserPlus, Repeat, RefreshCw, AtSign, CalendarClock, AlertTriangle, SlidersHorizontal } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const triggers = [
    { icon: UserPlus, label: 'A task is assigned to you.' },
    { icon: Repeat, label: 'A task is reassigned.' },
    { icon: RefreshCw, label: 'Your task status changes.' },
    { icon: AtSign, label: 'Someone mentions you.' },
    { icon: CalendarClock, label: 'A deadline is approaching.' },
    { icon: AlertTriangle, label: 'A task becomes overdue.' },
];

const NotificationsSection = () => (
    <section id="notifications" className="py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <SectionHeading title="Never miss what matters." subtitle="TaskManage keeps your team informed about important changes." />

            <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
                Get notified when:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
                {triggers.map((t, i) => (
                    <Reveal key={t.label} delay={i * 70}>
                        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg px-4 py-3 shadow-sm hover:shadow-md hover:border-[#4A90D9]/30 transition-all duration-200">
                            <t.icon className="w-4 h-4 text-[#4A90D9] flex-shrink-0" />
                            <span className="text-sm text-gray-700">{t.label}</span>
                        </div>
                    </Reveal>
                ))}
            </div>

            <Reveal>
                <div className="flex items-start gap-4 bg-[#1E3A5F] rounded-xl p-6 max-w-2xl mx-auto text-white">
                    <SlidersHorizontal className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold mb-1">Stay informed. Not overwhelmed.</h3>
                        <p className="text-sm text-white/80">
                            Customize your notification preferences and keep a history of notifications.
                        </p>
                    </div>
                </div>
            </Reveal>
        </div>
    </section>
);

export default NotificationsSection;
