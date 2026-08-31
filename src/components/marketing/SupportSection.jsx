import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, BookOpen, Users2, Clock, ArrowRight } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import CountUp from './CountUp';
import avatar1 from '../../assets/avatars/avatar-1.jpg';
import avatar2 from '../../assets/avatars/avatar-2.jpg';
import avatar3 from '../../assets/avatars/avatar-3.jpg';
import avatar4 from '../../assets/avatars/avatar-4.jpg';

const channels = [
    {
        icon: MessageCircle,
        title: 'Live Chat',
        description: 'Talk to a real person from inside the app — no ticket queue.',
    },
    {
        icon: Mail,
        title: 'Email Support',
        description: 'Detailed help for account, billing, and setup questions.',
    },
    {
        icon: BookOpen,
        title: 'Help Center',
        description: 'Guides and answers for getting the most out of TaskManage.',
    },
    {
        icon: Users2,
        title: 'Community',
        description: 'Ask questions and share tips with other TaskManage teams.',
    },
];

const stats = [
    { value: 2, suffix: 'hr', label: 'average first response' },
    { value: 98, suffix: '%', label: 'satisfaction rating' },
    { value: 24, suffix: '/5', label: 'support availability' },
];

const team = [
    { name: 'Alex Morgan', role: 'Support Specialist', avatar: avatar1 },
    { name: 'Jordan Lee', role: 'Customer Success Lead', avatar: avatar2 },
    { name: 'Sam Rivera', role: 'Technical Support Engineer', avatar: avatar3 },
    { name: 'Taylor Chen', role: 'Onboarding Specialist', avatar: avatar4 },
];

const SupportSection = () => (
    <section id="support" className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeading
                eyebrow="Support"
                title="Real support, whenever your team needs it"
                subtitle="Reach a real person however you prefer — help doesn't stop after onboarding."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
                {channels.map((c, i) => (
                    <Reveal
                        key={c.title}
                        delay={i * 90}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-shadow transition-transform duration-300"
                    >
                        <div className="w-12 h-12 bg-[#1E3A5F]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <c.icon className="w-6 h-6 text-[#1E3A5F]" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{c.title}</h3>
                        <p className="text-sm text-gray-600">{c.description}</p>
                    </Reveal>
                ))}
            </div>

            <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
                Meet the team
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
                {team.map((member, i) => (
                    <Reveal
                        key={member.name}
                        delay={i * 90}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-shadow transition-transform duration-300"
                    >
                        <img
                            src={member.avatar}
                            alt=""
                            className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                        />
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{member.role}</p>
                    </Reveal>
                ))}
            </div>

            <Reveal className="bg-[#1E3A5F] rounded-2xl px-6 sm:px-10 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center mb-8">
                    {stats.map((s) => (
                        <div key={s.label}>
                            <div className="font-display text-3xl font-bold text-white">
                                <CountUp value={s.value} suffix={s.suffix} duration={1000} />
                            </div>
                            <div className="text-sm text-white/70 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                        <Clock className="w-4 h-4" />
                        Most questions answered same-day
                    </div>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 bg-white text-[#1E3A5F] font-semibold px-5 py-2.5 rounded-md hover:bg-gray-100 hover:scale-105 transition-all duration-200"
                    >
                        Contact Support <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </Reveal>
            <p className="text-center text-xs text-gray-400 mt-6">
                Team and figures shown are illustrative placeholders, not actual staff or measured statistics.
            </p>
        </div>
    </section>
);

export default SupportSection;
