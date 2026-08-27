import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/logo-wordmark.png';

const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Features', to: '/#features' },
    { label: 'Solutions', to: '/#solutions' },
    { label: 'How It Works', to: '/#how-it-works' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Resources', to: '/#resources' },
];

const Nav = () => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Clicking Home/the logo while already on "/" is otherwise a no-op nav —
    // scroll to top so it still does something.
    const scrollToTopIfHome = () => {
        if (window.location.pathname === '/' && !window.location.hash) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <header
            className={`sticky top-0 z-40 bg-white/90 backdrop-blur border-b transition-shadow duration-300 ${
                scrolled ? 'border-gray-100 shadow-sm' : 'border-transparent'
            }`}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <Link to="/" onClick={scrollToTopIfHome}>
                    <img src={logo} alt="TaskManage" className="h-9 w-auto" />
                </Link>

                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            to={link.to}
                            onClick={link.to === '/' ? scrollToTopIfHome : undefined}
                            className="text-sm font-medium text-gray-600 hover:text-[#1E3A5F] transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden lg:flex items-center gap-3">
                    <Link
                        to="/login"
                        className="text-sm font-medium text-gray-700 hover:text-[#1E3A5F] px-3 py-2 transition-colors"
                    >
                        Log In
                    </Link>
                    <Link
                        to="/login"
                        className="bg-[#1E3A5F] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#2E5A88] hover:scale-105 transition-all duration-200"
                    >
                        Get Started Free
                    </Link>
                </div>

                <button
                    onClick={() => setOpen((v) => !v)}
                    className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                    aria-label="Toggle menu"
                >
                    {open ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
                </button>
            </div>

            {open && (
                <div className="lg:hidden border-t border-gray-100 bg-white px-4 sm:px-6 py-4">
                    <nav className="flex flex-col gap-3 mb-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                onClick={() => {
                                    setOpen(false);
                                    if (link.to === '/') scrollToTopIfHome();
                                }}
                                className="text-sm font-medium text-gray-600 hover:text-[#1E3A5F] py-1"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex flex-col gap-2">
                        <Link
                            to="/login"
                            className="text-center text-sm font-medium text-gray-700 border border-gray-200 px-4 py-2 rounded-md"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/login"
                            className="text-center bg-[#1E3A5F] text-white text-sm font-semibold px-4 py-2 rounded-md"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Nav;
