import CandidateLayout from "../../layouts/CandidateLayout";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();
    const firstName = user?.firstName || 'Smith';
    const lastName = user?.lastName || 'Patel';
    const fullName = `${firstName} ${lastName}`;
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

    return (
        <CandidateLayout>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

                {/* Main Content (Left Column) - Posts Feed */}
                <div className="flex flex-col gap-6">

                    {/* Welcome Banner */}
                    <div className="bg-[#124a73] rounded-[20px] p-10 text-white shadow-sm flex flex-col gap-6" style={{ background: 'linear-gradient(135deg, #1b283b 0%, #0d62a6 100%)' }}>
                        <div>
                            <h1 className="text-[32px] font-bold mb-4">Welcome back, {firstName}</h1>
                            <p className="text-white/90 text-[17px] max-w-2xl leading-relaxed">
                                You have 3 interview invitations pending and 12 new high-affinity matches waiting for your review.
                            </p>
                        </div>
                        <div className="flex gap-4 mt-2">
                            <button className="bg-white text-[#0d62a6] px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-50 transition-colors">
                                View Invitations
                            </button>
                            <button className="bg-transparent border border-white/30 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                                Update Resume
                            </button>
                            <button className="bg-yellow-400 text-yellow-900 px-6 py-2.5 rounded-lg font-bold hover:bg-yellow-300 transition-colors shadow-sm ml-auto">
                                Try Premium
                            </button>
                        </div>
                    </div>

                    {/* Create Post */}
                    <div className="bg-white rounded-[12px] p-5 shadow-sm border border-slate-200">
                        <div className="flex gap-4 mb-4">
                            <div className="w-12 h-12 bg-[#0d2a45] rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0">
                                {initials}
                            </div>
                            <button className="flex-1 text-left bg-white border border-slate-300 rounded-full px-5 text-slate-500 font-medium hover:bg-slate-50 transition-colors shadow-sm">
                                Start a post
                            </button>
                        </div>
                        <div className="flex justify-around items-center pt-2">
                            <button className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                Video
                            </button>
                            <button className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Photo
                            </button>
                            <button className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                                Write article
                            </button>
                        </div>
                    </div>

                    {/* Sort By */}
                    <div className="flex justify-end items-center px-1 border-t border-slate-200 pt-4 mt-2">
                        <span className="text-sm text-slate-500">Sort by: <strong className="text-slate-800">Top</strong></span>
                    </div>

                    {/* Feed Post */}
                    <div className="bg-white rounded-[12px] p-5 shadow-sm border border-slate-200">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-3 items-center">
                                <div className="w-12 h-12 bg-[#0d2a45] rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0">
                                    {initials}
                                </div>
                                <div>
                                    <h3 className="font-bold text-[16px] text-slate-900 leading-tight">{fullName}</h3>
                                    <p className="text-[13px] text-slate-500 mt-0.5">1d • 🌍</p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600 p-1">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                            </button>
                        </div>

                        {/* Repost info */}
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            Reposted from {fullName}:
                        </div>

                        {/* Content */}
                        <p className="text-[15px] text-slate-800 mb-4">
                            What's Up???
                        </p>

                        {/* Image */}
                        <div className="w-full bg-slate-100 overflow-hidden border border-slate-200">
                            {/* Placeholder for the large image in the user's screenshot */}
                            <img src="https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=1200&q=80" alt="Post attachment" className="w-full h-auto object-cover max-h-[500px]" />
                        </div>
                    </div>

                </div>

                {/* Right Sidebar */}
                <div className="flex flex-col gap-8">

                    {/* Profile Strength */}
                    <div className="bg-white rounded-[16px] p-6 shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-[12px] font-bold tracking-widest text-slate-500 uppercase">PROFILE STRENGTH</h2>
                            <span className="text-[24px] font-semibold text-[#0070f3]">80%</span>
                        </div>

                        <div className="w-full bg-slate-100 rounded-full h-2 mb-5">
                            <div className="bg-[#0070f3] h-2 rounded-full" style={{ width: '80%' }}></div>
                        </div>

                        <p className="text-[13px] text-slate-500 leading-relaxed mb-5 font-medium">
                            Your profile is in the top 5% of design leadership roles in North America.
                        </p>

                        <a href="#" className="text-sm font-bold text-[#0070f3] hover:underline flex items-center gap-1.5">
                            Complete Profile
                            <span className="text-lg leading-none">&rarr;</span>
                        </a>
                    </div>

                    {/* Saved Opportunities */}
                    <div>
                        <h2 className="text-[12px] font-bold tracking-widest text-slate-500 uppercase mb-4 px-1">SAVED OPPORTUNITIES</h2>
                        <div className="flex flex-col gap-3 mb-5">
                            {/* Item 1 */}
                            <div className="bg-white rounded-[12px] p-4 shadow-sm border border-slate-200 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-[14px] text-slate-900 mb-0.5">Product Lead</h3>
                                    <p className="text-[12px] text-slate-500">Framer</p>
                                </div>
                                <button className="text-slate-400 hover:text-[#0070f3]">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
                                </button>
                            </div>
                            {/* Item 2 */}
                            <div className="bg-white rounded-[12px] p-4 shadow-sm border border-slate-200 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-[14px] text-slate-900 mb-0.5">Systems Designer</h3>
                                    <p className="text-[12px] text-slate-500">Airbnb</p>
                                </div>
                                <button className="text-slate-400 hover:text-[#0070f3]">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
                                </button>
                            </div>
                            {/* Item 3 */}
                            <div className="bg-white rounded-[12px] p-4 shadow-sm border border-slate-200 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-[14px] text-slate-900 mb-0.5">Visual Designer</h3>
                                    <p className="text-[12px] text-slate-500">Meta</p>
                                </div>
                                <button className="text-slate-400 hover:text-[#0070f3]">
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

                    {/* Active Applications */}
                    <div>
                        <div className="flex justify-between items-center mb-4 px-1">
                            <h2 className="text-[12px] font-bold tracking-widest text-slate-500 uppercase">ACTIVE APPLICATIONS</h2>
                            <a href="#" className="text-[10px] font-bold text-[#0070f3] uppercase tracking-widest hover:underline">
                                VIEW ALL
                            </a>
                        </div>

                        <div className="bg-white rounded-[16px] p-5 shadow-sm border border-slate-200 flex flex-col gap-6">
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-slate-100 rounded-[12px] flex items-center justify-center text-[9px] font-bold text-slate-400 tracking-wider">
                                        LINEAR
                                    </div>
                                    <div>
                                        <h3 className="text-[15px] font-bold text-slate-900 mb-0.5">Senior Product Designer</h3>
                                        <p className="text-[12px] text-slate-500">Linear • Applied 4 days ago</p>
                                    </div>
                                </div>
                            </div>

                            {/* Badge */}
                            <div>
                                <span className="bg-[#eef5fe] text-[#0070f3] text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider uppercase">
                                    INTERVIEWING
                                </span>
                            </div>

                            {/* Status */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">STATUS</span>
                                    <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">STEP 3 OF 5</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-5">
                                    <div className="bg-[#0070f3] h-1.5 rounded-full" style={{ width: '60%' }}></div>
                                </div>

                                <button className="w-full bg-[#eef5fe] text-[#0070f3] py-2 rounded-lg text-sm font-semibold hover:bg-[#e1edfd] transition-colors">
                                    Prepare for Interview
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </CandidateLayout>
    );
}
