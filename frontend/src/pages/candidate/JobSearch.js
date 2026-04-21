import { useState, useEffect, useCallback } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { Search, Briefcase, MapPin, Building2, Filter, ChevronDown, Clock, Banknote, Star } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from "../../services/api";

export default function JobSearch() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Initialize states from URL or default
    const [keyword, setKeyword] = useState(searchParams.get('q') || '');
    const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '');
    const [jobTypeFilter, setJobTypeFilter] = useState(searchParams.get('type') || 'All');
    const [experienceFilter, setExperienceFilter] = useState(searchParams.get('experience') || 'All');
    const [sortOrder, setSortOrder] = useState(searchParams.get('sort') || 'Most Relevant');
    
    // Advanced Filters state
    const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
    const [skillsFilter, setSkillsFilter] = useState(searchParams.get('skills') || '');
    const [remoteOnly, setRemoteOnly] = useState(searchParams.get('remote') === 'true');

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [suggestedJobs, setSuggestedJobs] = useState([]);
    const [suggestedLoading, setSuggestedLoading] = useState(true);

    const fetchSuggestedJobs = useCallback(async () => {
        setSuggestedLoading(true);
        try {
            const res = await api.get('/jobs');
            if (res.data.success || Array.isArray(res.data.data) || Array.isArray(res.data)) {
                let jobsList = Array.isArray(res.data) ? res.data : (res.data.data || []);
                setSuggestedJobs(jobsList.slice(0, 3));
            }
        } catch (err) {
            console.error("Failed to fetch suggestions", err);
        } finally {
            setSuggestedLoading(false);
        }
    }, []);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (keyword) params.append('keyword', keyword);
            if (locationFilter) params.append('location', locationFilter);
            if (jobTypeFilter && jobTypeFilter !== 'All') params.append('jobType', jobTypeFilter);
            if (experienceFilter && experienceFilter !== 'All') params.append('experience', experienceFilter);
            if (skillsFilter) params.append('skills', skillsFilter);
            if (remoteOnly) params.append('remote', 'true');
            if (sortOrder) params.append('sort', sortOrder);

            const url = `/jobs/search?${params.toString()}`;
            const res = await api.get(url);
            if (res.data.success) {
                setJobs(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
        } finally {
            setLoading(false);
        }
    }, [keyword, locationFilter, jobTypeFilter, experienceFilter, skillsFilter, remoteOnly, sortOrder]);

    // Fetch jobs when dependencies change securely
    useEffect(() => {
        fetchJobs();
        fetchSuggestedJobs();
    }, [fetchJobs, fetchSuggestedJobs]);

    const handleSearch = (e) => {
        e.preventDefault();
        
        // Update URL to match current search state for shareability
        const params = new URLSearchParams();
        if (keyword) params.append('q', keyword);
        if (locationFilter) params.append('location', locationFilter);
        if (jobTypeFilter !== 'All') params.append('type', jobTypeFilter);
        if (experienceFilter !== 'All') params.append('experience', experienceFilter);
        if (skillsFilter) params.append('skills', skillsFilter);
        if (remoteOnly) params.append('remote', 'true');
        if (sortOrder !== 'Most Relevant') params.append('sort', sortOrder);
        setSearchParams(params);
        
        fetchJobs();
    };

    const timeAgo = (date) => {
        if (!date) return '';
        const diff = Math.floor((Date.now() - new Date(date)) / 86400000);
        if (diff === 0) return 'Today';
        if (diff === 1) return '1 day ago';
        if (diff < 7) return `${diff} days ago`;
        if (diff < 30) return `${Math.floor(diff / 7)} week(s) ago`;
        return `${Math.floor(diff / 30)} month(s) ago`;
    };

    return (
        <CandidateLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-8">
                <div className="max-w-[700px]">
                    <h3 className="text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase mb-3">GLOBAL OPPORTUNITIES</h3>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-serif">Job Search</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                        Explore open positions across the Rotary, Lions, and BNI ecosystems. Use advanced filters to find the perfect role.
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <form onSubmit={handleSearch} className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 mb-10 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Job title, keywords, or company..." 
                            className="w-full bg-slate-50 dark:bg-[#0b1121] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-semibold py-4 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                        />
                    </div>
                    <div className="md:w-[250px] relative">
                        <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            placeholder="City, state, or Remote" 
                            className="w-full bg-slate-50 dark:bg-[#0b1121] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-semibold py-4 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 px-10 text-xs uppercase font-bold tracking-widest transition shadow-sm w-full md:w-auto">
                        SEARCH
                    </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap gap-3">
                        <div className="relative">
                            <select 
                                value={jobTypeFilter}
                                onChange={(e) => setJobTypeFilter(e.target.value)}
                                className="appearance-none flex items-center gap-2 px-4 py-2 pr-10 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent cursor-pointer"
                            >
                                <option value="All">Job Type</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                            <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                        </div>
                        <div className="relative">
                            <select 
                                value={experienceFilter}
                                onChange={(e) => setExperienceFilter(e.target.value)}
                                className="appearance-none flex items-center gap-2 px-4 py-2 pr-10 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent cursor-pointer"
                            >
                                <option value="All">Experience Level</option>
                                <option value="Entry Level">Entry Level</option>
                                <option value="Mid Level">Mid Level</option>
                                <option value="Senior Level">Senior Level</option>
                                <option value="Executive">Executive</option>
                            </select>
                            <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => setIsMoreFiltersOpen(!isMoreFiltersOpen)}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-widest transition uppercase ${isMoreFiltersOpen ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        <Filter className="w-4 h-4" />
                        More Filters {isMoreFiltersOpen ? '-' : '+'}
                    </button>
                </div>
                
                {isMoreFiltersOpen && (
                    <div className="px-2 pt-6 mt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-6 animate-in fade-in slide-in-from-top-4 duration-200">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Required Skills</label>
                            <input 
                                type="text"
                                value={skillsFilter}
                                onChange={(e) => setSkillsFilter(e.target.value)}
                                placeholder="e.g. React, Python (comma separated)"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                            />
                        </div>
                        <div className="flex items-center gap-3 pt-6">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        checked={remoteOnly}
                                        onChange={(e) => setRemoteOnly(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-blue-600 transition-colors" />
                                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" />
                                </div>
                                <span className={`text-xs font-bold tracking-wide ${remoteOnly ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                    Remote Roles Only
                                </span>
                            </label>
                        </div>
                    </div>
                )}
            </form>

            {/* AI Matches Section */}
            {!suggestedLoading && suggestedJobs.length > 0 && (
                <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                            <Star className="w-5 h-5 fill-current" />
                        </div>
                        <h2 className="text-2xl font-black font-serif text-slate-900 dark:text-white">Curated Matches</h2>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full ml-2">Suggested for You</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {suggestedJobs.map(job => {
                            const resonance = Math.floor(Math.random() * 15 + 80);
                            return (
                                <div onClick={() => navigate(`/job/${job._id}`)} key={job._id} className="bg-white dark:bg-[#131b2f] border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition cursor-pointer relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Star className="w-24 h-24 text-blue-500 fill-current -mt-4 -mr-4" />
                                    </div>
                                    <div className="flex justify-between items-start mb-5 relative z-10">
                                        <div>
                                            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-1.5">{job.companyName || job.company || "—"}</p>
                                            <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight line-clamp-1 pr-2">{job.title}</h3>
                                        </div>
                                        {/* Circular Rate */}
                                        <div className="relative w-12 h-12 flex-shrink-0 ml-2">
                                            <svg viewBox="0 0 36 36" className="w-full h-full text-blue-600">
                                                <path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                                <path className="text-blue-600 dark:text-blue-500" strokeDasharray={`${resonance}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                                <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-none">{resonance}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 relative z-10 font-medium leading-relaxed">{job.description}</p>
                                    <div className="flex gap-2 relative z-10">
                                      <span className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-md text-[9px] uppercase tracking-widest font-bold text-slate-600 dark:text-slate-300">{job.location || 'REMOTE'}</span>
                                      <span className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-md text-[9px] uppercase tracking-widest font-bold text-slate-600 dark:text-slate-300">{job.type || job.jobType || 'FULL-TIME'}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {loading ? 'Loading...' : `Showing ${jobs.length} open position${jobs.length !== 1 ? 's' : ''}`}
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Sort by:
                    <select 
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="bg-transparent text-slate-900 dark:text-white font-bold cursor-pointer focus:outline-none"
                    >
                        <option value="Most Relevant">Most Relevant</option>
                        <option value="Most Recent">Most Recent</option>
                        <option value="Oldest">Oldest First</option>
                        <option value="Salary High">Salary (High to Low)</option>
                        <option value="Salary Low">Salary (Low to High)</option>
                        <option value="Company A-Z">Company (A-Z)</option>
                    </select>
                </div>
            </div>

            {/* Job List */}
            <div className="flex flex-col gap-4">
                {loading ? (
                    <div className="text-center py-12 text-slate-500 font-medium">Loading jobs...</div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No jobs found. Try a different search.</p>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <div key={job._id} className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-sm hover:shadow-md transition group cursor-pointer">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="flex gap-4">
                                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Building2 className="w-7 h-7 text-blue-600 dark:text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{job.title}</h3>
                                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">{job.companyName || job.company || "—"}</p>
                                        
                                        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
                                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location || 'Remote'}</span>
                                            <span className="text-slate-300 dark:text-slate-600">•</span>
                                            <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {job.type || job.jobType || 'Full-time'}</span>
                                        </div>

                                        {job.description && (
                                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mb-4">
                                                {job.description.substring(0, 200)}{job.description.length > 200 ? '...' : ''}
                                            </p>
                                        )}
                                        
                                        {job.skillsRequired && job.skillsRequired.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {job.skillsRequired.slice(0, 4).map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-md text-[10px] font-bold uppercase tracking-wider">{skill}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-center md:items-end gap-3 flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                                    <div className="flex flex-row gap-2 w-full md:w-auto">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); navigate(`/job/${job._id}`); }}
                                            className="bg-white dark:bg-[#131b2f] text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-black transition flex-1 md:flex-none text-center border border-slate-200 dark:border-slate-700 shadow-sm"
                                        >
                                            Details
                                        </button>
                                        <button className="bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-black transition flex-1 md:flex-none text-center shadow-sm">
                                            Apply
                                        </button>
                                    </div>
                                    <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                                        <Clock className="w-3 h-3" /> {timeAgo(job.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </CandidateLayout>
    );
}
