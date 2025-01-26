import React,{useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext'; 

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const { isAuthenticated} = useContext(AuthContext);
    
    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        navigate("/login", { replace: true });
        return null; // Prevent rendering of the child component
    }

    // If authenticated, render the child components
    return <>{children}</>;
};

export default ProtectedRoute;
