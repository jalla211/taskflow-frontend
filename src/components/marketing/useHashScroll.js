import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls smoothly to the element matching the current URL hash (e.g.
 * "/pricing" -> "/#features" lands on Home and scrolls to #features).
 * React Router doesn't do this automatically on client-side navigation.
 */
export default function useHashScroll() {
    const location = useLocation();

    useEffect(() => {
        if (!location.hash) return undefined;
        const id = location.hash.slice(1);
        const timer = setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 60);
        return () => clearTimeout(timer);
    }, [location]);
}
