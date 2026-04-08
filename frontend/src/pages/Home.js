import PublicNavbar from "../components/layout/PublicNavbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/home/HeroSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import FeaturesBento from "../components/home/FeaturesBento";
import CTASection from "../components/home/CTASection";

export default function Home() {
    return (
        <div className="font-sans bg-slate-50 dark:bg-[#0b1121] text-slate-900 dark:text-white min-h-screen selection:bg-blue-600/30">
            <PublicNavbar />
            <main>
                <HeroSection />
                <HowItWorksSection />

                <FeaturesBento />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
}
