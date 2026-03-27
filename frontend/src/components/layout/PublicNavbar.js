import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
import { Link } from "react-router-dom";

export default function PublicNavbar() {
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'about', 'features', 'join'];
            let current = 'home';

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Check if section is in the viewport (with a 150px offset for the navbar)
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        current = section;
                        break;
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'features', label: 'Features' },
        { id: 'join', label: 'Join Us' }
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 transition-all duration-300">
            <div className="flex justify-between items-center w-full px-6 lg:px-8 py-3 lg:py-4 max-w-7xl mx-auto h-16">
                
                {/* Left side: Logo */}
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-md w-8 h-8 flex items-center justify-center font-bold text-sm tracking-tight shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                        EQ
                    </div>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 font-bold text-lg tracking-tight">
                        EQ HIRE
                    </span>
                </div>

                {/* Center: Links */}
                <div className="hidden md:flex items-center space-x-8 relative">
                    {navLinks.map((link) => {
                        const isActive = activeSection === link.id;
                        
                        return (
                            <a 
                                key={link.id}
                                href={`#${link.id}`}
                                className={`h-16 flex items-center pt-[2px] font-sans tracking-tight text-sm font-bold transition-all duration-300 relative ${
                                    isActive 
                                        ? 'text-blue-600 dark:text-blue-400' 
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                {link.label}
                                
                                {/* Active Indicator Bar */}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 dark:bg-blue-400 rounded-t-md transition-all duration-300 layout-id-nav-indicator"></span>
                                )}
                            </a>
                        );
                    })}
                </div>

                {/* Right side: Actions */}
                <div className="flex items-center gap-5">
                    <ThemeToggle />
                    
                    <Link to="/register" className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 text-xs font-bold px-5 py-2.5 rounded-full relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="relative z-10">Join Us</span>
                    </Link>
                    
                    {/* Mobile Menu Button - Optional, just icon for now */}
                    <button className="md:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>

            </div>
        </nav>
    );
}
