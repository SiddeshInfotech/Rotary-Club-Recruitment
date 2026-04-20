import CandidateLayout from "../../layouts/CandidateLayout";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();
    const firstName = user?.firstName || 'Alexander';

    return (
        <CandidateLayout>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
                
                {/* Main Content (Left Column) */}
                <div className="flex flex-col gap-10">
                    
                    {/* Welcome Banner */}
                    <div className="bg-[#124a73] rounded-[20px] p-10 text-white shadow-sm flex flex-col gap-6" style={{ background: 'linear-gradient(135deg, #1b283b 0%, #0d62a6 100%)' }}>
                        <div>
                            <h1 className="text-[32px] font-bold mb-4">Welcome back, {firstName}</h1>
                            <p className="text-white/90 text-[17px] max-w-2xl leading-relaxed">
                                You have 3 interview invitations pending and 12 new high-affinity matches waiting for your review.
                            </p>
                        </div>
                        <div className="flex gap-4 mt-2">
                            <button className="bg-white text-[#0d62a6] px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                                View Invitations
                            </button>
                            <button className="bg-transparent border border-white/30 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                                Update Resume
                            </button>
                        </div>
                    </div>

                    {/* Active Applications */}
                    <div>
                        <div className="flex justify-between items-center mb-6 px-1">
                            <h2 className="text-[13px] font-bold tracking-widest text-slate-900 uppercase">ACTIVE APPLICATIONS</h2>
                            <a href="#" className="text-xs font-bold text-[#0070f3] uppercase tracking-widest hover:underline">
                                VIEW ALL
                            </a>
                        </div>
                        
                        <div className="bg-white rounded-[20px] p-8 shadow-sm border border-slate-100 flex flex-col gap-8">
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex gap-5 items-center">
                                    <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-400 tracking-wider">
                                        LINEAR
                                    </div>
                                    <div>
                                        <h3 className="text-[22px] font-bold text-slate-900 mb-1">Senior Product Designer</h3>
                                        <p className="text-[15px] text-slate-500">Linear • Applied 4 days ago</p>
                                    </div>
                                </div>
                                <span className="bg-[#eef5fe] text-[#0070f3] text-xs font-bold px-4 py-2 rounded-full tracking-wider uppercase">
                                    INTERVIEWING
                                </span>
                            </div>

                            {/* Status */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">APPLICATION STATUS</span>
                                    <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">STEP 3 OF 5</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 mb-8">
                                    <div className="bg-[#0070f3] h-2 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                                
                                <div className="flex justify-end">
                                    <button className="bg-[#eef5fe] text-[#0070f3] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#e1edfd] transition-colors">
                                        Prepare for Interview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* My Posts */}
                    <div>
                        <div className="flex justify-between items-center mb-6 px-1">
                            <h2 className="text-[13px] font-bold tracking-widest text-slate-900 uppercase">MY POSTS</h2>
                            <button className="bg-[#0070f3] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-600 transition-colors flex items-center gap-1">
                                <span className="text-lg leading-none mb-0.5">+</span> Post
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Post 1 */}
                            <div className="bg-white p-7 rounded-[20px] shadow-sm border border-slate-100 flex flex-col justify-between min-h-[180px]">
                                <p className="text-slate-800 font-medium leading-relaxed text-[15px]">
                                    Why design leadership in 2024 requires a shift towards operational excellence over pure aesthetics...
                                </p>
                                <div className="flex justify-between items-center text-[13px] text-slate-500 font-medium mt-6">
                                    <span>2 hours ago</span>
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            1.2k
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[#0070f3]">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                                            84
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Post 2 */}
                            <div className="bg-white p-7 rounded-[20px] shadow-sm border border-slate-100 flex flex-col justify-between min-h-[180px]">
                                <p className="text-slate-800 font-medium leading-relaxed text-[15px]">
                                    Thinking about the bridge between Product Design and Brand Engineering. How do we create...
                                </p>
                                <div className="flex justify-between items-center text-[13px] text-slate-500 font-medium mt-6">
                                    <span>Yesterday</span>
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542-7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            840
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[#0070f3]">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                                            52
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Sidebar */}
                <div className="flex flex-col gap-10">
                    
                    {/* Profile Strength */}
                    <div className="bg-white rounded-[20px] p-8 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[13px] font-bold tracking-widest text-slate-500 uppercase">PROFILE STRENGTH</h2>
                            <span className="text-[32px] text-[#0070f3]">80%</span>
                        </div>
                        
                        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
                            <div className="bg-[#0070f3] h-2.5 rounded-full" style={{ width: '80%' }}></div>
                        </div>

                        <p className="text-[13px] text-slate-500 leading-relaxed mb-6 font-medium">
                            Your profile is in the top 5% of design leadership roles in North America.
                        </p>

                        <a href="#" className="text-sm font-bold text-[#0070f3] hover:underline flex items-center gap-2">
                            Complete Profile
                            <span className="text-lg leading-none">&rarr;</span>
                        </a>
                    </div>

                    {/* Saved Opportunities */}
                    <div>
                        <h2 className="text-[13px] font-bold tracking-widest text-slate-500 uppercase mb-4 px-1">SAVED OPPORTUNITIES</h2>
                        <div className="flex flex-col gap-3 mb-6">
                            {/* Item 1 */}
                            <div className="bg-white rounded-[16px] p-5 shadow-sm border border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-[15px] text-slate-900 mb-0.5">Product Lead</h3>
                                    <p className="text-[13px] text-slate-500">Framer</p>
                                </div>
                                <button className="text-[#0070f3]">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
                                </button>
                            </div>
                            {/* Item 2 */}
                            <div className="bg-white rounded-[16px] p-5 shadow-sm border border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-[15px] text-slate-900 mb-0.5">Systems Designer</h3>
                                    <p className="text-[13px] text-slate-500">Airbnb</p>
                                </div>
                                <button className="text-[#0070f3]">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
                                </button>
                            </div>
                            {/* Item 3 */}
                            <div className="bg-white rounded-[16px] p-5 shadow-sm border border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-[15px] text-slate-900 mb-0.5">Visual Designer</h3>
                                    <p className="text-[13px] text-slate-500">Meta</p>
                                </div>
                                <button className="text-[#0070f3]">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
                                </button>
                            </div>
                        </div>

                        <div className="text-center">
                            <button className="text-[11px] font-bold tracking-widest text-slate-500 uppercase hover:text-slate-800 transition-colors">
                                MANAGE ALL SAVED (14)
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </CandidateLayout>
    );
}