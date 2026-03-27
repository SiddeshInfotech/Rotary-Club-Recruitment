import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CandidateDashboard from "./pages/candidate/Dashboard";
import Matches from "./pages/candidate/Matches";
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import JobSearch from "./pages/candidate/JobSearch";
import JobDetail from "./pages/candidate/JobDetail";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import RecruiterProfile from "./pages/candidate/RecruiterProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CandidateDashboard />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/job-search" element={<JobSearch />} />
        <Route path="/job/:id" element={<JobDetail />} />
        <Route path="/profile" element={<CandidateProfile />} />
        <Route path="/recruiter/:id" element={<RecruiterProfile />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;