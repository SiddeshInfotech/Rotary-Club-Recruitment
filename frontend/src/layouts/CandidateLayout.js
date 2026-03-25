import Navbar from "../components/layout/Navbar";

export default function CandidateLayout({ children }) {
    return (
        <div className="bg-[#f8fafc] min-h-screen font-sans">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </div>
        </div>
    );
}