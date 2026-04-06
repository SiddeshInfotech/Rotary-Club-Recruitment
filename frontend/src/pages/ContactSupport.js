import React from "react";
import PublicNavbar from "../components/layout/PublicNavbar";
import { LifeBuoy, Mail, Phone, MessageCircle } from "lucide-react";

export default function ContactSupport() {
    return (
        <div className="bg-[#f0f4f8] min-h-screen font-sans">
            <PublicNavbar />
            
            <div className="bg-[#1a2b4b] pt-16 pb-24 text-center text-white relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 px-6 max-w-2xl mx-auto">
                    <LifeBuoy className="w-12 h-12 mx-auto text-cyan-400 mb-4" />
                    <h1 className="text-4xl font-bold mb-4">Concierge Support Center</h1>
                    <p className="text-cyan-100 text-lg">We're here to help you navigate your EQ-Hire journey. Reach out anytime.</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-20 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-6 h-6 text-cyan-600" />
                        </div>
                        <h3 className="font-bold text-[#1a2b4b] mb-2">Email Support</h3>
                        <p className="text-sm text-gray-500 mb-4">Send us a detailed message. We aim to reply within 24 hours.</p>
                        <a href="mailto:support@eq-hire.rotary" className="text-cyan-600 font-semibold text-sm hover:underline">support@eq-hire.rotary</a>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Phone className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-[#1a2b4b] mb-2">Phone Lines</h3>
                        <p className="text-sm text-gray-500 mb-4">Speak directly with our onboarding specialists available 9-5 EST.</p>
                        <a href="tel:+18001234567" className="text-blue-600 font-semibold text-sm hover:underline">+1 (800) 123-4567</a>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h3 className="font-bold text-[#1a2b4b] mb-2">Live Chat</h3>
                        <p className="text-sm text-gray-500 mb-4">For quick questions. Available immediately on the website.</p>
                        <button className="text-emerald-600 font-semibold text-sm hover:underline">Start a chat</button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-xl font-bold text-[#1a2b4b] mb-6">Send us a message</h2>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input type="email" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="john@example.com" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="How can we help?" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea rows="5" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" placeholder="Provide details here..."></textarea>
                        </div>
                        <button type="button" className="bg-[#1a2b4b] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#243a5e] transition-colors w-full sm:w-auto shadow-md">
                            Submit Request
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
