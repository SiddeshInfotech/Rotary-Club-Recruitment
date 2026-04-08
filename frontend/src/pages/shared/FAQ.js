import React from "react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import { Search, ChevronDown } from "lucide-react";

export default function FAQ() {
    const defaultFaqs = [
        {
            q: "How does the EQ Assessment matching algorithm work?",
            a: "Our algorithm calculates structural distances between your generated Emotional Intelligence (EQ) 'Core DNA' profile and the ideal behavioral traits mapped out by recruiters for a specific role. Rather than sorting purely by years of experience, we weight empathy, strategic thinking, and resilience scores."
        },
        {
            q: "Who can see my internal assessment results?",
            a: "Only you. Employers and Rotary Clubs only see the high-level match percentage and aggregate 'radar' charts. The specific answers you provide to behavioral simulation questions remain completely private and encrypted."
        },
        {
            q: "How much does a recruiter account cost for my Club?",
            a: "Standard Rotary club listings are entirely free. We offer a 'Professional' tier ($12/month) for advanced analytics and priority search placement, and an 'Organization' tier for district-level management."
        },
        {
            q: "Can I take the EQ Assessment more than once?",
            a: "Yes. Emotional Intelligence is a skill that develops over time. You are permitted to re-take the behavioral simulation tests every 90 days to update your Core DNA profile."
        }
    ];

    return (
        <div className="bg-[#f0f4f8] shadow-inner min-h-screen font-sans">
            <PublicNavbar />
            
            <div className="bg-[#1a2b4b] py-20 text-center px-6">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">How can we help?</h1>
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search for answers..."
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl font-medium focus:outline-none shadow-lg text-lg border-none"
                    />
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {defaultFaqs.map((faq, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer group hover:border-blue-300 transition-colors">
                                <div className="flex justify-between items-center gap-4">
                                    <h3 className="font-bold text-lg text-[#1a2b4b] group-hover:text-blue-600 transition-colors">{faq.q}</h3>
                                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                                </div>
                                {/* Show body text. In a real app this would collapse/expand via state */}
                                <p className="mt-4 text-gray-600 leading-relaxed font-medium pb-2 border-t border-gray-50 pt-4">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center shadow-sm">
                    <h3 className="text-xl font-bold text-[#1a2b4b] mb-2">Still need help?</h3>
                    <p className="text-gray-500 mb-6">Our concierge support team is online 24/7.</p>
                    <a href="/support" className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-sm hover:bg-blue-700 transition-colors">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
