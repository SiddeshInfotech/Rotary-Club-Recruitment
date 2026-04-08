import { Architecture, Groups } from "lucide-react"; // Wait, "Architecture" or "Groups" are likely not standard Lucide icon names. Let's use standard ones.
import { Building2, Users2 } from "lucide-react";

export default function AboutSection() {
    return (
        <section id="about" className="py-32 bg-slate-50 dark:bg-[#0b1121] transition-colors duration-300 relative z-10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-end">
                    
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 font-serif">
                            Service Above Self. <br/>Precision Above Noise.
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                            We don't just volunteer; we architect solutions. EQ HIRE represents the premium tier of international service, curating talent to address the world's most persistent challenges.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-8 mt-12">
                            <div>
                                <span className="text-3xl font-black text-blue-600 dark:text-blue-500 block mb-2 font-serif">100+</span>
                                <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">Years of Heritage</span>
                            </div>
                            <div>
                                <span className="text-3xl font-black text-blue-600 dark:text-blue-500 block mb-2 font-serif">Elite</span>
                                <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">Member Status</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-12">
                        {/* Benefit 1 */}
                        <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-transform duration-300 hover:-translate-y-2">
                            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Building2 className="text-blue-600 dark:text-blue-400 w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white flex items-center gap-2">Architectural Impact</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Strategic planning for sustainable global development projects.
                            </p>
                        </div>
                        
                        {/* Benefit 2 */}
                        <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-transform duration-300 hover:-translate-y-2">
                            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Users2 className="text-indigo-600 dark:text-indigo-400 w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white flex items-center gap-2">Global Network</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Unparalleled access to heads of state, industry titans, and local leaders.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
