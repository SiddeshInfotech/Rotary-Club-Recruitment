import { useState, useRef } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';

export default function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const handleChange = (index, value) => {
        // Only allow numbers
        if (value && isNaN(value)) return;
        
        const newOtp = [...otp];
        
        // Handle pasting multiple characters
        if (value.length > 1) {
            const pastedData = value.slice(0, 6 - index).split('');
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[index + i] = pastedData[i];
            }
            setOtp(newOtp);
            const focusIndex = Math.min(index + pastedData.length, 5);
            inputRefs.current[focusIndex]?.focus();
            return;
        }

        // Handle single character
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus to next field if value is entered
        if (value !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Move to previous input on backspace if current is empty
        if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            return setError("Please enter the full 6-digit OTP.");
        }
        if (!email) {
            return setError("Email not found. Please try registering again.");
        }

        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/verify-otp', { email, otp: otpString });
            if (res.data.success) {
                setSuccessMsg("Email verified successfully! Redirecting...");
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            return setError("Email not found. Please try registering again.");
        }
        setError('');
        setSuccessMsg('');
        setResendLoading(true);
        try {
            const res = await api.post('/auth/resend-otp', { email });
            if (res.data.success) {
                setSuccessMsg("A new OTP has been sent to your email.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to resend OTP.");
        } finally {
            setResendLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b1121] flex items-center justify-center p-6 transition-colors duration-300">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 max-w-[480px] w-full shadow-xl shadow-slate-200/50 dark:shadow-none text-center relative overflow-hidden">
                
                {/* Decorative background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-blue-100 dark:border-blue-800/50">
                        <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 font-serif tracking-tight">Verify Your Email</h1>
                    
                    <p className="text-slate-600 dark:text-slate-400 font-medium mb-6 leading-relaxed">
                        Enter the 6-digit OTP sent to your email address. 
                        <br/><span className="font-bold text-slate-800 dark:text-slate-200 mt-2 block">{email || "Unknown Email"}</span>
                    </p>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    {successMsg && (
                        <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-sm font-bold flex items-center gap-2 justify-center">
                            <CheckCircle2 className="w-4 h-4" /> {successMsg}
                        </div>
                    )}

                    {/* OTP Inputs */}
                    <div className="flex justify-between items-center gap-2 sm:gap-4 mb-10">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength={6} // Hack to allow pasting full block into one input
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm"
                            />
                        ))}
                    </div>
                    
                    <div className="space-y-4">
                        <button onClick={handleVerify} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 dark:bg-white dark:text-slate-900 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-60">
                            {loading ? 'Verifying...' : 'Verify OTP'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        <button onClick={handleResend} disabled={resendLoading} className="w-full bg-transparent border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-4 rounded-xl transition-all shadow-sm disabled:opacity-60">
                            {resendLoading ? 'Sending...' : 'Resend OTP'}
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
    );
}
