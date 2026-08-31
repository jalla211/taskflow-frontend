import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useHashScroll from '../components/marketing/useHashScroll';

import Nav from '../components/marketing/Nav';
import PricingHero from '../components/marketing/PricingHero';
import PricingTiers from '../components/marketing/PricingTiers';
import PricingComparison from '../components/marketing/PricingComparison';
import PricingFaq from '../components/marketing/PricingFaq';
import FinalCta from '../components/marketing/FinalCta';
import Footer from '../components/marketing/Footer';

const Pricing = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [annual, setAnnual] = useState(true);
    useHashScroll();

    if (isAuthenticated) {
        navigate('/dashboard');
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            <Nav />
            <PricingHero annual={annual} onToggle={setAnnual} />
            <PricingTiers annual={annual} />
            <PricingComparison />
            <PricingFaq />
            <FinalCta />
            <Footer />
        </div>
    );
};

export default Pricing;
