import RecruiterNavbar from "../components/layout/RecruiterNavbar";

// Wrapper layout for all recruiter pages
export default function RecruiterLayout({ children }) {
    return (
        <div className="bg-[#f0f4f8] min-h-screen font-sans">
            <RecruiterNavbar />
            <div className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </div>
        </div>
    );
}
