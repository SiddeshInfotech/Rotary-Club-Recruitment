import { Bell, Sparkles, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Glassmorphism nav with backdrop blur
export default function Navbar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        localStorage.removeItem('eqhire_token');
        sessionStorage.removeItem('eqhire_token');
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                
                {/* Left side: Logo & Links */}
                <div className="flex items-center gap-12">
                    {/* Logo flex section */}
                    <Link to="/candidate" className="flex items-center gap-2 group cursor-pointer">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-md w-8 h-8 flex items-center justify-center font-bold text-sm tracking-tight shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                            EQ
                        </div>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 font-bold text-lg tracking-tight">EQ-Hire</span>
                    </Link>

                    {/* Links */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <Link to="/candidate" className="text-blue-600 border-b-2 border-blue-600 h-16 flex items-center pt-[2px]">
                            Dashboard
                        </Link>
                        <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                            Find Jobs
                        </a>
                        <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                            My Profile
                        </a>
                        <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                            Messages
                        </a>
                    </div>
                </div>

                {/* Right side: Bell & Profile */}
                <div className="flex items-center gap-5">
                    
                    {/* Glowing Assessment Button */}
                    <button className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 text-xs font-bold px-4 py-2 rounded-full relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="relative z-10">Take EQ Assessment</span>
                    </button>

                    <div className="w-px h-6 bg-gray-200 mx-1"></div>

                    <div className="relative cursor-pointer group hover:-mt-1 transition-all">
                        <Bell className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                    </div>

                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">Alex Johnson</p>
                            <p className="text-[11px] text-gray-500 leading-tight">Dependable Guardian</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white shadow-sm group-hover:ring-blue-100 transition-all">
                            <img 
                                src="https://ui-avatars.com/api/?name=Alex+Johnson&background=eff6ff&color=2563eb" 
                                alt="User avatar" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        title="Sign out"
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                    >
                        <LogOut className="w-4.5 h-4.5" />
                    </button>
                </div>

            </div>
        </nav>
    );
}