// src/common/AuthRedirect.tsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { LoadingScreen } from './LoadingScreen';

const AuthRedirect = () => {
    const { isAuthenticated, isLoading } = useSelector((state: any) => state.auth);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return isAuthenticated ?
        <Navigate to="/presale" replace /> :
        <Navigate to="/login" replace />;
};

export default AuthRedirect;