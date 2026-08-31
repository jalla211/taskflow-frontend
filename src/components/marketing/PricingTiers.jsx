import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import Reveal from './Reveal';

const tiers = [
    {
        name: 'Free',
        tagline: 'For small teams getting started',
        monthly: 0,
        annual: 0,
        cta: 'Start Free',
        features: [
            'Up to 5 team members',
            'Up to 3 projects',
            'Unlimited tasks',
            'Task status & priority tracking',
            'Calendar view',
            'Email notifications',
        ],
    },
    {
        name: 'Team',
        tagline: 'For growing teams that need visibility',
        monthly: 12,
        annual: 9,
        popular: true,
        cta: 'Start Free Trial',
        features: [
            'Everything in Free',
            'Unlimited projects',
            'Team workload & progress dashboards',
            'Reports & analytics',
            'Comments, mentions & attachments',
            'Custom notification preferences',
            'Priority support',
        ],
    },
    {
        name: 'Enterprise',
        tagline: 'For organizations that need control at scale',
        monthly: null,
        annual: null,
        cta: 'Contact Sales',
        features: [
            'Everything in Team',
            'Role-based permissions (Admin, PM, Team Leader, Member)',
            'Full audit logs & activity history',
            'Custom statuses, priorities & tags',
            'SSO & advanced security controls',
            'Dedicated onboarding & support',
        ],
    },
];

const PricingTiers = ({ annual }) => (
    <section className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {tiers.map((tier, i) => {
                    const price = annual ? tier.annual : tier.monthly;
                    return (
                        <Reveal
                            key={tier.name}
                            delay={i * 110}
                            className={`relative rounded-2xl p-8 transition-shadow transition-transform duration-300 hover:-translate-y-1 ${
                                tier.popular
                                    ? 'bg-[#1E3A5F] text-white shadow-2xl lg:scale-105'
                                    : 'bg-white border border-gray-100 shadow-sm hover:shadow-lg'
                            }`}
                        >
                            {tier.popular && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-[#4A90D9] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                                    <Sparkles className="w-3 h-3" /> Most Popular
                                </span>
                            )}

                            <h3 className={`font-display text-xl font-bold ${tier.popular ? 'text-white' : 'text-[#1E3A5F]'}`}>
                                {tier.name}
                            </h3>
                            <p className={`text-sm mt-1 mb-6 ${tier.popular ? 'text-white/70' : 'text-gray-500'}`}>
                                {tier.tagline}
                            </p>

                            <div className="mb-6">
                                {price === null ? (
                                    <span className="font-display text-4xl font-bold">Custom</span>
                                ) : (
                                    <>
                                        <span className="font-display text-4xl font-bold">${price}</span>
                                        <span className={tier.popular ? 'text-white/70' : 'text-gray-500'}>
                                            {price === 0 ? ' forever' : ' / user / month'}
                                        </span>
                                    </>
                                )}
                                {annual && price !== null && price > 0 && (
                                    <div className={`text-xs mt-1 ${tier.popular ? 'text-white/60' : 'text-gray-400'}`}>
                                        billed annually
                                    </div>
                                )}
                            </div>

                            <Link
                                to="/login"
                                className={`block w-full text-center font-semibold px-4 py-2.5 rounded-md transition-colors duration-200 mb-8 ${
                                    tier.popular
                                        ? 'bg-white text-[#1E3A5F] hover:bg-gray-100'
                                        : 'bg-[#1E3A5F] text-white hover:bg-[#2E5A88]'
                                }`}
                            >
                                {tier.cta}
                            </Link>

                            <ul className="space-y-3">
                                {tier.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2 text-sm">
                                        <Check
                                            className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                                                tier.popular ? 'text-white' : 'text-[#4A90D9]'
                                            }`}
                                        />
                                        <span className={tier.popular ? 'text-white/90' : 'text-gray-700'}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </Reveal>
                    );
                })}
            </div>
            <p className="text-center text-sm text-gray-400 mt-10">
                Prices shown are illustrative. No credit card required to get started.
            </p>
        </div>
    </section>
);

export default PricingTiers;
