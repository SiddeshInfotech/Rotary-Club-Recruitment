import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export default function VerifyResetOtp() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // We get the email passed from the Forgot Password page
    const email = location.state?.email; 

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Check if OTP matches in Backend
            const res = await api.post('/auth/verify-reset-otp', { email, otp });
            
            if (res.data.success) {
                // SUCCESS: Move to Reset Password and pass the email/otp along in memory
                navigate('/reset-password', { state: { email, otp } });
            }
        } catch (err) {
            // ERROR: Show the red message you requested
            setError(err.response?.data?.message || "OTP is not matched");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b1121] flex items-center justify-center p-6">
            <div className="w-full max-w-[440px] bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
                <Link to="/forgot-password" title="Back" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-bold">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Link>

                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/20">
                        <ShieldCheck className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <h2 className="text-3xl font-black text-white text-center mb-2 tracking-tight">Verify Code</h2>
                <p className="text-slate-400 text-center mb-8 font-medium">Enter the 6-digit code sent to <br/><span className="text-blue-400">{email}</span></p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] pl-1 text-center block w-full">Verification OTP</label>
                        <input 
                            type="text" 
                            maxLength="6"
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-5 text-center text-3xl tracking-[0.4em] text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-black placeholder:text-slate-800"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || otp.length < 6}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify & Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
}