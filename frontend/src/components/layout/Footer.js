import { Globe, Users, Heart } from "lucide-react";

export default function Footer() {
    return (
         <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="flex flex-col md:flex-row justify-between items-center w-full px-8 py-16 max-w-7xl mx-auto">
                
                <div className="mb-12 md:mb-0 text-center md:text-left">
                    <div className="text-lg font-black text-slate-900 dark:text-white mb-2">EQ HIRE</div>
                    <p className="text-xs tracking-widest uppercase text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} EQ HIRE. Curated Excellence.</p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                    <a className="text-xs tracking-widest uppercase font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" href="#home">
                        Home
                    </a>
                    <a className="text-xs tracking-widest uppercase font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" href="#about">
                        About
                    </a>
                    <a className="text-xs tracking-widest uppercase font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" href="#events">
                        Events
                    </a>
                    <a className="text-xs tracking-widest uppercase font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" href="#join">
                        Join Us
                    </a>
                </div>
                
                <div className="mt-12 md:mt-0 flex gap-6">
                    <button className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="Global Network">
                        <Globe className="w-5 h-5" />
                    </button>
                    <button className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="Diversity">
                        <Users className="w-5 h-5" />
                    </button>
                    <button className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="Volunteer">
                        <Heart className="w-5 h-5" />
                    </button>
                </div>

            </div>
        </footer>
    );
}
