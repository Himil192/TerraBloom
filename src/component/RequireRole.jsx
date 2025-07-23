import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireRole = ({ userRole, allowedRole, children }) => {
    if (userRole !== allowedRole) {
        return <Navigate to="/not-authorized" />;
    }
    return children;
};

export default RequireRole;
