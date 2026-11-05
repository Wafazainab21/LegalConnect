import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scale, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Demo admin account
    if (
      email === "admin@legalconnect.com" &&
      password === "admin123"
    ) {
      login({
        name: "Admin",
        email,
        role: "admin",
      });
      navigate("/admin-dashboard");
      return;
    }

    const users = JSON.parse(localStorage.getItem("legalconnect_users") || "[]");

    const existingUser = users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
    );

    if (!existingUser) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    login(existingUser);

    if (existingUser.role === "lawyer") {
      navigate("/lawyer-dashboard");
    } else {
      navigate("/client-dashboard");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <div className="auth-icon"><Scale size={30} /></div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue to LegalConnect</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <div className="auth-input">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>
          <div className="auth-input">
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit">
            Sign In
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>

        <div className="demo-login">
          <strong>Demo Admin Login</strong>
          <p>Email: admin@legalconnect.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </main>
  );
}

export default Login;