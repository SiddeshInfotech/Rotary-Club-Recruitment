import { Link } from 'react-router-dom';

export default function HeroSection() {
    return (
        <section id="home" className="relative min-h-[800px] flex items-center overflow-hidden px-6 lg:px-8 py-20 mt-16 z-10">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                
                <div className="md:col-span-7 z-10">
                    <span className="text-sm uppercase tracking-[0.2em] text-blue-700 dark:text-blue-400 font-bold mb-6 block">Intelligence Meets Opportunity</span>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1] text-slate-900 dark:text-white mb-8 font-serif">
                        Discover Your <br className="hidden md:block"/>Career Potential <br className="hidden md:block"/>with AI.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl mb-10 leading-relaxed font-medium">
                        Platform that connects students, professionals, and recruiters through data-driven EQ matching and smart professional networking.
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                        <Link to="/register" className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-xl text-base font-bold transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-500/30 inline-flex items-center justify-center">
                            Get Started
                        </Link>
                        <button className="px-8 py-4 rounded-xl text-base font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all inline-flex items-center justify-center">
                            Explore Jobs
                        </button>
                    </div>
                </div>
                
                <div className="md:col-span-5 relative mt-12 md:mt-0">
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10 dark:shadow-black/50 bg-slate-100 dark:bg-slate-800">
                        <img 
                            className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal grayscale-[20%] transition-transform duration-700 hover:scale-105" 
                            alt="Professionals networking in modern workspace" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-wMtSovWitkxrErlg9_w_l_JMHU81IkmP1GuSpt1qw22389sxMx7eOup6POhWa_a-SYwaH9rul--KhANj4DkprDoUAsTX8fyISa-2mNXsQEvgSU9_Ua-OIzNBDrKEY3HgAciiRGThDd6fYN9B1hojZEoqOAowkCV3QPZKwGTSGO_Ep-lOhPnETMC43b6W6doW0wpS_pGYCIUUVclE7aw5D70e9ZxQIEa-nDxNsauv26JMLqALFfJ3VePSDhGVCBLQAoRGNm1GF6w"
                        />
                    </div>
                    
                    <div className="absolute -bottom-8 -left-8 bg-indigo-100 dark:bg-indigo-900 p-8 rounded-2xl shadow-xl hidden lg:block border border-indigo-200/50 dark:border-indigo-800/50">
                        <div className="text-4xl font-black text-indigo-700 dark:text-indigo-300">98%</div>
                        <div className="text-sm uppercase tracking-widest font-bold text-indigo-600 dark:text-indigo-400 mt-1">Match Rate Accuracy</div>
                    </div>
                </div>
                
            </div>
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 dark:bg-slate-900/50 -z-10 translate-x-1/4 skew-x-[-12deg]"></div>
            
            {/* Soft dark mode glow */}
            <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] rounded-full point-events-none -z-20"></div>
        </section>
    );
}
