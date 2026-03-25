import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CandidateDashboard from "./pages/candidate/Dashboard";
import RecruiterDashboard from "./pages/recruiter/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CandidateDashboard />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;