import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingScreen } from './LoadingScreen.tsx';

const ProtectedRouteWrapper = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, isLoading } = useSelector((state: any) => state.auth);
    const location = useLocation();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRouteWrapper;