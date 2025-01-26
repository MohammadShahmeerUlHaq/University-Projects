import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios"; // For making API calls

export const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap your app and provide auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  async function settingUser() {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.log("No token found, stopping loading...");
      setLoading(false); // No token, stop loading and return early
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/authenticate",
        { token: storedToken }
      );
      console.log("Auth context:", response?.data);
      setUser({ token: storedToken, username: response?.data?.data });
    } catch (error) {
      if(error?.response?.data?.error=='Invalid or expired token.'){
        logout();
        return;
      }
      console.error("Error authenticating user:", error);
      setUser({ token: storedToken }); // In case of failure, still set the token
    } finally {
      setLoading(false); // Ensure loading is false no matter what
    }
  }

  // Simulating an auth check on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken === null) {
      console.log("Stored token is null, no API call needed.");
      setLoading(false); // If there's no token, stop loading
    } else {
      console.log("Stored token found:", storedToken);
      settingUser(); // Call the async function to authenticate the user
    }
  }, []); // This effect runs only once when the component mounts

  const login = async (token) => {
    // Save the token to localStorage
    localStorage.setItem("token", token);

    // Send a POST request to authenticate the user with the token
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/authenticate",
        { token }
      );
      console.log("Auth context:", response.data);
      setUser({ token, username: response.data.data });
    } catch (error) {
      console.error("Error authenticating user:", error);
      setUser({ token }); // In case of failure, still set the token
    }
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setUser(null); // Clear the user state
    
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Only render children when loading is false */}
    </AuthContext.Provider>
  );
};
