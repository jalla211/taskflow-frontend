import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import logo from '../../assets/logo.png';
import logoWordmark from '../../assets/logo-wordmark.png';

const highlights = [
    'Role-based dashboards for every team',
    'Real-time notifications & activity history',
    'Calendar, reports, and audit trails built in',
];

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        navigate('/dashboard');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            setLoading(false);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Brand panel — hidden on small screens */}
            <div
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
                style={{ background: 'linear-gradient(135deg, #0b3b5c 0%, #2b7a9e 40%, #6db3d9 70%, #b5dffa 100%)' }}
            >
                <div className="floating-shape" style={{ width: 220, height: 220, top: '8%', left: '10%', animationDelay: '0s', background: 'rgba(255,255,255,0.07)' }} />
                <div className="floating-shape" style={{ width: 130, height: 130, bottom: '15%', right: '8%', animationDelay: '2s', background: 'rgba(255,255,255,0.11)' }} />
                <div className="floating-shape" style={{ width: 90, height: 90, top: '55%', left: '55%', animationDelay: '1s', background: 'rgba(255,255,255,0.13)' }} />

                <Link to="/" className="relative z-10">
                    <img src={logoWordmark} alt="TaskManage" className="h-8 w-auto brightness-0 invert" />
                </Link>

                <div className="relative z-10">
                    <h2 className="font-display text-4xl font-bold text-white leading-tight mb-5">
                        Plan work. Track progress.
                        <br />
                        Get things done.
                    </h2>
                    <p className="text-white/80 text-lg mb-8 max-w-md">
                        TaskManage brings your tasks, projects, teams, deadlines, and conversations
                        into one simple workspace.
                    </p>
                    <ul className="space-y-3">
                        {highlights.map((h) => (
                            <li key={h} className="flex items-start gap-3 text-white/90">
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-white" />
                                <span>{h}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative z-10 text-sm text-white/60">
                    &copy; {new Date().getFullYear()} TaskManage. All rights reserved.
                </p>
            </div>

            {/* Form panel */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-12">
                <div className="w-full max-w-sm">
                    <Link to="/" className="lg:hidden flex justify-center mb-8">
                        <img src={logo} alt="TaskManage" className="h-12 w-auto" />
                    </Link>

                    <h1 className="font-display text-2xl font-bold text-[#1E3A5F] mb-1">Welcome back</h1>
                    <p className="text-gray-500 mb-8">Sign in to your TaskManage workspace.</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent transition-shadow"
                                placeholder="you@company.com"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent transition-shadow"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1E3A5F] text-white py-2.5 rounded-md font-semibold hover:bg-[#2E5A88] hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:hover:shadow-none"
                        >
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-8 text-sm text-center text-gray-500">
                        Need an account? Contact your workspace administrator.
                    </p>
                    <Link
                        to="/"
                        className="mt-6 flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-[#1E3A5F] transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
