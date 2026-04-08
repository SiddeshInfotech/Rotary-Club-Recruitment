import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // If logged in but wrong role, redirect to their own dashboard
        return <Navigate to={user?.role === 'recruiter' ? '/recruiter' : '/candidate'} replace />;
    }

    return children;
}
