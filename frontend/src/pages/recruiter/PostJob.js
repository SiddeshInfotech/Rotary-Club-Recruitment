import { useState, useEffect } from "react"; // Added useEffect
import RecruiterLayout from "../../layouts/RecruiterLayout";
import { Plus, Briefcase, MapPin, AlignLeft, Tags, ArrowRight, CheckCircle2, GraduationCap, DollarSign, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function PostJob() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [recruiterInfo, setRecruiterInfo] = useState(null); // Added for dynamic logic

    const [form, setForm] = useState({
        title: '',
        locationType: 'On-site',
        location: '',
        type: 'Full-time',
        experienceLevel: 'Entry Level',
        shift: 'Day',
        minSalary: '',
        maxSalary: '',
        qualification: 'Graduate',
        allowBacklogs: false,
        description: '',
        skillsRequired: '',
    });

    // LOGIC: Fetch the recruiter's profile data on component load
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/profile'); 
                setRecruiterInfo(res.data.data);
            } catch (err) {
                console.error("Failed to load recruiter brand data", err);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. VALIDATION LOGIC
        if (Number(form.minSalary) < 0 || Number(form.maxSalary) < 0) {
            setError("Salary cannot be negative.");
            return;
        }

        if (Number(form.maxSalary) > 0 && Number(form.maxSalary) < Number(form.minSalary)) {
            setError("Maximum salary cannot be less than Minimum salary.");
            return;
        }

        // 2. START LOADING & CLEAR OLD ERRORS
        setLoading(true);
        setError('');

        // 3. ATTEMPT API CALL
        try {
            const payload = {
                ...form,
                // LOGIC: Dynamically assign brand data from the logged-in recruiter
                companyName: recruiterInfo?.company || "Company",
                companyWebsite: recruiterInfo?.website || "",
                salary: { 
                    min: Number(form.minSalary), 
                    max: Number(form.maxSalary) 
                },
                education: { 
                    qualification: form.qualification, 
                    allowBacklogs: form.allowBacklogs 
                },
                skillsRequired: form.skillsRequired.split(',').map(s => s.trim()).filter(Boolean),
            };

            await api.post('/jobs', payload);
            setSuccess(true);
            setTimeout(() => navigate('/recruiter'), 2000);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post job.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <RecruiterLayout>
                <div className="flex flex-col items-center justify-center py-24">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-6" />
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">Job Published!</h2>
                    <p className="text-slate-500 font-medium italic">Redirecting to dashboard...</p>
                </div>
            </RecruiterLayout>
        );
    }

    return (
        <RecruiterLayout>
            <div className="max-w-3xl mx-auto space-y-8 pb-10">
                <div>
                    <h1 className="text-2xl font-bold text-[#1a2b4b] dark:text-white font-serif tracking-tight">Post a New Job</h1>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                        Define criteria to find the perfect candidate as: <span className="font-bold text-blue-600">{recruiterInfo?.company || 'Loading...'}</span>
                    </p>
                </div>

                {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{error}</div>}

                <form onSubmit={handleSubmit} className="bg-white dark:bg-[#131b2f] rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="flex items-center gap-2 text-sm font-semibold mb-2"><Briefcase className="w-4 h-4 text-blue-600"/> Job Title</label>
                            <input name="title" value={form.title} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm font-bold" placeholder="e.g. Senior Node.js Developer" />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold mb-2"><MapPin className="w-4 h-4 text-blue-600"/> Location Type</label>
                            <select name="locationType" value={form.locationType} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm font-bold">
                                <option value="On-site">On-site</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>

                        {form.locationType !== 'Remote' && (
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold mb-2"><MapPin className="w-4 h-4 text-blue-600"/> Specific City</label>
                                <input name="location" value={form.location} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm font-bold" placeholder="e.g. Pune, India" />
                            </div>
                        )}
                    </div>

                    {/* Criteria Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold mb-2"><Tags className="w-4 h-4 text-blue-600"/> Employment</label>
                            <select name="type" value={form.type} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm font-bold">
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold mb-2"><ArrowRight className="w-4 h-4 text-blue-600"/> Experience</label>
                            <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm font-bold">
                                <option value="Entry Level">Entry Level</option>
                                <option value="Mid Level">Mid Level</option>
                                <option value="Senior Level">Senior Level</option>
                                <option value="Executive">Executive</option>
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold mb-2"><Clock className="w-4 h-4 text-blue-600"/> Shift</label>
                            <select name="shift" value={form.shift} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm font-bold">
                                <option value="Day">Day Shift</option>
                                <option value="Night">Night Shift</option>
                                <option value="Flexible">Flexible</option>
                            </select>
                        </div>
                    </div>

                    {/* Salary & Education */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                        <DollarSign className="w-4 h-4 text-blue-600"/> Salary Range (Min - Max)
                        </label>
                        <div className="flex gap-2">
                            <input 
                                name="minSalary" 
                                value={form.minSalary} 
                                onChange={handleChange} 
                                type="number" 
                                min="0" 
                                placeholder="Min" 
                                className="w-1/2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm font-bold" 
                            />
                            <input 
                                name="maxSalary" 
                                value={form.maxSalary} 
                                onChange={handleChange} 
                                type="number" 
                                min="0" 
                                placeholder="Max" 
                                className="w-1/2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm font-bold" 
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="flex items-center gap-2 text-sm font-semibold mb-2"><GraduationCap className="w-4 h-4 text-blue-600"/> Education</label>
                            <select name="qualification" value={form.qualification} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm font-bold">
                                <option value="Graduate">Graduate</option>
                                <option value="Post Graduate">Post Graduate</option>
                                <option value="Undergraduate">Undergraduate</option>
                                <option value="Any">Any Qualification</option>
                            </select>
                        </div>
                    </div>

                    {/* Professional Eligibility Criteria */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Candidate Eligibility
                        </label>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Allow Active Backlogs?</p>
                                <p className="text-xs text-slate-500">Decide if candidates with ongoing backlogs can apply for this role.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="allowBacklogs" 
                                    checked={form.allowBacklogs} 
                                    onChange={handleChange} 
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-2"><Plus className="w-4 h-4 text-blue-600"/> Skills Required (comma separated)</label>
                        <input name="skillsRequired" value={form.skillsRequired} onChange={handleChange} placeholder="React, Node.js, MongoDB" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm font-bold" />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-2"><AlignLeft className="w-4 h-4 text-blue-600"/> Job Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={5} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm font-medium" placeholder="Detailed job description..."></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => navigate('/recruiter')} className="px-6 py-2 text-sm font-bold text-slate-500">Cancel</button>
                        <button type="submit" disabled={loading} className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 transition-all active:scale-[0.98]">
                            {loading ? 'Publishing...' : 'Publish Job'} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </RecruiterLayout>
    );
}