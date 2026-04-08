import { ArrowRight, MessageSquareText, BrainCircuit, Users, Target } from "lucide-react";

export default function FeaturesBento() {
    return (
        <section id="features" className="py-32 bg-slate-100/50 dark:bg-slate-800/20 scroll-mt-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                <div className="mb-16">
                    <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-serif">Platform Capabilities</h2>
                    <div className="h-1 w-20 bg-blue-600 dark:bg-blue-500 rounded-full mt-6"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
                    
                    {/* Big Item - Networking */}
                    <div className="md:col-span-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-10 flex flex-col justify-between shadow-xl shadow-slate-200/30 dark:shadow-blue-900/10 relative overflow-hidden group">
                        <div className="z-10">
                            <span className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold mb-4 block">Connections</span>
                            <h3 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4 font-serif leading-tight">Professional <br/>Networking</h3>
                            <p className="text-slate-600 dark:text-slate-400 max-w-md text-sm lg:text-base leading-relaxed">
                                Build meaningful relationships with industry leaders and peers. Establish your digital footprint and curate an elite professional circle.
                            </p>
                        </div>
                        <div className="mt-8 z-10 flex items-center">
                            <button className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-wider text-xs bg-blue-50 dark:bg-blue-900/30 px-5 py-2.5 rounded-lg">
                                Build Network <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 dark:opacity-5 transform translate-x-1/4 translate-y-1/4 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                            <Users className="w-96 h-96" />
                        </div>
                    </div>
                    
                    {/* Dark/Blue Item - Messaging */}
                    <div className="md:col-span-4 bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-3xl p-10 flex flex-col justify-end shadow-xl shadow-blue-500/20 overflow-hidden relative">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="z-10 bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-10 backdrop-blur-md">
                            <MessageSquareText className="text-white w-8 h-8 fill-white/20" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 font-serif tracking-wide z-10">Messaging System</h3>
                        <p className="text-blue-100 text-sm leading-relaxed z-10">
                            Seamless real-time communication between candidates and recruiters. Schedule interviews, clarify requirements, and negotiate offers all within a secure channel.
                        </p>
                    </div>

                    {/* Gradient Border Item - Brain Profile */}
                    <div className="md:col-span-4 bg-indigo-50 border border-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-950/30 rounded-3xl p-10 shadow-lg shadow-indigo-100/50 dark:shadow-none flex flex-col justify-between">
                        <div>
                            <div className="mb-6">
                                <BrainCircuit className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-black text-indigo-900 dark:text-indigo-300 mb-4 font-serif leading-tight">Brain Inclination <br/>Profile</h3>
                            <p className="text-indigo-800/80 dark:text-indigo-300/80 text-sm leading-relaxed">
                                Our bespoke AI assessment analyzes your emotional intelligence and cognitive tendencies to build a comprehensive candidate footprint.
                            </p>
                        </div>
                    </div>

                    {/* Wide Simple Item - Job Matching */}
                    <div className="md:col-span-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm relative overflow-hidden group">
                        <div className="max-w-sm relative z-10">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-serif tracking-tight">Smart Job Matching</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Leverage machine learning algorithms to pair your specific aptitude and EQ metrics with companies that perfectly align with your cultural needs and technical career trajectories.
                            </p>
                        </div>
                        <div className="relative mt-8 md:mt-0 z-10 bg-slate-50 dark:bg-slate-800 w-24 h-24 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <Target className="w-12 h-12 text-blue-600/80 dark:text-blue-500/80" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
