import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
                {/* Decorative gradients */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-70"></div>
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-70"></div>
                
                <div className="relative z-10">
                    <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 shadow-inner border border-white/5">
                        <AlertCircle className="w-10 h-10 text-cyan-400" />
                    </div>
                    
                    <h1 className="text-5xl font-extrabold text-white tracking-tight mb-2">404</h1>
                    <h2 className="text-xl font-bold text-gray-200 mb-4 tracking-tight">Page Not Found</h2>
                    <p className="text-sm text-gray-400 mb-8 leading-relaxed px-4">
                        We couldn't locate the page you're looking for. It might have been moved or doesn't exist anymore.
                    </p>
                    
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
