import React from 'react';
import Reveal from './Reveal';

const PricingHero = ({ annual, onToggle }) => (
    <section
        className="relative overflow-hidden py-20 sm:py-24"
        style={{ background: 'linear-gradient(135deg, #0b3b5c 0%, #2b7a9e 40%, #6db3d9 70%, #b5dffa 100%)' }}
    >
        <div className="floating-shape" style={{ width: 200, height: 200, top: '10%', left: '6%', animationDelay: '0.5s', background: 'rgba(255,255,255,0.07)' }} />
        <div className="floating-shape" style={{ width: 120, height: 120, bottom: '8%', right: '10%', animationDelay: '2s', background: 'rgba(255,255,255,0.12)' }} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <Reveal>
                <p className="text-xs font-bold tracking-widest text-white/80 uppercase mb-4">Pricing</p>
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
                    Simple, transparent pricing
                </h1>
                <p className="text-lg text-white/85 max-w-xl mx-auto">
                    Start free. Upgrade as your team grows. No hidden fees, cancel anytime.
                </p>
            </Reveal>

            <Reveal delay={120}>
                <div className="mt-10 inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-full p-1.5">
                    <button
                        onClick={() => onToggle(false)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                            !annual ? 'bg-white text-[#1E3A5F]' : 'text-white/80 hover:text-white'
                        }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => onToggle(true)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                            annual ? 'bg-white text-[#1E3A5F]' : 'text-white/80 hover:text-white'
                        }`}
                    >
                        Annual
                        <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                annual ? 'bg-green-100 text-green-700' : 'bg-white/20 text-white'
                            }`}
                        >
                            Save 25%
                        </span>
                    </button>
                </div>
            </Reveal>
        </div>
    </section>
);

export default PricingHero;
