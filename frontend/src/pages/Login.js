import { useState } from 'react';
import { ArrowLeft, Mail, Lock, CheckCircle2, AlertCircle, Briefcase, UserRound, Sparkles, Building2, Globe, FileText, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login({ initialMode = 'login' }) {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
    const [role, setRole] = useState('candidate'); // 'candidate' or 'recruiter' for signup
    const [notification, setNotification] = useState(null); // { type: 'success'|'error', title: '', message: '' }

    // Login Form State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Signup Form State
    const [signupForm, setSignupForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        skills: '',
        experience: '',
        resumeLink: '',
        company: '',
        website: '',
        hiringNeeds: '',
        password: '',
    });

    const handleSignupChange = (e) => {
        setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        
        // Basic password validation
        if (signupForm.password.length < 6) {
            setNotification({
                type: 'error',
                title: 'Registration Failed',
                message: 'Password must be at least 6 characters long.'
            });
            return;
        }

        const userData = {
            firstName: signupForm.firstName,
            lastName: signupForm.lastName,
            fullName: `${signupForm.firstName} ${signupForm.lastName}`,
            email: signupForm.email,
            phone: signupForm.phone,
            role: role,
            ...(role === 'candidate' && {
                skills: signupForm.skills,
                experience: signupForm.experience,
                resumeLink: signupForm.resumeLink,
            }),
            ...(role === 'recruiter' && {
                company: signupForm.company,
                website: signupForm.website,
                hiringNeeds: signupForm.hiringNeeds,
            }),
        };

        // Save registered user details to localStorage to mock backend registration database.
        // This is key because our login submit reads from `localStorage.getItem("eqhire_user")`!
        localStorage.setItem("eqhire_user", JSON.stringify(userData));

        // Prefill login email with the newly registered email
        setLoginEmail(signupForm.email);
        setLoginPassword(''); // clear password for safety

        // Clear signup form
        setSignupForm({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            skills: '',
            experience: '',
            resumeLink: '',
            company: '',
            website: '',
            hiringNeeds: '',
            password: '',
        });

        // Show success alert
        setNotification({
            type: 'success',
            title: 'Account Created Successfully!',
            message: 'Your account has been registered. Please enter your password to sign in.'
        });

        // Switch page mode to 'login'
        setMode('login');
    };

    const handleLogin = (e) => {
        e.preventDefault();

        // 1. Try to check mock registered user in localStorage
        const saved = localStorage.getItem("eqhire_user");
        if (saved) {
            const userData = JSON.parse(saved);
            if (userData.email.toLowerCase() === loginEmail.toLowerCase()) {
                login(userData);
                navigate(userData.role === 'recruiter' ? '/recruiter' : '/candidate');
                return;
            }
        }

        // 2. Fallback login (if not found in localStorage, simulate dynamic login)
        const names = loginEmail.split('@')[0].split('.');
        const firstName = names[0] ? names[0].charAt(0).toUpperCase() + names[0].slice(1) : 'User';
        const lastName = names[1] ? names[1].charAt(0).toUpperCase() + names[1].slice(1) : '';

        const fallbackUser = {
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`.trim(),
            email: loginEmail,
            role: 'candidate',
        };

        login(fallbackUser);
        navigate('/candidate');
    };

    return (
        <div className="h-screen overflow-hidden bg-white dark:bg-[#0b1121] flex w-full font-sans transition-colors duration-300">
            {/* Left Side: Brand Panel */}
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

            {/* Right Side: Form Panel */}
            <div className="w-full lg:w-[55%] xl:w-1/2 flex justify-center items-start pt-12 sm:pt-16 pb-12 p-6 sm:p-12 lg:p-16 overflow-y-auto">
                <div className="w-full max-w-[480px]">
                    
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-10">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>

                    {/* Notification Alert */}
                    {notification && (
                        <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
                            notification.type === 'success' 
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' 
                            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                        }`}>
                            {notification.type === 'success' ? (
                                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
                            ) : (
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                            )}
                            <div>
                                <h4 className="font-bold text-sm">{notification.title}</h4>
                                <p className="text-xs font-medium mt-1">{notification.message}</p>
                            </div>
                        </div>
                    )}

                    <div className="mb-10 text-center md:text-left">
                        <div className="lg:hidden bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg w-12 h-12 flex items-center justify-center font-bold text-lg tracking-tight shadow-md shadow-blue-500/20 mb-6 mx-auto md:mx-0">
                            EQ
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3 font-serif tracking-tight">
                            {mode === 'login' ? 'Welcome back' : 'Create Your Account'}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                            {mode === 'login' 
                                ? 'Please enter your details to sign in.' 
                                : 'Join a platform that connects talent, recruiters, and opportunities powered by AI.'
                            }
                        </p>
                    </div>

                    {/* Mode Toggle Tabs */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl mb-10 border border-slate-200 dark:border-slate-800">
                        <button 
                            onClick={() => {
                                setMode('login');
                                setNotification(null);
                            }}
                            className={`flex flex-1 justify-center items-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${mode === 'login' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-600/50' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            type="button"
                        >
                            Sign In
                        </button>
                        <button 
                            onClick={() => {
                                setMode('signup');
                                setNotification(null);
                            }}
                            className={`flex flex-1 justify-center items-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${mode === 'signup' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-600/50' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            type="button"
                        >
                            Create Account
                        </button>
                    </div>

                    {mode === 'login' ? (
                        /* Login Form */
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                                        placeholder="jane.doe@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input 
                                        type="password" 
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" 
                                        placeholder="••••••••" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input type="checkbox" className="peer sr-only" />
                                        <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none">
                                            <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">Remember me</span>
                                </label>
                                
                                <Link to="/forgot-password" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</Link>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 dark:bg-white dark:text-slate-900 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]">
                                    Sign In
                                </button>
                            </div>

                            <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
                                New user?{' '}
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setMode('signup');
                                        setNotification(null);
                                    }}
                                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                >
                                    Register
                                </button>
                            </p>
                        </form>
                    ) : (
                        /* Signup Form */
                        <form className="space-y-6" onSubmit={handleSignupSubmit}>
                            <div className="flex p-1 bg-slate-100 dark:bg-slate-800/30 rounded-xl mb-6 border border-slate-200/60 dark:border-slate-800/80">
                                <button 
                                    onClick={() => setRole('candidate')}
                                    className={`flex flex-1 justify-center items-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${role === 'candidate' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-600/50' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                    type="button"
                                >
                                    <UserRound className="w-3.5 h-3.5" /> Candidate
                                </button>
                                <button 
                                    onClick={() => setRole('recruiter')}
                                    className={`flex flex-1 justify-center items-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${role === 'recruiter' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-600/50' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                    type="button"
                                >
                                    <Briefcase className="w-3.5 h-3.5" /> Recruiter
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">First Name</label>
                                    <input type="text" name="firstName" value={signupForm.firstName} onChange={handleSignupChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" placeholder="E.g. Jane" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Last Name</label>
                                    <input type="text" name="lastName" value={signupForm.lastName} onChange={handleSignupChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" placeholder="E.g. Doe" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Email Address</label>
                                <input type="email" name="email" value={signupForm.email} onChange={handleSignupChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" placeholder="jane.doe@example.com" required />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Phone Number</label>
                                <input type="tel" name="phone" value={signupForm.phone} onChange={handleSignupChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" placeholder="+1 (555) 000-0000" />
                            </div>

                            {role === 'candidate' && (
                                <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-4">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">
                                            <FileText className="w-3.5 h-3.5" /> Skills
                                        </label>
                                        <input type="text" name="skills" value={signupForm.skills} onChange={handleSignupChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" placeholder="E.g. React, Node.js, UI/UX Design" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">
                                            <Briefcase className="w-3.5 h-3.5" /> Experience
                                        </label>
                                        <textarea rows={3} name="experience" value={signupForm.experience} onChange={handleSignupChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium resize-none" placeholder="Briefly describe your professional experience..." required></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">
                                            <Upload className="w-3.5 h-3.5" /> Resume / CV Link
                                        </label>
                                        <input type="url" name="resumeLink" value={signupForm.resumeLink} onChange={handleSignupChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" placeholder="https://linkedin.com/in/janedoe" />
                                    </div>
                                </div>
                            )}

                            {role === 'recruiter' && (
                                <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-4">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">
                                            <Building2 className="w-3.5 h-3.5" /> Company Name
                                        </label>
                                        <input type="text" name="company" value={signupForm.company} onChange={handleSignupChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" placeholder="E.g. Acme Corp" required />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">
                                                <Globe className="w-3.5 h-3.5" /> Website
                                            </label>
                                            <input type="url" name="website" value={signupForm.website} onChange={handleSignupChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" placeholder="https://acme.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Hiring Needs</label>
                                            <select name="hiringNeeds" value={signupForm.hiringNeeds} onChange={handleSignupChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium appearance-none">
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
                                <input type="password" name="password" value={signupForm.password} onChange={handleSignupChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium" placeholder="••••••••" required />
                            </div>

                            <div className="pt-6">
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]">
                                    Create Account
                                </button>
                            </div>

                            <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
                                Already have an account?{' '}
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setMode('login');
                                        setNotification(null);
                                    }}
                                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                >
                                    Log in
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
