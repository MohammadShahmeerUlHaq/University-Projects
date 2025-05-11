import React, { useState } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBTypography } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/SignUpPage.css";
import { useAuth } from "../Context/AuthContext";

export default function SignupPage() {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    userName: "",
    password: "",
    confirmPassword: "",
    cnicOrPassport:""
  });
  React.useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);


  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context

  const handleSignup = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Reset error message before each signup attempt

    if (!signupData.name || !signupData.email || !signupData.phone || !signupData.userName || !signupData.password 
      || !signupData.confirmPassword || !signupData.cnicOrPassport) {
      setErrorMessage("Please fill all the fields.");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true); // Set loading state to true

    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/register", signupData);
      console.log('Response:', response);

      if (response.data.success) {
        alert("Successfully Signed Up! Kindly Login");
        //const { token } = response.data; // Assuming the API returns a token after successful signup
        //localStorage.setItem("username", signupData.userName); // Store username in local storage
        //login(token,signupData.userName); // Log the user in automatically by setting token in context
        navigate("/login"); // Redirect the user to home or the page you prefer
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setErrorMessage(error.response?.data?.error || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSignupData((prevSignupData) => ({
      ...prevSignupData,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <MDBContainer fluid className="signup-page d-flex align-items-center justify-content-center">
      <MDBRow className="w-100">
        <MDBCol md="6" className="left-col">
          <MDBTypography tag="h1" className="appTitle">BOOKNGO</MDBTypography>
          <MDBTypography tag="h2" className="appTagline">
            Join us and start your journey today!
          </MDBTypography>
        </MDBCol>
        <MDBCol md="6" className="right-col">
          <div className="signup-form-container">
            <form onSubmit={handleSignup} className="signup-form">
              <MDBInput
                label="Full Name"
                type="text"
                name="name"
                value={signupData.name}
                onChange={handleChange}
                required
                className="input-fields-form"
              />
              <MDBInput
                label="Email"
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleChange}
                required
                className="input-fields-form"
              />
              <MDBInput
                label="Phone Number"
                type="text"
                name="phone"
                value={signupData.phone}
                onChange={handleChange}
                required
                className="input-fields-form"
              />
              <MDBInput
                label="User Name"
                type="text"
                name="userName"
                value={signupData.userName}
                onChange={handleChange}
                required
                className="input-fields-form"
              />
              <MDBInput
                label="CNIC or Passport"
                type="text"
                name="cnicOrPassport"
                value={signupData.cnicOrPassport}
                onChange={handleChange}
                required
                className="input-fields-form"
              />

              <div className="password-container">
                <MDBInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={signupData.password}
                  onChange={handleChange}
                  required
                  className="input-fields-form"
                />
                <div className="eye-icon" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              <div className="confirm-password-container">
                <MDBInput
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input-fields-form"
                />
                <div className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {errorMessage && <p className="error">{errorMessage}</p>}
              <MDBBtn type="submit" className="w-100 mb-4 button-field-form signup-button" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
              </MDBBtn>
              <MDBBtn type="button" className="w-100 button-field-form" onClick={() => navigate("/login")}>Back to Login</MDBBtn>
            </form>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
