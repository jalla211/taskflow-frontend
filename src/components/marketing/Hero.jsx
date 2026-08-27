import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle, CheckCircle2, Clock, TrendingUp, AlertCircle, Users } from 'lucide-react';
import Reveal from './Reveal';
import AnimatedBar from './AnimatedBar';

const HeroDashboardPreview = () => (
    <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 w-full max-w-lg mx-auto text-left">
        <div className="flex items-center gap-1.5 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>

        {/* Task overview */}
        <div className="grid grid-cols-4 gap-2 mb-4">
            {[
                { label: 'To Do', value: 10, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                { label: 'Active', value: 7, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Done', value: 6, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Overdue', value: 2, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
            ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-lg p-2 text-center`}>
                    <s.icon className={`w-3.5 h-3.5 ${s.color} mx-auto mb-1`} />
                    <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-[10px] text-gray-500">{s.label}</div>
                </div>
            ))}
        </div>

        {/* Project progress */}
        <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-700">Website Redesign</span>
                <span className="font-medium text-[#1E3A5F]">80%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2 overflow-hidden">
                <AnimatedBar value={80} className="bg-[#1E3A5F] h-1.5 rounded-full" delay={200} />
            </div>
            <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-700">Mobile Application</span>
                <span className="font-medium text-[#1E3A5F]">55%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <AnimatedBar value={55} className="bg-[#4A90D9] h-1.5 rounded-full" delay={350} />
            </div>
        </div>

        {/* Team assignments + priority + deadline */}
        <div className="space-y-2 mb-4">
            {[
                { title: 'Implement Login', who: 'Kamana', priority: 'Critical', color: '#DC3545', due: 'Today' },
                { title: 'Dashboard UI', who: 'Alice', priority: 'High', color: '#FFC107', due: 'Aug 29' },
            ].map((t) => (
                <div key={t.title} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                    <div className="min-w-0">
                        <div className="text-xs font-medium text-gray-800 truncate">{t.title}</div>
                        <div className="text-[10px] text-gray-500">
                            {t.who} · Due {t.due}
                        </div>
                    </div>
                    <span
                        className="text-[10px] font-medium text-white px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={{ backgroundColor: t.color }}
                    >
                        {t.priority}
                    </span>
                </div>
            ))}
        </div>

        {/* Activity */}
        <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-gray-100 pt-3">
            <Users className="w-3.5 h-3.5 text-[#1E3A5F]" />
            <span>Alice moved "Testing" to In Progress · 2m ago</span>
        </div>
    </div>
);

const Hero = () => (
    <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0b3b5c 0%, #2b7a9e 40%, #6db3d9 70%, #b5dffa 100%)' }}
    >
        <div className="floating-shape" style={{ width: 220, height: 220, top: '8%', left: '4%', animationDelay: '0s', background: 'rgba(255,255,255,0.06)' }} />
        <div className="floating-shape" style={{ width: 140, height: 140, bottom: '10%', right: '6%', animationDelay: '2.5s', background: 'rgba(255,255,255,0.10)' }} />
        <div className="floating-shape" style={{ width: 90, height: 90, top: '55%', left: '18%', animationDelay: '1.2s', background: 'rgba(255,255,255,0.12)' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center relative z-10">
            <div className="text-center lg:text-left">
                <Reveal>
                    <p className="text-xs font-bold tracking-widest text-white/80 uppercase mb-4">
                        The smarter way to manage work
                    </p>
                </Reveal>
                <Reveal delay={100}>
                    <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
                        Plan work. Track progress.
                        <br />
                        Get things done.
                    </h1>
                </Reveal>
                <Reveal delay={200}>
                    <p className="mt-6 text-lg text-white/85 max-w-xl mx-auto lg:mx-0">
                        TaskManage brings your tasks, projects, teams, deadlines, and conversations
                        into one simple workspace — so everyone knows what needs to be done, who owns
                        it, and when it needs to be completed.
                    </p>
                </Reveal>
                <Reveal delay={320}>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 bg-white text-[#1E3A5F] font-semibold px-6 py-3 rounded-md hover:bg-gray-100 hover:scale-105 hover:shadow-xl transition-all duration-200 shadow-lg w-full sm:w-auto justify-center"
                        >
                            Start Free <ArrowRight className="w-4 h-4" />
                        </Link>
                        <a
                            href="#how-it-works"
                            className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-md border border-white/30 hover:bg-white/10 hover:border-white/60 transition-all duration-200 w-full sm:w-auto justify-center"
                        >
                            <PlayCircle className="w-4 h-4" /> See How It Works
                        </a>
                    </div>
                </Reveal>
                <Reveal delay={420}>
                    <p className="mt-4 text-sm text-white/70">No credit card required.</p>
                </Reveal>
            </div>

            <Reveal delay={250}>
                <HeroDashboardPreview />
            </Reveal>
        </div>
    </section>
);

export default Hero;
