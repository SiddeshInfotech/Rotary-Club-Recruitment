import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import CandidateDashboard from "./pages/candidate/Dashboard";
import Matches from "./pages/candidate/Matches";
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import JobSearch from "./pages/candidate/JobSearch";

import JobDetail from "./pages/candidate/JobDetail";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import RecruiterProfile from "./pages/candidate/RecruiterProfile";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";

import Network from "./pages/candidate/Network";
import Referrals from "./pages/candidate/Referrals";
import Growth from "./pages/candidate/Growth";
import Insights from "./pages/candidate/Insights";
import EQJourney from "./pages/candidate/EQJourney";
import EQAssessment from "./pages/candidate/EQAssessment";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/candidate" element={<CandidateDashboard />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/job-search" element={<JobSearch />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/profile" element={<CandidateProfile />} />
          <Route path="/network" element={<Network />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/growth" element={<Growth />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/eq-journey" element={<EQJourney />} />
          <Route path="/eq-assessment" element={<EQAssessment />} />
          <Route path="/recruiter/id" element={<RecruiterProfile />} />
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;