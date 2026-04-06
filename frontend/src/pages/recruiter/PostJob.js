import React from "react";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import { Plus, Briefcase, MapPin, AlignLeft, Tags, ArrowRight } from "lucide-react";

export default function PostJob() {
    return (
        <RecruiterLayout>
            <div className="max-w-3xl mx-auto space-y-8 pb-10">
                <div>
                    <h1 className="text-2xl font-bold text-[#1a2b4b]">Post a New Job</h1>
                    <p className="text-sm text-gray-500 mt-1">Fill out the details below to create a new job listing.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 space-y-6">
                        
                        {/* Job Title */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <Briefcase className="w-4 h-4 text-cyan-600" /> Job Title
                            </label>
                            <input 
                                type="text" 
                                placeholder="e.g. Senior Frontend Developer" 
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all text-sm"
                            />
                        </div>

                        {/* Location and Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 text-cyan-600" /> Location
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. San Francisco, CA or Remote" 
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Tags className="w-4 h-4 text-cyan-600" /> Employment Type
                                </label>
                                <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all text-sm bg-white">
                                    <option value="">Select type...</option>
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="contract">Contract</option>
                                    <option value="internship">Internship</option>
                                </select>
                            </div>
                        </div>

                        {/* EQ Requirements */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <Plus className="w-4 h-4 text-cyan-600" /> Key EQ Traits Expected
                            </label>
                            <div className="p-4 rounded-lg bg-cyan-50/50 border border-cyan-100 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {["Empathy", "Leadership", "Resilience", "Adaptability", "Collaboration", "Strategic Thinking"].map(trait => (
                                    <label key={trait} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                        <input type="checkbox" className="rounded text-cyan-600 focus:ring-cyan-500" />
                                        {trait}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <AlignLeft className="w-4 h-4 text-cyan-600" /> Job Description
                            </label>
                            <textarea 
                                rows={6}
                                placeholder="Describe the responsibilities, requirements, and culture..." 
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all text-sm resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                        <button className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-white hover:text-gray-900 transition-colors">
                            Save as Draft
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1a2b4b] text-white rounded-lg text-sm font-semibold hover:bg-[#243a5e] transition-colors shadow-sm">
                            Publish Job <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </RecruiterLayout>
    );
}
