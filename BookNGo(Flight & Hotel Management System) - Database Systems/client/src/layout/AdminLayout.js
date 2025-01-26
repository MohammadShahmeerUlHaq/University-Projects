import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

function Layout() {
    const location = useLocation();

    // Conditions to hide the navbar (e.g., for login/register pages)
    const hideNavbar = ["/admin/login", "/signup"].includes(location.pathname);

    // Conditions to hide the footer
    
    return (
        <>
            {!hideNavbar && <NavbarAdmin />}   {/* Show Navbar unless the current path is in hideNavbar */}
            <div className="layout-content"> {/* Add this wrapper div */}
                <Outlet />                    {/* This will render the child route elements */}
            </div>
              
        </>
    );
}

export default Layout;
