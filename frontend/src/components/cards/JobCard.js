import { MapPin, Briefcase, ArrowRight } from "lucide-react";

// Reusable job card component with dynamic styling based on match %
export default function JobCard({ title, company, match, location, type, tag1, tag2, trait, isLowMatch, logoColor, logoText }) {
    const isHighMatch = match >= 85;
    const matchColor = isHighMatch ? "text-[#10B981]" : isLowMatch ? "text-[#F59E0B]" : "text-blue-600";
    const ringColor = isHighMatch ? "border-[#10B981]" : isLowMatch ? "border-[#F59E0B]" : "border-blue-600";
    const bgColor = isHighMatch ? "bg-[#ecfdf5]" : isLowMatch ? "bg-[#fffbeb]" : "bg-blue-50";

    return (
        <div className="group bg-white p-5 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 relative overflow-hidden">
            {/* Ambient hover glow (invisible until hovered) */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2"></div>
            
            {/* Top */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-lg ${logoColor || "bg-gray-100"} flex-shrink-0 flex items-center justify-center font-bold text-white text-sm shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                        {logoText || "TN"}
                    </div>
                    <div>
                        <h3 className="font-bold text-[15px] text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                            {title || "Senior Frontend Developer"}
                        </h3>
                        <p className="text-[13px] text-gray-500 mt-0.5">
                            {company || "TechNova Solutions"}
                        </p>
                    </div>
                </div>

                {/* Match Badge - Circle Layout */}
                <div className={`w-[46px] h-[46px] flex flex-col justify-center items-center rounded-full border-[3px] ${ringColor} ${bgColor} flex-shrink-0 group-hover:shadow-md transition-shadow`}>
                    <span className={`text-[13px] font-bold leading-none ${matchColor}`}>{match}%</span>
                    <span className={`text-[8px] font-bold leading-none mt-0.5 ${matchColor}`}>MATCH</span>
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1 rounded text-[11px] font-medium group-hover:bg-blue-50 transition-colors">
                    <MapPin className="w-3 h-3" /> {location}
                </span>
                <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1 rounded text-[11px] font-medium group-hover:bg-blue-50 transition-colors">
                    <Briefcase className="w-3 h-3" /> {type}
                </span>
                {tag1 && <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded text-[11px] font-medium">{tag1}</span>}
                {tag2 && <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded text-[11px] font-medium">{tag2}</span>}
            </div>

            {/* Bottom */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto relative z-10">
                <span className="text-[11px] text-gray-500 font-medium">
                    Top Trait: <span className="text-gray-900 font-semibold">{trait}</span>
                </span>

                <button className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isLowMatch 
                    ? "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}>
                    {isLowMatch ? "View" : "Apply"}
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 w-0 group-hover:w-3.5" />
                </button>
            </div>
        </div>
    );
}