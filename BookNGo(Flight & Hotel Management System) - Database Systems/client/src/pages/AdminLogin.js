import React, { useContext } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBTypography } from "mdb-react-ui-kit";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";  // Import AuthContext
import "../styles/LoginPage.css";

export default function LoginPage() {
    const [loginData, setLoginData] = React.useState({
        userName: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext); // Get login function from context
    React.useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page
      }, []);

   
    async function handleLogin(event) {
        event.preventDefault();
        try {
            if (loginData.userName === "" || loginData.password === "") {
                setErrorMessage("Please enter both username and password.");
                return;
            }

            const response = await axios.post("http://localhost:8000/api/v1/admins/login", {
                userName: loginData.userName,
                password: loginData.password
            });
            navigate('/admin/airlines');

            // const { token } = response.data.data; // Get token from response
            // if (token) {
            //     // Pass only the token to the login function
            //     login(token);
            //     console.log("Login successful. Token: ", token);

                
            // } else {
            //     setErrorMessage("Login failed. Please try again.");
            // }
        } catch (error) {
            console.error('Error during login:', error);
            if (error.response) {
                setErrorMessage(error.response?.data?.error || "Invalid username or password.");
            } else {
                setErrorMessage("Something went wrong. Please try again later.");
            }
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setLoginData((prevLoginData) => ({
            ...prevLoginData,
            [name]: value
        }));
    }

 
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <MDBContainer fluid className="login-page d-flex align-items-center justify-content-center" style={{ height: "100vh", backgroundColor: "#f4f4f9" }}>
            <MDBRow className="w-100">
                <MDBCol md="6" className="d-flex flex-column justify-content-center align-items-start p-5">
                    <MDBTypography tag="h1" className="appTitle" style={{ color: "#003049", fontSize: "5rem" }}>BOOKNGO</MDBTypography>
                    <MDBTypography tag="h2" className="appTagline" style={{ color: "#669bbc", fontSize: "1.5rem" }}>
                        Book Easy, Travel Happy – Your Ultimate Travel Companion!
                    </MDBTypography>
                </MDBCol>
                <MDBCol md="6" className="d-flex justify-content-center align-items-center p-5">
                    <div className="login" style={{ backgroundColor: "#fff", borderRadius: "0.8rem", boxShadow: "0 0.4rem 0.8rem rgba(0, 0, 0, 0.1)", padding: "2.5rem", width: "100%", maxWidth: "28rem" }}>
                        <form onSubmit={handleLogin} className="login-form">
                            <MDBInput
                                label="User Name or Email"
                                type="text"
                                name="userName"
                                value={loginData.userName}
                                onChange={handleChange}
                                required
                                style={{ marginBottom: "1.5rem" }}
                                className="input-fields-form"
                            />
                            <div className="password-container position-relative" style={{ marginBottom: "1.5rem" }}>
                                <MDBInput
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    required
                                    className="input-fields-form"
                                />
                                <div className="eye-icon" onClick={togglePasswordVisibility} style={{ position: 'absolute', right: '1rem', top: '20%', cursor: 'pointer', color: '#666' }}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                            {errorMessage && <p className="error" style={{ color: "#d9534f", fontSize: "0.85rem", fontWeight: 600 }}>{errorMessage}</p>}
                            <MDBBtn type="submit" color="success" className="w-100 mb-3 button-field-form">Login</MDBBtn>
                            
                        </form>
                    </div>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}
