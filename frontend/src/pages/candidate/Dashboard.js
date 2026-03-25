import CandidateLayout from "../../layouts/CandidateLayout";
import WelcomeCard from "../../components/cards/WelcomeCard";
import EQProfileCard from "../../components/cards/EQProfileCard";
import JobCard from "../../components/cards/JobCard";
import { Filter, Search, MoreVertical } from "lucide-react";

// Main dashboard wrapper - using CSS grid for responsive layout
export default function Dashboard() {
    return (
        <CandidateLayout>

            <div className="space-y-8 pb-10">

                {/* split 2/3 and 1/3 layout for visual hierarchy */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 flex flex-col">
                        <WelcomeCard />
                    </div>
                    <div className="flex flex-col">
                        <EQProfileCard />
                    </div>
                </div>

                {/* Recommended Jobs Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-[17px] font-bold text-gray-900 tracking-tight">
                            Recommended Jobs for You
                        </h2>
                        <span className="text-sm text-blue-600 font-medium hover:underline cursor-pointer flex items-center gap-1">
                            View all matches <span className="text-lg leading-none">&rarr;</span>
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <JobCard 
                            title="Senior Frontend Developer" company="TechNova Solutions"
                            match={92} location="Remote" type="Full-time" tag1="React.js" tag2="Tailwind"
                            trait="Reliability" logoColor="bg-[#3b82f6]" logoText="TN"
                        />
                        <JobCard 
                            title="UI/UX Designer" company="CloudFront Dynamics"
                            match={88} location="New York, NY" type="Hybrid" tag1="Figma" tag2="Prototyping"
                            trait="Collaboration" logoColor="bg-[#f97316]" logoText="CD"
                        />
                        <JobCard 
                            title="Product Manager" company="Innovate Co."
                            match={76} location="San Francisco, CA" type="Contract" tag1="Agile" tag2=""
                            trait="Leadership" isLowMatch logoColor="bg-[#eab308]" logoText="IC"
                        />
                    </div>
                </div>

                {/* My Applications Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-[17px] font-bold text-gray-900 tracking-tight">My Applications</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input 
                                    type="text" 
                                    placeholder="Search applications..." 
                                    className="border border-gray-200 rounded-md pl-9 pr-3 py-1.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-64"
                                />
                            </div>
                            <button className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                                <Filter className="w-4 h-4" /> Filter
                            </button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <th className="py-4 px-6">JOB TITLE / COMPANY</th>
                                    <th className="py-4 px-6">EQ MATCH</th>
                                    <th className="py-4 px-6">DATE APPLIED</th>
                                    <th className="py-4 px-6">STATUS</th>
                                    <th className="py-4 px-6 text-right">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {/* Row 1 */}
                                <tr className="hover:bg-blue-50/50 transition-colors group cursor-pointer">
                                    <td className="py-4 px-6 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-600 flex justify-center items-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">DL</div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">Frontend Web Developer</p>
                                            <p className="text-xs text-gray-500 mt-0.5">DataLogic Systems</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-[#10B981]">89%</span>
                                            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="bg-[#10B981] h-full rounded-full relative overflow-hidden" style={{width: '89%'}}>
                                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="text-sm text-gray-900">Oct 12, 2023</p>
                                        <p className="text-xs text-gray-500 mt-0.5">2 days ago</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-100 group-hover:bg-yellow-100 transition-colors">
                                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 group-hover:animate-pulse"></span> Under Review
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-gray-400 group-hover:text-blue-600 transition-colors inline-flex align-middle justify-end w-full">
                                            <span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-semibold text-xs mr-2 flex items-center">View</span>
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                                {/* Row 2 */}
                                <tr className="hover:bg-blue-50/50 transition-colors group cursor-pointer border-t border-gray-100">
                                    <td className="py-4 px-6 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-md bg-purple-50 text-purple-600 flex justify-center items-center font-bold text-sm group-hover:bg-purple-600 group-hover:text-white transition-colors">NX</div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900 group-hover:text-purple-600 transition-colors">React Native Engineer</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Nexus Innovations</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-[#10B981]">94%</span>
                                            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="bg-[#10B981] h-full rounded-full relative overflow-hidden" style={{width: '94%'}}>
                                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="text-sm text-gray-900">Oct 05, 2023</p>
                                        <p className="text-xs text-gray-500 mt-0.5">1 week ago</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100 group-hover:bg-green-100 transition-colors">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:animate-pulse"></span> Shortlisted
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-gray-400 group-hover:text-purple-600 transition-colors inline-flex align-middle justify-end w-full">
                                            <span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-semibold text-xs mr-2 flex items-center">View</span>
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                                {/* Row 3 */}
                                <tr className="hover:bg-blue-50/50 transition-colors group cursor-pointer border-t border-gray-100">
                                    <td className="py-4 px-6 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-md bg-gray-100 text-gray-600 flex justify-center items-center font-bold text-sm group-hover:bg-gray-800 group-hover:text-white transition-colors">AC</div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900 group-hover:text-gray-700 transition-colors">Junior UI Developer</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Apex Corp</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-[#F59E0B]">72%</span>
                                            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="bg-[#F59E0B] h-full rounded-full relative overflow-hidden" style={{width: '72%'}}>
                                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="text-sm text-gray-900">Sep 28, 2023</p>
                                        <p className="text-xs text-gray-500 mt-0.5">2 weeks ago</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200 group-hover:bg-gray-200 transition-colors">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:animate-pulse"></span> Application Sent
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-gray-400 group-hover:text-gray-600 transition-colors inline-flex align-middle justify-end w-full">
                                            <span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-semibold text-xs mr-2 flex items-center">View</span>
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination Footer */}
                    <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#f8fafc]">
                        <span className="text-xs text-gray-500">Showing 1 to 3 of 12 entries</span>
                        <div className="flex bg-white rounded-md shadow-sm border border-gray-200 text-sm overflow-hidden">
                            <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 font-medium transition-colors">Prev</button>
                            <button className="px-3 py-1.5 bg-blue-600 text-white font-medium border-x border-blue-600">1</button>
                            <button className="px-3 py-1.5 text-gray-700 hover:bg-gray-50 border-r border-gray-200 font-medium transition-colors">2</button>
                            <button className="px-3 py-1.5 text-gray-700 hover:bg-gray-50 border-r border-gray-200 font-medium transition-colors">3</button>
                            <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 font-medium transition-colors">Next</button>
                        </div>
                    </div>
                </div>

            </div>

        </CandidateLayout>
    );
}