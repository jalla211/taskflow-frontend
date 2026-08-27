import React, { useEffect, useRef, useState } from 'react';

/**
 * A bar that grows from 0 to `value` percent along `axis` once it scrolls
 * into view, instead of rendering pre-filled.
 */
const AnimatedBar = ({ value, axis = 'width', className = '', delay = 0 }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const sizeStyle =
        axis === 'width' ? { width: visible ? `${value}%` : '0%' } : { height: visible ? `${value}%` : '0%' };

    return (
        <div
            ref={ref}
            className={`transition-all ease-out ${className}`}
            style={{ ...sizeStyle, transitionDuration: '900ms', transitionDelay: `${delay}ms` }}
        />
    );
};

export default AnimatedBar;
