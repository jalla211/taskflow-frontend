import React from 'react';
import Reveal from './Reveal';
import CountUp from './CountUp';

const stats = [
    { value: 10000, suffix: '+', label: 'tasks managed' },
    { value: 500, suffix: '+', label: 'teams' },
    { value: 50000, suffix: '+', label: 'users' },
];

const logos = ['Acme', 'Nova', 'Vertex', 'Flow', 'Horizon'];

const SocialProof = () => (
    <section className="py-16 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <Reveal>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-8">
                    Trusted by teams that want to get more done
                </p>
            </Reveal>
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
                {stats.map((s, i) => (
                    <Reveal key={s.label} delay={i * 120}>
                        <div className="font-display text-2xl sm:text-3xl font-bold text-[#1E3A5F]">
                            <CountUp value={s.value} suffix={s.suffix} />
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                    </Reveal>
                ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                {logos.map((logo, i) => (
                    <Reveal key={logo} delay={i * 80}>
                        <span className="text-xl font-bold text-gray-300 select-none hover:text-gray-400 transition-colors">
                            {logo}
                        </span>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

export default SocialProof;
