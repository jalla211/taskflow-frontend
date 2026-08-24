import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('login');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, verifyOtp, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // If already authenticated, redirect to dashboard
    // if (isAuthenticated) {
    //     navigate('/dashboard');
    //     return null;
    // }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            setStep('otp');
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Login failed');
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await verifyOtp(email, otp);
            setLoading(false);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid OTP');
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            {/* Floating Shapes */}
            <div className="floating-shape"></div>
            <div className="floating-shape"></div>
            <div className="floating-shape"></div>
            <div className="floating-shape"></div>
            <div className="floating-shape"></div>
            <div className="floating-shape"></div>

            {/* Clouds */}
            <div className="cloud"></div>
            <div className="cloud"></div>
            <div className="cloud"></div>

            {/* Glow behind card */}
            <div className="login-glow"></div>

            {/* Login Card – same as before, just wrapped in .login-card */}
            <div className="login-card">
                <h1 className="text-2xl font-bold text-center text-[#1E3A5F] mb-6">TaskFlow</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>
                )}

                {step === 'login' ? (
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1E3A5F] text-white py-2 rounded-md hover:bg-[#2E5A88] transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <p className="text-gray-600 text-sm mb-4">Enter the OTP sent to your email.</p>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">OTP Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1E3A5F] text-white py-2 rounded-md hover:bg-[#2E5A88] transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep('login')}
                            className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700"
                        >
                            Back to login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;