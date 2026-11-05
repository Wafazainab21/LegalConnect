
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scale, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const users = JSON.parse(
      localStorage.getItem("legalconnect_users") || "[]"
    );

    const alreadyExists = users.some(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (alreadyExists) {
      setError("An account with this email already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    };

    users.push(newUser);

    localStorage.setItem("legalconnect_users", JSON.stringify(users));
    login(newUser);

    if (role === "lawyer") {
      navigate("/lawyer-profile-setup");
    } else {
      navigate("/client-dashboard");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-heading">
          <div className="auth-icon">
            <Scale size={30} />
          </div>
          <h1>Create Your Account</h1>
          <p>Join LegalConnect and get the legal support you need.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <div className="auth-input">
            <User size={18} />
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
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

          <label>Register As</label>
          <select
            className="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="client">Client – Looking for legal help</option>
            <option value="lawyer">Lawyer – Offering legal services</option>
          </select>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit">
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
