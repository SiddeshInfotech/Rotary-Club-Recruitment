import { FileText, Edit2 } from "lucide-react";

// Welcome widget with interactive hover states and CSS shimmer
export default function WelcomeCard() {
    return (
        <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative overflow-hidden h-full flex flex-col justify-between hover:shadow-xl hover:border-blue-100 transition-all duration-500">
            {/* Ambient Background Graphic Layer Animation */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight group-hover:text-blue-900 transition-colors duration-300">
                        Welcome back, Alex!
                    </h1>
                    <span className="text-[11px] font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100 shadow-sm shadow-blue-500/10">
                        Dependable Guardian
                    </span>
                </div>

                <p className="text-gray-500 text-[15px] mt-3 leading-relaxed max-w-2xl group-hover:text-gray-600 transition-colors">
                    Your EQ profile is actively matching you with recruiters who value reliability 
                    and structured problem-solving. Keep exploring opportunities!
                </p>
            </div>

            <div className="mt-8 bg-[#f8fafc] rounded-xl p-5 border border-gray-100 relative z-10 group-hover:bg-white group-hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <span className="text-[13px] font-semibold text-gray-900">Profile Completion</span>
                        <p className="text-[11px] text-gray-500 mt-0.5">Add your resume to reach 100%</p>
                    </div>
                    <span className="text-blue-600 font-bold text-sm">85%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-5 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full relative overflow-hidden" style={{ width: "85%" }}>
                        <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="px-5 py-2 flex items-center gap-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 hover:-translate-y-0.5 transition-all shadow-sm">
                        <FileText className="w-3.5 h-3.5" /> Upload Resume
                    </button>

                    <button className="px-5 py-2 flex items-center gap-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:-translate-y-0.5 transition-all shadow-sm">
                        <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                    </button>
                </div>
            </div>

        </div>
    );
}