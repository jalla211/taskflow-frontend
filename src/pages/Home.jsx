import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useHashScroll from '../components/marketing/useHashScroll';

import Nav from '../components/marketing/Nav';
import Hero from '../components/marketing/Hero';
import SocialProof from '../components/marketing/SocialProof';
import ProblemSection from '../components/marketing/ProblemSection';
import ValueProposition from '../components/marketing/ValueProposition';
import FeaturesShowcase from '../components/marketing/FeaturesShowcase';
import WorkflowSection from '../components/marketing/WorkflowSection';
import CollaborationSection from '../components/marketing/CollaborationSection';
import NotificationsSection from '../components/marketing/NotificationsSection';
import CalendarSection from '../components/marketing/CalendarSection';
import SearchSection from '../components/marketing/SearchSection';
import DashboardPreviewSection from '../components/marketing/DashboardPreviewSection';
import ReportingSection from '../components/marketing/ReportingSection';
import RolesSection from '../components/marketing/RolesSection';
import WhySection from '../components/marketing/WhySection';
import HowItWorksSection from '../components/marketing/HowItWorksSection';
import SecuritySection from '../components/marketing/SecuritySection';
import SupportSection from '../components/marketing/SupportSection';
import FinalCta from '../components/marketing/FinalCta';
import Footer from '../components/marketing/Footer';

const Home = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    useHashScroll();

    if (isAuthenticated) {
        navigate('/dashboard');
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            <Nav />
            <Hero />
            <SocialProof />
            <ProblemSection />
            <ValueProposition />
            <FeaturesShowcase />
            <WorkflowSection />
            <CollaborationSection />
            <NotificationsSection />
            <CalendarSection />
            <SearchSection />
            <DashboardPreviewSection />
            <ReportingSection />
            <RolesSection />
            <WhySection />
            <HowItWorksSection />
            <SecuritySection />
            <SupportSection />
            <FinalCta />
            <Footer />
        </div>
    );
};

export default Home;
