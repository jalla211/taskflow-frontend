import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo-wordmark.png';
import Reveal from './Reveal';

const FooterLink = ({ to, children }) =>
    to ? (
        <Link to={to} className="text-sm text-gray-400 hover:text-white transition-colors">
            {children}
        </Link>
    ) : (
        <span className="text-sm text-gray-500 cursor-default">{children}</span>
    );

const columns = [
    {
        title: 'Product',
        links: [
            { label: 'Features', to: '/#features' },
            { label: 'Task Management', to: '/#features' },
            { label: 'Project Management', to: '/#features' },
            { label: 'Team Collaboration', to: '/#collaboration' },
            { label: 'Calendar', to: '/#calendar' },
            { label: 'Reports', to: '/#reporting' },
            { label: 'Notifications', to: '/#notifications' },
            { label: 'Pricing', to: '/pricing' },
        ],
    },
    {
        title: 'Solutions',
        links: [
            { label: 'Teams', to: '/#solutions' },
            { label: 'Project Managers', to: '/#solutions' },
            { label: 'Team Leaders', to: '/#solutions' },
            { label: 'Administrators', to: '/#solutions' },
        ],
    },
    {
        title: 'Company',
        links: [{ label: 'About' }, { label: 'Contact' }, { label: 'Careers' }, { label: 'Blog' }],
    },
    {
        title: 'Resources',
        id: 'resources',
        links: [{ label: 'Help Center' }, { label: 'Documentation' }, { label: 'Guides' }, { label: 'FAQ' }],
    },
    {
        title: 'Legal',
        links: [{ label: 'Privacy Policy' }, { label: 'Terms of Service' }, { label: 'Security', to: '/#security' }],
    },
];

const Footer = () => (
    <footer className="bg-[#0f2438] text-white pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:justify-between gap-12 mb-12">
                {/* Brand block: sized on its own, independent of the nav-column grid */}
                <Reveal className="max-w-xs">
                    <img src={logo} alt="TaskManage" className="h-9 w-auto mb-4 brightness-0 invert" />
                    <p className="text-sm font-medium text-white/80 mb-1">Plan • Track • Achieve</p>
                    <p className="text-sm text-gray-400">
                        A smarter way to organize tasks, projects, and teams.
                    </p>
                </Reveal>

                {/* Nav columns: 2 → 3 → 5 across breakpoints, one slot per column */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10 lg:gap-x-10">
                    {columns.map((col, i) => (
                        <Reveal key={col.title} delay={i * 70} id={col.id}>
                            <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
                            <ul className="space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <FooterLink to={link.to}>{link.label}</FooterLink>
                                    </li>
                                ))}
                            </ul>
                        </Reveal>
                    ))}
                </div>
            </div>

            <div className="border-t border-white/10 pt-6 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} TaskManage. All rights reserved.
            </div>
        </div>
    </footer>
);

export default Footer;
