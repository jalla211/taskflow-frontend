import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

const FinalCta = () => (
    <section
        id="pricing"
        className="py-20 sm:py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0b3b5c 0%, #2b7a9e 40%, #6db3d9 70%, #b5dffa 100%)' }}
    >
        <div className="floating-shape" style={{ width: 180, height: 180, top: '15%', right: '8%', animationDelay: '1s', background: 'rgba(255,255,255,0.08)' }} />
        <div className="floating-shape" style={{ width: 110, height: 110, bottom: '12%', left: '10%', animationDelay: '3s', background: 'rgba(255,255,255,0.13)' }} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <Reveal>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
                    Ready to get your work under control?
                </h2>
            </Reveal>
            <Reveal delay={80}>
                <p className="text-white/85 text-lg mb-1">Bring your tasks, projects, and team into one workspace.</p>
                <p className="text-white/85 text-lg mb-10">Start managing work smarter today.</p>
            </Reveal>
            <Reveal delay={160}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 bg-white text-[#1E3A5F] font-semibold px-6 py-3 rounded-md hover:bg-gray-100 hover:scale-105 hover:shadow-xl transition-all duration-200 shadow-lg w-full sm:w-auto justify-center"
                    >
                        Start Free <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-md border border-white/30 hover:bg-white/10 hover:border-white/60 transition-all duration-200 w-full sm:w-auto justify-center"
                    >
                        Contact Sales
                    </Link>
                </div>
            </Reveal>
            <Reveal delay={240}>
                <p className="text-sm text-white/70">Start organizing your team&apos;s work today.</p>
            </Reveal>
        </div>
    </section>
);

export default FinalCta;
