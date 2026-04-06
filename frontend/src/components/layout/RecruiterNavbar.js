import { Bell, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

// Recruiter-side navbar with dark navy theme
export default function RecruiterNavbar() {
    return (
        <nav className="bg-[#1a2b4b] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* logo + nav links */}
                <div className="flex items-center gap-10">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-white/10 text-white rounded-md w-8 h-8 flex items-center justify-center font-bold text-sm tracking-tight">
                            EQ
                        </div>
                        <span className="text-white font-bold text-lg tracking-tight">EQ-Hire</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-7 text-sm font-medium">
                        <Link to="/recruiter" className="text-white bg-white/10 px-4 py-1.5 rounded-full text-[13px]">Dashboard</Link>
                        <Link to="/recruiter/search" className="text-gray-300 hover:text-white transition-colors">Search Candidates</Link>
                        <Link to="/recruiter/messages" className="text-gray-300 hover:text-white transition-colors">Messages</Link>
                        <Link to="/recruiter/settings" className="text-gray-300 hover:text-white transition-colors">Settings</Link>
                    </div>
                </div>

                {/* right side */}
                <div className="flex items-center gap-5">
                    <Link to="/recruiter/messages" className="relative cursor-pointer group">
                        <MessageSquare className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                    </Link>
                    <div className="relative cursor-pointer group">
                        <Bell className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></span>
                    </div>
                    <div className="w-px h-6 bg-white/20"></div>
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-white leading-tight">Rahul Singh</p>
                            <p className="text-[11px] text-cyan-300 leading-tight">Collaborative Innovator</p>
                        </div>
                        <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-cyan-400/30 group-hover:ring-cyan-400/60 transition-all">
                            <img
                                src="https://ui-avatars.com/api/?name=Rahul+Singh&background=0d1b2a&color=67e8f9"
                                alt="Recruiter avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
