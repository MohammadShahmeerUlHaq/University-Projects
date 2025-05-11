import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";  

function Layout() {
    const location = useLocation();

    // Conditions to hide the navbar (e.g., for login/register pages)
    const hideNavbar = ["/login", "/signup"].includes(location.pathname);

    // Conditions to hide the footer
    const hideFooter = ["/login", "/signup"].includes(location.pathname);

    return (
        <>
            {!hideNavbar && <Navbar />}   {/* Show Navbar unless the current path is in hideNavbar */}
            <div className="layout-content"> {/* Add this wrapper div */}
                <Outlet />                    {/* This will render the child route elements */}
            </div>
            {!hideFooter && <Footer />}  
        </>
    );
}

export default Layout;
