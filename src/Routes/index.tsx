import { Routes, Route } from 'react-router-dom';
import { protectedRoutes, publicRoutes } from './allRoutes';
import Layout from '../Layout';
import NonLayout from '../Layout/NonLayout';
import ProtectedRouteWrapper from '@Common/ProtectedRouteWrapper';
import AuthRedirect from '@Common/AuthRedirect';
import Error404 from "../pages/Error404.tsx";

const Routing = () => {
    return (
        <Routes>
            {/* Root path - auto redirects based on auth */}
            <Route path="/" element={<AuthRedirect />} />

            {/* Public routes */}
            {publicRoutes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<NonLayout>{route.component}</NonLayout>}
                />
            ))}

            {/* Protected routes */}
            {protectedRoutes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={
                        <ProtectedRouteWrapper>
                            <Layout>{route.component}</Layout>
                        </ProtectedRouteWrapper>
                    }
                />
            ))}

            {/* Catch-all route */}
            <Route path="*" element={<NonLayout><Error404 /></NonLayout>} />
        </Routes>
    );
};

export default Routing;