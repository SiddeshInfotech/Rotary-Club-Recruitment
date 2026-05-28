import { useState, useEffect } from "react";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import StatBlock from "../../components/profile/StatBlock";
import JobListingRow from "../../components/profile/JobListingRow";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import {
    MapPin, CheckCircle, Users, Building2,
    Globe, Mail, ChevronRight, Edit3, Briefcase,
    X, Save, Eye, EyeOff, Key
} from "lucide-react";

export default function MyProfile() {
    const { user, updateUser } = useAuth();
    
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [editSuccess, setEditSuccess] = useState("");
    const [editError, setEditError] = useState("");
    
    const [profileStats, setProfileStats] = useState(null);
    const [openJobs, setOpenJobs] = useState([]);
    
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, jobsRes] = await Promise.all([
                    api.get("/dashboard/stats"),
                    api.get("/dashboard/jobs")
                ]);
                
                if (statsRes.data.success) {
                    setProfileStats(statsRes.data.data);
                }
                if (jobsRes.data.success) {
                    setOpenJobs(jobsRes.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch dynamic profile data:", error);
            }
        };
        fetchDashboardData();
    }, []);

    const handleEditSave = async () => {
        setEditError("");
        setEditSuccess("");
        try {
            if (updateUser) {
                await updateUser({
                    name: editForm.name,
                    currentTitle: editForm.currentTitle,
                    location: editForm.location,
                    email: editForm.email,
                    phone: editForm.phone,
                    company: editForm.company,
                    website: editForm.website,
                });
            }
            setEditSuccess("Profile updated successfully!");
            setTimeout(() => {
                setIsEditing(false);
                setEditSuccess("");
            }, 1200);
        } catch (error) {
            setEditError("Failed to update profile");
        }
    };
    
    const RECRUITER = {
        name: user?.fullName || user?.name || "Recruiter",
        email: user?.email || "",
        title: user?.currentTitle || user?.role || "Recruiter",
        company: user?.company || "Independent Recruiter",
        location: user?.location || "Not specified",
        website: user?.website || "Not provided",
        verified: user?.isVerified ?? true,
        memberSince: user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear(),
    };

    return (
        <RecruiterLayout>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10 mt-2">
                <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1">
                        YOUR RECRUITER PROFILE
                    </p>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                        {RECRUITER.name}
                    </h1>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
                        {RECRUITER.title} · {RECRUITER.company}
                    </p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                        {RECRUITER.verified && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                Verified Recruiter
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <MapPin className="w-3 h-3" />
                            {RECRUITER.location}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <Users className="w-3 h-3" />
                            Member since {RECRUITER.memberSince}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">
                <div className="flex flex-col gap-8">
                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-8 shadow-sm">
                        <p className="text-[15px] uppercase tracking-widest font-bold text-slate-800 dark:text-slate-200 mb-4">
                            ABOUT
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                            <StatBlock label="Shortlisted" value={profileStats?.shortlisted || 0} />
                            <StatBlock label="Avg EQ Match" value={`${profileStats?.avgEqMatch || 0}%`} />
                            <StatBlock label="Total Applications" value={profileStats?.totalApplications || 0} />
                            <StatBlock label="Active Roles" value={profileStats?.activeJobs || 0} />
                        </div>
                    </div>

                    {/*<div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-8 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1">
                            EQ HIRING PRIORITIES
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                            Traits you value most in candidates
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex items-center justify-center h-[260px]">
                                <EQRadarChart scores={EQ_FOCUS} />
                            </div>
                            <div className="flex flex-col justify-center gap-3">
                                {Object.entries(EQ_FOCUS).map(([trait, score]) => (
                                    <TraitBar key={trait} trait={trait} score={score} />
                                ))}
                            </div>
                        </div>
                    </div> */}

                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">
                                Open Jobs
                            </p>
                            <Link to="/recruiter/jobs" className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                View All <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            {openJobs.length > 0 ? (
                                openJobs.slice(0, 4).map((job) => (
                                    <JobListingRow key={job._id} {...job} />
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 italic">No active jobs posted yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">

                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-5">
                            PERSONAL IDENTITY
                        </p>

                        <div className="flex flex-col gap-4">
                            {[
                                { label: "Legal Name",    value: RECRUITER.name, icon: <Edit3 className="w-3 h-3" /> },
                                { label: "Primary Email", value: RECRUITER.email, icon: <Mail className="w-3 h-3" /> },
                                { label: "Current Role",  value: `${RECRUITER.title} at ${RECRUITER.company}`, icon: <Briefcase className="w-3 h-3" /> },
                                { label: "Website",       value: RECRUITER.website, icon: <Globe className="w-3 h-3" /> },
                            ].map(({ label, value, icon }) => (
                                <div key={label}>
                                    <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5">
                                        {icon} {label}
                                    </p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => {
                                setEditError("");
                                setEditSuccess("");
                                setEditForm({
                                    name: RECRUITER.name,
                                    currentTitle: RECRUITER.title,
                                    location: RECRUITER.location,
                                    email: RECRUITER.email,
                                    phone: user?.phone || "",
                                    company: RECRUITER.company || "",
                                    website: RECRUITER.website || "",
                                    currentPassword: "",
                                    newPassword: "",
                                });
                                setShowCurrentPw(false);
                                setShowNewPw(false);
                                setIsEditing(true);
                            }}
                            className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit Profile Details
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">Edit Profile</h3>
                            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 flex flex-col gap-5 overflow-y-auto flex-1">
                            {/* Error / Success banners */}
                            {editError && (
                                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-xs font-bold">
                                    <X className="w-4 h-4 flex-shrink-0" /> {editError}
                                </div>
                            )}
                            {editSuccess && (
                                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                    <CheckCircle className="w-4 h-4 flex-shrink-0" /> {editSuccess}
                                </div>
                            )}

                            {/* ── Section: Personal Info ── */}
                            <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 -mb-2">
                                <Edit3 className="w-3 h-3" /> Personal Information
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Display Name</label>
                                    <input 
                                        type="text" 
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Current Role / Title</label>
                                    <input 
                                        type="text" 
                                        value={editForm.currentTitle}
                                        onChange={(e) => setEditForm({...editForm, currentTitle: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Location</label>
                                <input 
                                    type="text" 
                                    value={editForm.location}
                                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                />
                            </div>

                            {/* ── Section: Contact & Account ── */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                                <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-4">
                                    <Mail className="w-3 h-3" /> Contact & Account
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            value={editForm.phone}
                                            placeholder="e.g. +91 98765 43210"
                                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ── Section: Company Details ── */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                                <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-4">
                                    <Building2 className="w-3 h-3" /> Company Details
                                </p>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">
                                        Company Name
                                    </label>
                                    <input 
                                        type="text" 
                                        value={editForm.company}
                                        placeholder="e.g. Acme Corp"
                                        onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">
                                        Company Website
                                    </label>
                                    <input 
                                        type="url" 
                                        value={editForm.website}
                                        placeholder="e.g. nexcore.ai"
                                        onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* ── Section: Change Password ── */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                                <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-1">
                                    <Key className="w-3 h-3" /> Change Password
                                </p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-600 mb-4">Leave blank to keep your current password.</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Current Password</label>
                                        <div className="relative">
                                            <input 
                                                type={showCurrentPw ? "text" : "password"} 
                                                value={editForm.currentPassword}
                                                placeholder="••••••••"
                                                onChange={(e) => setEditForm({...editForm, currentPassword: e.target.value})}
                                                className="w-full px-4 py-3 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                            />
                                            <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                                {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">New Password</label>
                                        <div className="relative">
                                            <input 
                                                type={showNewPw ? "text" : "password"} 
                                                value={editForm.newPassword}
                                                placeholder="Min 6 characters"
                                                onChange={(e) => setEditForm({...editForm, newPassword: e.target.value})}
                                                className="w-full px-4 py-3 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                            />
                                            <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                                {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 flex-shrink-0">
                            <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleEditSave} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm">
                                <Save className="w-4 h-4" /> Save Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </RecruiterLayout>
    );
}
