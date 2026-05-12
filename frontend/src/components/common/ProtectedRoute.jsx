import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../../utils/auth';

/**
 * ProtectedRoute — wraps a route with auth + optional role guard.
 *
 * Props:
 *   role?: 'ADMIN' | undefined
 *     - If 'ADMIN', redirects non-admins to /dashboard
 *     - If omitted, any authenticated user may pass
 *
 * Usage:
 *   <ProtectedRoute><Dashboard /></ProtectedRoute>
 *   <ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>
 */
export default function ProtectedRoute({ children, role }) {
    // 1. Not logged in at all → back to login
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // 2. Admin-only route but user is not admin → back to their dashboard
    if (role === 'ADMIN' && !isAdmin()) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
