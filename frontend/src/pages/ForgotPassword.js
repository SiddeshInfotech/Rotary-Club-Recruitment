import { useState } from 'react';
import { ArrowLeft, Mail, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import api from '../services/api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize navigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Send the email to the backend to generate the 6-digit OTP
            // We use the 'email' state directly here
            const res = await api.post('/auth/forgot-password', { email: email });

            if (res.data.success) {
                // 2. Redirect to the centered OTP verification page 
                // We pass the email in 'state' so the next page knows who to verify
                navigate('/verify-reset-otp', { state: { email: email } });
            }
        } catch (err) {
            setError(err.response?.data?.message || "User not found or something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b1121] flex items-center justify-center p-6 transition-colors duration-300 relative overflow-hidden">
            
            {/* Background Decoration */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 max-w-[480px] w-full shadow-xl shadow-slate-200/50 dark:shadow-none relative z-10">
                
                <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-10">
                    <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>

                <div className="mb-10 text-center md:text-left">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg w-12 h-12 flex items-center justify-center font-bold text-lg tracking-tight shadow-md shadow-blue-500/20 mb-6 mx-auto md:mx-0">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3 font-serif tracking-tight">Forgot Password</h1>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Enter your registered email to receive an OTP.</p>
                </div>

                {/* Display Error Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-bold">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" 
                                placeholder="jane.doe@example.com" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 dark:bg-white dark:text-slate-900 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-60"
                        >
                            {loading ? 'Generating OTP...' : 'Generate OTP'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}