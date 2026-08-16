import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./index.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const firstName = user?.name ? user.name.split(" ")[0] : "User";
  const userEmail = user?.email || "";

  // Lock body scroll and listen for Escape key when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          setIsDrawerOpen(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isDrawerOpen]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsDrawerOpen(false);
      navigate("/login");
    }
  };

  const handleNavigate = (path) => {
    setIsDrawerOpen(false);
    navigate(path);
  };

  const links = [
    { label: "Home", icon: "🏠", path: "/" },
    { label: "Your Resumes", icon: "📄", path: "/your-resumes" },
    { label: "Analysis History", icon: "🕘", path: "/analysis-history" },
    { label: "Contact", icon: "✉", path: "/contact" },
  ];

  return (
    <>
      <nav className="navbar">
        {/* HAMBURGER BUTTON (TABLET & MOBILE) */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Open navigation menu"
        >
          ☰
        </button>

        {/* LOGO */}
        <div className="navbar-logo" onClick={() => handleNavigate("/")}>
          ResumeATS <span>AI</span>
        </div>

        {/* DESKTOP LINKS (≥ 1024px) */}
        <div className="navbar-links desktop-only">
          {links.map((link) => (
            <button
              key={link.path}
              className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
              onClick={() => handleNavigate(link.path)}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* DESKTOP ACTIONS (≥ 1024px) */}
        <div className="navbar-actions desktop-only">
          {isAuthenticated ? (
            <>
              {firstName && (
                <span className="user-welcome-badge">
                  👋 Welcome, <strong>{firstName}</strong>
                </span>
              )}
              <button className="nav-btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="nav-btn-ghost" onClick={() => handleNavigate("/login")}>
                Login
              </button>
              <button className="nav-btn-primary" onClick={() => handleNavigate("/register")}>
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {/* MOBILE / TABLET SLIDE-IN SIDEBAR DRAWER */}
      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div
            className="drawer-sidebar"
            onClick={(e) => e.stopPropagation()}
            aria-label="Navigation drawer"
          >
            {/* DRAWER HEADER */}
            <div className="drawer-header">
              <div className="drawer-logo" onClick={() => handleNavigate("/")}>
                ResumeATS <span>AI</span>
              </div>
              <button
                className="drawer-close-btn"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close navigation menu"
              >
                ✕
              </button>
            </div>

            {/* DRAWER NAVIGATION LINKS */}
            <div className="drawer-nav-list">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <button
                    key={link.path}
                    className={`drawer-link ${isActive ? "active" : ""}`}
                    onClick={() => handleNavigate(link.path)}
                  >
                    <span className="drawer-link-icon">{link.icon}</span>
                    <span className="drawer-link-text">{link.label}</span>
                  </button>
                );
              })}
            </div>

            {/* DRAWER FOOTER / USER SECTION */}
            <div className="drawer-footer">
              {isAuthenticated ? (
                <>
                  <div className="drawer-user-info">
                    <div className="user-avatar">👤</div>
                    <div className="user-text">
                      <span className="user-name">{firstName || "User"}</span>
                      {userEmail && <span className="user-email">{userEmail}</span>}
                    </div>
                  </div>
                  <button className="drawer-logout-btn" onClick={handleLogout}>
                    <span>🚪 Logout</span>
                  </button>
                </>
              ) : (
                <div className="drawer-auth-btns">
                  <button className="nav-btn-ghost" onClick={() => handleNavigate("/login")}>
                    Login
                  </button>
                  <button className="nav-btn-primary" onClick={() => handleNavigate("/register")}>
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;