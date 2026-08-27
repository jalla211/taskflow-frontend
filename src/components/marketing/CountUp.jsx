import React, { useEffect, useRef, useState } from 'react';

/**
 * Counts up from 0 to `value` once scrolled into view. `prefix`/`suffix`
 * wrap the formatted number (e.g. value=10000 suffix="+" -> "10,000+").
 */
const CountUp = ({ value, prefix = '', suffix = '', duration = 1400, className = '' }) => {
    const ref = useRef(null);
    const [display, setDisplay] = useState(0);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const start = performance.now();
                    const tick = (now) => {
                        const progress = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setDisplay(Math.round(value * eased));
                        if (progress < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                    observer.disconnect();
                }
            },
            { threshold: 0.4 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [value, duration]);

    return (
        <span ref={ref} className={className}>
            {prefix}
            {display.toLocaleString()}
            {suffix}
        </span>
    );
};

export default CountUp;
