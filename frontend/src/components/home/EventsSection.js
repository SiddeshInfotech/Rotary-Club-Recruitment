import { MapPin } from "lucide-react";

export default function EventsSection() {
    return (
        <section id="events" className="py-32 bg-white dark:bg-[#0b1121] transition-colors">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-serif">Upcoming Gatherings</h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-3 text-lg">Curated events for the sophisticated leader.</p>
                    </div>
                    <button className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors border-b-2 border-blue-600/30 hover:border-blue-600 pb-1">
                        View All Events
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    
                    {/* Event 1 */}
                    <div className="group cursor-pointer">
                        <div className="aspect-video rounded-3xl overflow-hidden mb-6 relative shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                            <img 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                alt="Modern conference hall" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4p1y4BvR_pAQq7Ipn9eMXzfXb0EUjvitUomqVVLn43czJzCnMakiWbYgoe-rRb-0tclvJQP_XxWCe-7p42ovo4vfeTK9ZwnRKwxrzpnkCqgXHeUundczen1t1Oj0reawtTgneiP4GtW20MVNfjLiCgeIXkXbkUm1-k8zKakj6FlXDeNfJGxVxJAIhsG8oImdneCBrc8Zsol-eu5cd65lAOapUdhk0rmd0zPf4iAlpKejJ4RLDBv9AIWKnyTb8vuLhCeGtWUkr8qM"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <span className="block text-xs font-black text-center text-blue-700 dark:text-blue-400 leading-none mb-1">OCT</span>
                                <span className="block text-2xl font-black text-center text-slate-900 dark:text-white font-serif leading-none">24</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 font-serif tracking-tight">
                            Global Synergy Summit
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" /> London, United Kingdom
                        </p>
                    </div>

                    {/* Event 2 */}
                    <div className="group cursor-pointer">
                        <div className="aspect-video rounded-3xl overflow-hidden mb-6 relative shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                            <img 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                alt="Elegant gala" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7_LbafdVX86dJ5dyes_3zy_9aw8f89Ium0H6UTNFeUgtYkGAKVx5OtrwhWqFfOvd13PhWfdnJwyRUWJvATfcWTvRFx7rxLEr4YyMrhpnZ2E5Z8FjvNemDVby2uY2FnAAE3PNctFxeEp-BQ52ueqEKRDypykiw_CLywKzMUvvJYx29yCZrGHPB51oS8RqTOram8yoXVuF0r8jfqED_f4MSH0HUHnoj6-gqjCTD1gI_cAtRH2akZDz3U00pL9URsyxf8Vgt7o4IWf4"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <span className="block text-xs font-black text-center text-blue-700 dark:text-blue-400 leading-none mb-1">NOV</span>
                                <span className="block text-2xl font-black text-center text-slate-900 dark:text-white font-serif leading-none">12</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 font-serif tracking-tight">
                            The Founders Gala
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" /> New York City, USA
                        </p>
                    </div>

                    {/* Event 3 */}
                    <div className="group cursor-pointer">
                        <div className="aspect-video rounded-3xl overflow-hidden mb-6 relative shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                            <img 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                alt="Retreat" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvmNY772AijXqjPRm0kdy4mJ5Zjtie5CSSIo4Ivw06CWqg8147_T3YpPrG9SNXcqurupb3Kt0pq4T8OWHfYGTE8s3ZtNXEmJng0szPWPjZrrsQwIvXaXfrTrkB4y4rmO2sCxS76Q2QuYvRhP_b6mvhmR4UPZCLOE0Z2DuJNWu4-HiZ-nxaCtZNo0h5qUKhkCsWMf1nib24FFRmik2kGsId4h1wW7xKtH9urNGDLtygQ8NYqCTP09bRsWz6wGzbWGY3kyER2b4k9mk"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <span className="block text-xs font-black text-center text-blue-700 dark:text-blue-400 leading-none mb-1">DEC</span>
                                <span className="block text-2xl font-black text-center text-slate-900 dark:text-white font-serif leading-none">05</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 font-serif tracking-tight">
                            Philanthropy Retreat
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" /> Swiss Alps, Switzerland
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
