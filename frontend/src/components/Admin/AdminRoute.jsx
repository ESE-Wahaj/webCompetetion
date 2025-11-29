import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-whisper-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Admin privileges required.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
