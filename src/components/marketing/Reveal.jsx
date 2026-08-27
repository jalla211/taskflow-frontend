import React, { useEffect, useRef, useState } from 'react';

/**
 * Fades + slides children in once they scroll into view. Fires immediately
 * for content already in the viewport (e.g. the hero), so it doubles as a
 * page-load entrance animation with no separate code path.
 */
const Reveal = ({ children, className = '', delay = 0, as: Tag = 'div', ...rest }) => {
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
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            className={`transition-all duration-700 ease-out ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${className}`}
            style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
            {...rest}
        >
            {children}
        </Tag>
    );
};

export default Reveal;
