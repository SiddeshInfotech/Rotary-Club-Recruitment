import { Disc3 } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
    return (
        <section id="join" className="py-24 px-6 lg:px-8 bg-slate-50 dark:bg-[#0b1121]">
            <div className="max-w-7xl mx-auto">
                <div className="bg-slate-900 dark:bg-blue-900 text-white rounded-[2.5rem] p-12 md:p-24 relative overflow-hidden text-center shadow-2xl">
                    
                    {/* Background glow for dark mode effect inside */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-700/50 to-indigo-900/80 mix-blend-overlay"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
                    
                    <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                        <Disc3 className="w-16 h-16 text-blue-400 mb-8 opacity-80" />
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 font-serif leading-tight">
                            Ready to curate change?
                        </h2>
                        <p className="text-xl text-slate-300 dark:text-blue-100 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                            Invitations are currently open for established leaders and emerging innovators. Start your journey into the elite network today.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto">
                            <Link to="/register" className="bg-transparent border-2 border-slate-700 hover:border-slate-500 dark:border-blue-400/30 dark:hover:border-blue-400 dark:bg-blue-900/20 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all backdrop-blur-sm">
                                Join Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
