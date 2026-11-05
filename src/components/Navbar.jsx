
import { Link } from "react-router-dom";
import { Scale, Menu, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-icon">
          <Scale size={25} />
        </span>
        <span>
          Legal<span className="brand-gold">Connect</span>
        </span>
      </Link>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/lawyers">Find Lawyers</Link>
        <a href="/#how-it-works">How It Works</a>
      </nav>

      <div className="nav-actions">
        {user ? (
          <>
            <Link to="/profile" className="login-link">
              <UserCircle size={17} />
              Profile
            </Link>

            <button
              type="button"
              className="nav-button"
              onClick={logout}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-link">
              Log In
            </Link>
            <Link to="/register" className="nav-button">
              Get Started
            </Link>
          </>
        )}
      </div>

      <button className="mobile-menu" aria-label="Menu">
        <Menu size={25} />
      </button>
    </header>
  );
}

export default Navbar;
