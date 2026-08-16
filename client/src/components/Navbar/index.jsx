import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/authService.js";
import "./index.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authService.getMe();
        if (data && data.user && data.user.name) {
          setIsLoggedIn(true);
          const firstName = data.user.name.split(" ")[0];
          setUserName(firstName);
        } else {
          setIsLoggedIn(true);
        }
      } catch {
        setIsLoggedIn(false);
        setUserName("");
      }
    };

    checkAuth();

    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("authChange", checkAuth);
    };
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggedIn(false);
      setUserName("");
      window.dispatchEvent(new Event("authChange"));
      navigate("/login");
    }
  };

  const links = [
    { label: "Home", path: "/" },
    { label: "Your Resumes", path: "/your-resumes" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        ✦ ResumeATS AI
      </div>

      <div className="navbar-links">
        {links.map((link) => (
          <button
            key={link.path}
            className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
            onClick={() => navigate(link.path)}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div className="navbar-actions">
        {isLoggedIn ? (
          <>
            {userName && (
              <span className="user-welcome-badge">
                👋 Welcome, <strong>{userName}</strong>
              </span>
            )}
            <button className="nav-btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="nav-btn-ghost" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="nav-btn-primary" onClick={() => navigate("/register")}>
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};


export default Navbar;