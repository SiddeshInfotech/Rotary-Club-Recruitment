import React from "react";
import PublicNavbar from "../../components/layout/PublicNavbar";

export default function PrivacyPolicy() {
    return (
        <div className="bg-white min-h-screen font-sans">
            <PublicNavbar />
            
            <div className="max-w-3xl mx-auto px-6 py-20 lg:py-32">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-[#1a2b4b] mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-gray-500 font-medium">Last updated: April 6, 2026</p>
                </div>

                <div className="prose prose-blue max-w-none text-gray-700 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-[#1a2b4b] mb-4">1. Information we collect</h2>
                        <p className="leading-relaxed">
                            When you register an account with EQ-Hire, we collect basic contact information alongside your professional history. As our platform focuses heavily on emotional intelligence indexing, we also aggregate the behavioral data drawn directly from your completed EQ Assessments and situational simulations. 
                        </p>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold text-[#1a2b4b] mb-4">2. Processing of Behavioral Data</h2>
                        <p className="leading-relaxed">
                            Your "Core DNA" metrics and other psychometric scoring are processed entirely anonymously by our systems to generate standardized percentiles. Individual simulation answers are never shared directly with recruiters—only the resulting competency radar charts and matching matrices.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#1a2b4b] mb-4">3. Data Sharing with Partner Clubs</h2>
                        <p className="leading-relaxed">
                            By joining the Rotary Directory or applying for positions, you consent to your public profile (excluding raw assessment data) being indexed by verified Rotaract and Rotary affiliated recruitment officers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#1a2b4b] mb-4">4. Your Rights</h2>
                        <p className="leading-relaxed">
                            You maintain full ownership of your data profile. Under GDPR and CCPA guidelines, you may request a full export of your assessment data or total account deletion within your Account Settings panel at any time.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
