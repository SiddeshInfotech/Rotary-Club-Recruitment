import { useState } from "react";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import { Plus, Briefcase, MapPin, AlignLeft, Tags, ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function PostJob() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        title: '',
        location: '',
        type: 'Full-time',
        description: '',
        skillsRequired: '',
        status: 'Active',
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = {
                title: form.title,
                location: form.location,
                type: form.type,
                status: form.status,
                description: form.description,
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
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Job Published!</h2>
                    <p className="text-slate-500 font-medium">Redirecting to dashboard...</p>
                </div>
            </RecruiterLayout>
        );
    }

    return (
        <RecruiterLayout>
            <div className="max-w-3xl mx-auto space-y-8 pb-10">
                <div>
                    <h1 className="text-2xl font-bold text-[#1a2b4b] dark:text-white">Post a New Job</h1>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Fill out the details below to create a new job listing.</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-bold">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="bg-white dark:bg-[#131b2f] rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                <Briefcase className="w-4 h-4 text-cyan-600" /> Job Title
                            </label>
                            <input name="title" value={form.title} onChange={handleChange} type="text" placeholder="e.g. Senior Frontend Developer" required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all text-sm" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    <MapPin className="w-4 h-4 text-cyan-600" /> Location
                                </label>
                                <input name="location" value={form.location} onChange={handleChange} type="text" placeholder="e.g. San Francisco, CA or Remote"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all text-sm" />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    <Tags className="w-4 h-4 text-cyan-600" /> Employment Type
                                </label>
                                <select name="type" value={form.type} onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all text-sm">
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                <Plus className="w-4 h-4 text-cyan-600" /> Skills Required (comma separated)
                            </label>
                            <input name="skillsRequired" value={form.skillsRequired} onChange={handleChange} type="text" placeholder="e.g. React, Node.js, MongoDB"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all text-sm" />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                <AlignLeft className="w-4 h-4 text-cyan-600" /> Job Description
                            </label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows={6} placeholder="Describe the responsibilities, requirements, and culture..."
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all text-sm resize-none"></textarea>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3">
                        <button type="button" onClick={() => navigate('/recruiter')} className="px-6 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-[#1a2b4b] dark:bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-[#243a5e] dark:hover:bg-blue-500 transition-colors shadow-sm disabled:opacity-60">
                            {loading ? 'Publishing...' : 'Publish Job'} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </RecruiterLayout>
    );
}
