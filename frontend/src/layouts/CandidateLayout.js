import Navbar from "../components/layout/Navbar";

export default function CandidateLayout({ children }) {
    return (
        <div>
            <Navbar />
            <div className="p-6">{children}</div>
        </div>
    )
}