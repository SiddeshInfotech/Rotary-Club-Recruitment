import React, { useState, useEffect } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { User, Shield, Sliders, Bell, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function CandidateSettings() {
    const { user, login } = useAuth();
    const [activeTab, setActiveTab] = useState("Account Basics");
    const [isDarkMode, setIsDarkMode] = useState(false);

    // --- Account Basics State ---
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [accountLoading, setAccountLoading] = useState(false);
    const [accountMsg, setAccountMsg] = useState({ type: '', text: '' });

    // --- Security State ---
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [securityLoading, setSecurityLoading] = useState(false);
    const [securityMsg, setSecurityMsg] = useState({ type: '', text: '' });

    // --- Preferences State ---
    const [isPublicProfile, setIsPublicProfile] = useState(true);

    // --- Notifications State ---
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [inAppNotifications, setInAppNotifications] = useState(true);

    // --- Load user data from context ---
    useEffect(() => {
        if (user) {
            const nameParts = (user.name || '').split(' ');
            setFirstName(nameParts[0] || '');
            setLastName(nameParts.slice(1).join(' ') || '');
            setEmail(user.email || '');
            // Load persisted preferences
            setEmailNotifications(user.emailNotifications !== false);
            setInAppNotifications(user.inAppNotifications !== false);
            setIsPublicProfile(user.isPublicProfile !== false);
        }
    }, [user]);

    // --- Dark mode init ---
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => {
            const newMode = !prev;
            if (newMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
            return newMode;
        });
    };

    // --- Save Account Basics ---
    const handleSaveAccount = async () => {
        setAccountMsg({ type: '', text: '' });
        setAccountLoading(true);
        try {
            const fullName = `${firstName} ${lastName}`.trim();
            const payload = { name: fullName };
            // Only send email if it changed
            if (email !== user.email) {
                payload.email = email;
            }
            const res = await api.put('/auth/me', payload);
            if (res.data.success) {
                // Update context so the rest of the app reflects the changes
                login({ ...user, ...res.data.data }, true);
                setAccountMsg({ type: 'success', text: 'Account updated successfully!' });
            }
        } catch (err) {
            setAccountMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update account.' });
        } finally {
            setAccountLoading(false);
        }
    };

    // --- Save a single preference toggle ---
    const savePreference = async (field, value) => {
        try {
            const res = await api.put('/auth/me', { [field]: value });
            if (res.data.success) {
                login({ ...user, ...res.data.data }, true);
            }
        } catch (err) {
            console.error('Failed to save preference:', err);
        }
    };

    const togglePublicProfile = () => {
        const newVal = !isPublicProfile;
        setIsPublicProfile(newVal);
        savePreference('isPublicProfile', newVal);
    };

    const toggleEmailNotifications = () => {
        const newVal = !emailNotifications;
        setEmailNotifications(newVal);
        savePreference('emailNotifications', newVal);
    };

    const toggleInAppNotifications = () => {
        const newVal = !inAppNotifications;
        setInAppNotifications(newVal);
        savePreference('inAppNotifications', newVal);
    };

    // --- Update Password ---
    const handleUpdatePassword = async () => {
        setSecurityMsg({ type: '', text: '' });
        if (!currentPassword || !newPassword) {
            return setSecurityMsg({ type: 'error', text: 'Both fields are required.' });
        }
        if (newPassword.length < 6) {
            return setSecurityMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
        }
        setSecurityLoading(true);
        try {
            const res = await api.put('/auth/me', { currentPassword, newPassword });
            if (res.data.success) {
                setSecurityMsg({ type: 'success', text: 'Password updated successfully!' });
                setCurrentPassword('');
                setNewPassword('');
            }
        } catch (err) {
            setSecurityMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password.' });
        } finally {
            setSecurityLoading(false);
        }
    };

    const tabs = [
        { icon: User, label: "Account Basics" },
        { icon: Shield, label: "Security" },
        { icon: Sliders, label: "Preferences" },
        { icon: Bell, label: "Notifications" }
    ];

    const displayName = user?.name || 'Candidate';
    const avatarName = encodeURIComponent(displayName);

    return (
        <CandidateLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">Settings</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account settings and preferences.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 shrink-0 space-y-1">
                        {tabs.map((item, i) => (
                            <button 
                                key={i} 
                                onClick={() => setActiveTab(item.label)}
                                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-bold rounded-xl transition-colors ${activeTab === item.label ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{activeTab}</h2>
                        
                        {activeTab === "Account Basics" && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                                        <img src={`https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff`} className="w-full h-full object-cover" alt="Profile" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{displayName}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                                    </div>
                                </div>

                                {accountMsg.text && (
                                    <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-bold ${accountMsg.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'}`}>
                                        {accountMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                        {accountMsg.text}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">First Name</label>
                                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Last Name</label>
                                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium dark:text-white" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium dark:text-white" />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button onClick={handleSaveAccount} disabled={accountLoading} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition text-sm shadow-sm disabled:opacity-60">
                                        {accountLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "Security" && (
                            <div className="space-y-6">
                                {securityMsg.text && (
                                    <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-bold ${securityMsg.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'}`}>
                                        {securityMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                        {securityMsg.text}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Current Password</label>
                                    <div className="relative">
                                        <input type={showCurrentPassword ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium dark:text-white" />
                                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">New Password</label>
                                    <div className="relative">
                                        <input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium dark:text-white" />
                                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button onClick={handleUpdatePassword} disabled={securityLoading} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition text-sm shadow-sm disabled:opacity-60">
                                        {securityLoading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "Preferences" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Toggle dark mode interface.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={isDarkMode} onChange={toggleDarkMode} />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Public Profile</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Allow recruiters to find you in search.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={isPublicProfile} onChange={togglePublicProfile} />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        )}

                        {activeTab === "Notifications" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Email Notifications</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Receive alerts via email.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={emailNotifications} onChange={toggleEmailNotifications} />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">In-App Notifications</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Show alerts inside the platform.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={inAppNotifications} onChange={toggleInAppNotifications} />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CandidateLayout>
    );
}
