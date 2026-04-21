import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import CandidateDashboard from "./pages/candidate/Dashboard";
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
import ResetPassword from './pages/ResetPassword';
import VerifyResetOtp from './pages/VerifyResetOtp';

import Network from "./pages/candidate/Network";
import Referrals from "./pages/candidate/Referrals";
import Growth from "./pages/candidate/Growth";
import Insights from "./pages/candidate/Insights";
import EQJourney from "./pages/candidate/EQJourney";
import EQAssessment from "./pages/candidate/EQAssessment";
import PremiumPricing from "./pages/candidate/PremiumPricing";
import PremiumCheckout from "./pages/candidate/PremiumCheckout";
import CandidateMessages from "./pages/candidate/Messages";

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
import AdminDashboard from "./pages/admin/Dashboard";

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
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
         <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />

          {/* Protected Candidate Routes */}
          <Route path="/candidate" element={<ProtectedRoute allowedRoles={["candidate"]}><CandidateDashboard /></ProtectedRoute>} />
          <Route path="/job-search" element={<ProtectedRoute allowedRoles={["candidate"]}><JobSearch /></ProtectedRoute>} />
          <Route path="/job/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><CandidateProfile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><CandidateSettings /></ProtectedRoute>} />
          <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
          <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
          <Route path="/growth" element={<ProtectedRoute><Growth /></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
          <Route path="/eq-journey" element={<ProtectedRoute><EQJourney /></ProtectedRoute>} />
          <Route path="/eq-assessment" element={<ProtectedRoute><EQAssessment /></ProtectedRoute>} />
          <Route path="/premium/pricing" element={<ProtectedRoute allowedRoles={["candidate"]}><PremiumPricing /></ProtectedRoute>} />
          <Route path="/premium/checkout" element={<ProtectedRoute allowedRoles={["candidate"]}><PremiumCheckout /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute allowedRoles={["candidate"]}><CandidateMessages /></ProtectedRoute>} />

          {/* Protected Recruiter Routes */}
          <Route path="/recruiter/id" element={<ProtectedRoute><RecruiterProfile /></ProtectedRoute>} />
          <Route path="/recruiter" element={<ProtectedRoute allowedRoles={["recruiter"]}><RecruiterDashboard /></ProtectedRoute>} />
          <Route path="/recruiter/interviews" element={<ProtectedRoute allowedRoles={["recruiter"]}><RecruiterInterviews /></ProtectedRoute>} />
          <Route path="/recruiter/search" element={<ProtectedRoute allowedRoles={["recruiter"]}><RecruiterCandidateSearch /></ProtectedRoute>} />
          <Route path="/recruiter/post-job" element={<ProtectedRoute allowedRoles={["recruiter"]}><RecruiterPostJob /></ProtectedRoute>} />
          <Route path="/recruiter/messages" element={<ProtectedRoute allowedRoles={["recruiter"]}><RecruiterMessages /></ProtectedRoute>} />
          <Route path="/recruiter/settings" element={<ProtectedRoute allowedRoles={["recruiter"]}><RecruiterSettings /></ProtectedRoute>} />

          {/* Protected Community Routes */}
          <Route path="/community-feed" element={<ProtectedRoute><CommunityFeed /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><ContactSupport /></ProtectedRoute>} />
          <Route path="/clubs" element={<ProtectedRoute><ClubDirectory /></ProtectedRoute>} />
          <Route path="/clubs/:id" element={<ProtectedRoute><ClubDetails /></ProtectedRoute>} />
          <Route path="/members" element={<ProtectedRoute><MemberDirectory /></ProtectedRoute>} />
          <Route path="/membership/upgrade" element={<ProtectedRoute><MembershipUpgrade /></ProtectedRoute>} />
          <Route path="/success-stories" element={<ProtectedRoute><SuccessStories /></ProtectedRoute>} />
          <Route path="/success-stories/:id" element={<ProtectedRoute><SuccessStoryDetails /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />

          <Route path="/search" element={<ProtectedRoute><GlobalSearch /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
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