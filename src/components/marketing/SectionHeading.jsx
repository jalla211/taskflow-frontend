import React from 'react';
import Reveal from './Reveal';

const SectionHeading = ({ eyebrow, title, subtitle, align = 'center', className = '' }) => (
    <Reveal className={`${align === 'center' ? 'text-center mx-auto' : 'text-left'} max-w-2xl mb-14 ${className}`}>
        {eyebrow && (
            <p className="text-xs font-semibold tracking-widest text-[#4A90D9] uppercase mb-3">{eyebrow}</p>
        )}
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1E3A5F] leading-tight">{title}</h2>
        {subtitle && <p className="text-gray-600 mt-4 text-lg">{subtitle}</p>}
    </Reveal>
);

export default SectionHeading;
