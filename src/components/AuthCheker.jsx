import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import getCurrentUser from "../utils/getCurrentUser";
import axios from "axios";
import { API_URL } from "../apiPath";

const AuthChecker = () => {
  const currentUser = getCurrentUser();
  const location = useLocation();

  const removeCurrentUser = () => {
    localStorage.removeItem("currentUser");
    alert("Your session has expired, please login again.");
    setTimeout(() => {
      window.location.reload(); // Reload the page to reflect the logout
    }, 1000);
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (!currentUser || !currentUser.token) return; // Skip if no user or token

      try {
        await axios.get(`${API_URL}/auth/validate`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`, // Include token in the request
          },
        });
      } catch (err) {
        // Only remove the user if the error is due to authentication (401)
        if (err.response?.status === 401) {
          removeCurrentUser();
        } else {
          console.error("Error during authentication check:", err);
        }
      }
    };

    checkAuth();
  }, [location, currentUser]); // Runs on route change or when currentUser changes

  return null;
};

export default AuthChecker;
