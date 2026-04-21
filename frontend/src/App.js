import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import CandidateDashboard from "./pages/candidate/Dashboard";
import Matches from "./pages/candidate/Matches";
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import JobSearch from "./pages/candidate/JobSearch";

import JobDetail from "./pages/candidate/JobDetail";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import CandidateSettings from "./pages/candidate/Settings";
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

import RecruiterCandidateSearch from "./pages/recruiter/CandidateSearch";
import RecruiterPostJob from "./pages/recruiter/PostJob";
import RecruiterMessages from "./pages/recruiter/Messages";
import RecruiterSettings from "./pages/recruiter/Settings";
import RecruiterInterviews from "./pages/recruiter/Interviews";

import CommunityFeed from "./pages/CommunityFeed";
import ContactSupport from "./pages/ContactSupport";
import ClubDirectory from "./pages/ClubDirectory";
import SuccessStories from "./pages/SuccessStories";
import SuccessStoryDetails from "./pages/SuccessStoryDetails";
import MemberDirectory from "./pages/MemberDirectory";
import MembershipUpgrade from "./pages/MembershipUpgrade";
import ClubDetails from "./pages/ClubDetails";


// Shared Utilities
import GlobalSearch from "./pages/shared/GlobalSearch";
import Notifications from "./pages/shared/Notifications";
import PrivacyPolicy from "./pages/shared/PrivacyPolicy";
import FAQ from "./pages/shared/FAQ";

import NotFound from "./pages/NotFound";
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
          <Route path="/job-search" element={<JobSearch />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/profile" element={<CandidateProfile />} />
          <Route path="/settings" element={<CandidateSettings />} />
          <Route path="/network" element={<Network />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/growth" element={<Growth />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/eq-journey" element={<EQJourney />} />
          <Route path="/eq-assessment" element={<EQAssessment />} />
          <Route path="/recruiter/id" element={<RecruiterProfile />} />
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/recruiter/interviews" element={<RecruiterInterviews />} />
          <Route path="/recruiter/search" element={<RecruiterCandidateSearch />} />
          <Route path="/recruiter/post-job" element={<RecruiterPostJob />} />
          <Route path="/recruiter/messages" element={<RecruiterMessages />} />
          <Route path="/recruiter/settings" element={<RecruiterSettings />} />
          <Route path="/community-feed" element={<CommunityFeed />} />
          <Route path="/support" element={<ContactSupport />} />
          <Route path="/clubs" element={<ClubDirectory />} />
          <Route path="/clubs/:id" element={<ClubDetails />} />
          <Route path="/members" element={<MemberDirectory />} />
          <Route path="/membership/upgrade" element={<MembershipUpgrade />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/success-stories/:id" element={<SuccessStoryDetails />} />


          <Route path="/search" element={<GlobalSearch />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<FAQ />} />

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;