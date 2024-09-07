import useAuth from '@/hooks/useAuth'
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
    const { auth } = useAuth();
    console.log("Auth is: ", auth);
    
    const location = useLocation();

    return (
        auth?.accessToken 
            ? <Outlet /> 
            : auth?.username
                ? <Navigate to="/unauthorized" state={{from: location}} replace />
                : <Navigate to="/auth" state={{from: location}} replace />
    )
}

export default ProtectedRoute;