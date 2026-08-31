import React from 'react';
import { Check, Minus } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const groups = [
    {
        title: 'Core',
        rows: [
            { label: 'Team members', free: 'Up to 5', team: 'Unlimited', enterprise: 'Unlimited' },
            { label: 'Projects', free: 'Up to 3', team: 'Unlimited', enterprise: 'Unlimited' },
            { label: 'Tasks', free: true, team: true, enterprise: true },
            { label: 'Calendar view', free: true, team: true, enterprise: true },
        ],
    },
    {
        title: 'Collaboration',
        rows: [
            { label: 'Comments & mentions', free: false, team: true, enterprise: true },
            { label: 'Attachments', free: false, team: true, enterprise: true },
            { label: 'Notification preferences', free: 'Email only', team: true, enterprise: true },
        ],
    },
    {
        title: 'Reporting',
        rows: [
            { label: 'Team workload dashboard', free: false, team: true, enterprise: true },
            { label: 'Reports & analytics', free: false, team: true, enterprise: true },
        ],
    },
    {
        title: 'Administration',
        rows: [
            { label: 'Role-based permissions', free: false, team: false, enterprise: true },
            { label: 'Audit logs & activity history', free: false, team: false, enterprise: true },
            { label: 'Custom statuses, priorities & tags', free: false, team: false, enterprise: true },
            { label: 'SSO & advanced security', free: false, team: false, enterprise: true },
        ],
    },
];

const Cell = ({ value }) => {
    if (value === true) return <Check className="w-4 h-4 text-[#4A90D9] mx-auto" />;
    if (value === false) return <Minus className="w-4 h-4 text-gray-300 mx-auto" />;
    return <span className="text-sm text-gray-700">{value}</span>;
};

const PricingComparison = () => (
    <section className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <SectionHeading title="Compare plans in detail" />
            <Reveal className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[560px]">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-4 font-medium text-gray-500">Feature</th>
                                <th className="px-6 py-4 font-display font-bold text-[#1E3A5F]">Free</th>
                                <th className="px-6 py-4 font-display font-bold text-[#1E3A5F]">Team</th>
                                <th className="px-6 py-4 font-display font-bold text-[#1E3A5F]">Enterprise</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.map((group) => (
                                <React.Fragment key={group.title}>
                                    <tr className="bg-gray-50">
                                        <td colSpan={4} className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            {group.title}
                                        </td>
                                    </tr>
                                    {group.rows.map((row) => (
                                        <tr key={row.label} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                                            <td className="px-6 py-3 text-gray-700">{row.label}</td>
                                            <td className="px-6 py-3 text-center">
                                                <Cell value={row.free} />
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <Cell value={row.team} />
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <Cell value={row.enterprise} />
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Reveal>
        </div>
    </section>
);

export default PricingComparison;
