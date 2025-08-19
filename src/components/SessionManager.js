// components/SessionManager.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionManager = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      const loginTime = localStorage.getItem("loginTime");
      const TWELVE_HOURS = 12 * 60 * 60 * 1000;

      if (loginTime && Date.now() - Number(loginTime) > TWELVE_HOURS) {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/signin");
      }
    };

    checkSession();

    const interval = setInterval(checkSession, 60 * 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  return null; // nothing to render
};

export default SessionManager;
