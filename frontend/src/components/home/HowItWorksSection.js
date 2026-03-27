import { UserPlus, FormInput, Sparkles, Briefcase } from "lucide-react";

export default function HowItWorksSection() {
    return (
        <section id="about" className="py-32 bg-slate-50 dark:bg-[#0b1121] transition-colors duration-300 relative z-10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <span className="text-sm uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 font-bold mb-4 block">Process</span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 font-serif">
                        How It Works
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                        A streamlined pipeline designed to identify, analyze, and place top-tier talent using next-generation metrics.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    
                    {/* Connecting line (desktop only) */}
                    <div className="hidden lg:block absolute top-[45px] left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-slate-200 via-blue-200 to-slate-200 dark:from-slate-800 dark:via-blue-900 dark:to-slate-800 z-0"></div>
                    
                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center text-center group">
                        <div className="w-24 h-24 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-slate-200/50 dark:shadow-none group-hover:border-blue-500 dark:group-hover:border-blue-500 transition-colors">
                            <UserPlus className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-4">1</div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Create Profile</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed px-4">
                            Register as a candidate or recruiter and establish your professional baseline.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center text-center group lg:mt-6">
                        <div className="w-24 h-24 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-slate-200/50 dark:shadow-none group-hover:border-blue-500 dark:group-hover:border-blue-500 transition-colors">
                            <FormInput className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-4">2</div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Take EQ & Aptitude Test</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed px-4">
                            Complete our proprietary psychological assessments to reveal your true capabilities.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center text-center group">
                        <div className="w-24 h-24 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-slate-200/50 dark:shadow-none group-hover:border-blue-500 dark:group-hover:border-blue-500 transition-colors">
                            <Sparkles className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-4">3</div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">AI Analysis</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed px-4">
                            Our engine maps your brain inclination and processes your unique behavioral footprint.
                        </p>
                    </div>

                    {/* Step 4 */}
                    <div className="relative z-10 flex flex-col items-center text-center group lg:mt-6">
                        <div className="w-24 h-24 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-slate-200/50 dark:shadow-none group-hover:border-blue-500 dark:group-hover:border-blue-500 transition-colors">
                            <Briefcase className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-4">4</div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Get Job Recommendations</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed px-4">
                            Receive highly tailored, high-fidelity matches optimized for longevity and cultural fit.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
