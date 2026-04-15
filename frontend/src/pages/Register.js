import { useState } from 'react';
import { ArrowLeft, Briefcase, UserRound, Sparkles, Building2, Globe, FileText, Upload, CheckCircle2, MapPin, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Register() {
    const [role, setRole] = useState('candidate');
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpEmail, setOtpEmail] = useState('');
    const [signupToken, setSignupToken] = useState(''); // NEW: Holds the temporary data briefcase
    const [successMessage, setSuccessMessage] = useState('');

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        skills: '',
        resumeLink: '',
        company: '',
        website: '',
        hiringNeeds: '',
        password: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const fullName = `${form.firstName} ${form.lastName}`.trim();
            
            // 1. Send registration data to backend
            const res = await api.post('/auth/register', {
                name: fullName,
                email: form.email,
                password: form.password,
                role: role,
                phone: form.phone,
                location: form.location,
                ...(role === 'candidate' && {
                    skills: form.skills,
                    resumeLink: form.resumeLink,
                }),
                ...(role === 'recruiter' && {
                    company: form.company,
                    website: form.website,
                    hiringNeeds: form.hiringNeeds,
                }),
            });

            // 2. If backend sends back a signupToken, save it and show OTP screen
            if (res.data.requiresOtp) {
                setOtpEmail(form.email);
                setSignupToken(res.data.signupToken); // SAVE THE TOKEN HERE
                setShowOtp(true);
                setSuccessMessage(res.data.message || 'Please check your email for the OTP.');
                return;
            }

            // Fallback for immediate success (if OTP is disabled)
            if (res.data.success) {
                const { user: userData, token } = res.data;
                login({ ...userData, fullName }, token);
                navigate(role === 'recruiter' ? '/recruiter' : '/candidate');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // 3. Send the OTP AND the signupToken back to the server
            // The server uses the token to "remember" who you are
            const res = await api.post('/auth/verify-otp', {
                signupToken: signupToken,
                otp: otp
            });

            if (res.data.success) {
                const { user: userData, token } = res.data;
                const fullName = `${form.firstName} ${form.lastName}`.trim();
                
                login({
                    ...userData,
                    fullName,
                }, token);

                navigate(role === 'recruiter' ? '/recruiter' : '/candidate');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP or session expired.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setSuccessMessage('');
        try {
            // Send email and name so backend can generate a new signupToken
            const fullName = `${form.firstName} ${form.lastName}`.trim();
            const res = await api.post('/auth/resend-otp', { 
                email: otpEmail,
                name: fullName,
                ...form // Pass form data again to keep the token updated
            });
            
            if (res.data.success) {
                setSignupToken(res.data.signupToken); // Update with new token
                setSuccessMessage('A new verification code has been sent to your email.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code.');
        }
    };

   return (
        <div className="min-h-screen bg-white dark:bg-[#0b1121] flex w-full font-sans transition-colors duration-300">
            
            <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative flex-col p-12 overflow-hidden bg-slate-900 border-r border-slate-800">
                <div className="absolute inset-0 select-none">
                    <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7_LbafdVX86dJ5dyes_3zy_9aw8f89Ium0H6UTNFeUgtYkGAKVx5OtrwhWqFfOvd13PhWfdnJwyRUWJvATfcWTvRFx7rxLEr4YyMrhpnZ2E5Z8FjvNemDVby2uY2FnAAE3PNctFxeEp-BQ52ueqEKRDypykiw_CLywKzMUvvJYx29yCZrGHPB51oS8RqTOram8yoXVuF0r8jfqED_f4MSH0HUHnoj6-gqjCTD1gI_cAtRH2akZDz3U00pL9URsyxf8Vgt7o4IWf4" 
                        alt="Background" 
                        className="w-full h-full object-cover opacity-20 mix-blend-overlay grayscale-[30%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/20"></div>
                </div>

                <div className="relative z-10 mb-20">
                    <Link to="/" className="flex items-center gap-2 group cursor-pointer inline-flex">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg w-10 h-10 flex items-center justify-center font-bold text-base tracking-tight shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                            EQ
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight">
                            EQ HIRE
                        </span>
                    </Link>
                </div>

                <div className="relative z-10 flex flex-col justify-center flex-1 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md w-max">
                        <Sparkles className="w-4 h-4" /> The AI Career Platform
                    </div>
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.15] mb-6 font-serif tracking-tight">
                        Discover Your <br/>Career Potential.
                    </h1>
                    <p className="text-slate-300 text-lg lg:text-xl font-medium leading-relaxed max-w-md mb-12">
                        Connect with top recruiters and find elite roles that match your unique cognitive traits and technical skills.
                    </p>
                    
                    <div className="space-y-5">
                        <div className="flex items-center gap-4 text-slate-200">
                            <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
                            <span className="font-bold tracking-wide">AI-based Job Matching</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-200">
                            <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
                            <span className="font-bold tracking-wide">Professional Networking</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-200">
                            <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
                            <span className="font-bold tracking-wide">Skill-based Recommendations</span>
                        </div>
                    </div>
                </div>
                
                <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none z-0"></div>
            </div>

            <div className="w-full lg:w-[55%] xl:w-1/2 flex justify-center items-start pt-12 sm:pt-16 pb-12 p-6 sm:p-12 lg:p-16 overflow-y-auto">
                <div className="w-full max-w-[480px]">
                    
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-10">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>

                    <div className="mb-10">
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3 font-serif tracking-tight">Create Your EQ HIRE Account</h2>
                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">Join a platform that connects talent, recruiters, and opportunities powered by AI.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-bold">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-sm font-bold">
                            {successMessage}
                        </div>
                    )}

                    {!showOtp ? (
                        <>
                            <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl mb-10 border border-slate-200 dark:border-slate-800">
                        <button 
                            onClick={() => setRole('candidate')}
                            className={`flex flex-1 justify-center items-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${role === 'candidate' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-600/50' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            type="button"
                        >
                            <UserRound className="w-4 h-4" /> Candidate
                        </button>
                        <button 
                            onClick={() => setRole('recruiter')}
                            className={`flex flex-1 justify-center items-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${role === 'recruiter' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-600/50' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            type="button"
                        >
                            <Briefcase className="w-4 h-4" /> Recruiter
                        </button>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">First Name</label>
                                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" placeholder="E.g. Jane" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Last Name</label>
                                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" placeholder="E.g. Doe" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Email Address</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" placeholder="jane.doe@example.com" required />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Phone Number</label>
                                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" placeholder="+1 (555) 000-0000" />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">
                                    <MapPin className="w-3.5 h-3.5" /> Location
                                </label>
                                <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" placeholder="City, Country (e.g. London, UK)" />
                            </div>
                        </div>

                        {role === 'candidate' && (
                            <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">
                                        <FileText className="w-3.5 h-3.5" /> Skills & Experience
                                    </label>
                                    <textarea rows={3} name="skills" value={form.skills} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium resize-none" placeholder="Briefly describe your expertise (e.g., UI/UX Design, 5 years exp...)" required></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">
                                        <Upload className="w-3.5 h-3.5" /> Resume / CV Link
                                    </label>
                                    <input type="url" name="resumeLink" value={form.resumeLink} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" placeholder="https://linkedin.com/in/janedoe" />
                                </div>
                            </div>
                        )}

                        {role === 'recruiter' && (
                            <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">
                                        <Building2 className="w-3.5 h-3.5" /> Company Name
                                    </label>
                                    <input type="text" name="company" value={form.company} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" placeholder="E.g. Acme Corp" required />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">
                                            <Globe className="w-3.5 h-3.5" /> Website
                                        </label>
                                        <input type="url" name="website" value={form.website} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" placeholder="https://acme.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Hiring Needs</label>
                                        <select name="hiringNeeds" value={form.hiringNeeds} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium appearance-none">
                                            <option value="" disabled>Select size...</option>
                                            <option value="1-10">1-10 roles</option>
                                            <option value="11-50">11-50 roles</option>
                                            <option value="50+">50+ roles</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-4">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password" 
                                    value={form.password} 
                                    onChange={handleChange} 
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-12 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" 
                                    placeholder="••••••••" 
                                    required 
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-60"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                    </>
                    ) : (
                        <form className="space-y-6" onSubmit={handleVerifyOtp}>
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Verify Your Email</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">We've sent a 6-digit code to <strong className="text-blue-600 dark:text-blue-400">{otpEmail}</strong>.</p>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Verification Code</label>
                                <input 
                                    type="text" 
                                    value={otp} 
                                    onChange={(e) => setOtp(e.target.value)} 
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] text-slate-900 dark:text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-bold" 
                                    placeholder="000000" 
                                    maxLength={6}
                                    required 
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length < 6}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-60 mt-6"
                            >
                                {loading ? 'Verifying...' : 'Verify Email'}
                            </button>

                            <div className="pt-4 text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline"
                                >
                                    Didn't receive the code? Resend
                                </button>
                            </div>
                        </form>
                    )}

                    {!showOtp && (
                        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
                            Already have an account? <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">Log in</Link>
                        </p>
                    )}

                </div>
            </div>
        </div>
    );
}
