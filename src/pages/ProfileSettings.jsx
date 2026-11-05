import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Save, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./ProfileSettings.css";

function ProfileSettings() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");

  const handleSave = (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    const updatedUser = { ...user, name, email };

    if (user.role !== "admin") {
      const users = JSON.parse(
        localStorage.getItem("legalconnect_users") || "[]"
      );

      const emailExists = users.some(
        (item) =>
          item.email.toLowerCase() === email.toLowerCase() &&
          item.id !== user.id
      );

      if (emailExists) {
        setMessage("This email is already registered.");
        return;
      }

      const updatedUsers = users.map((item) =>
        item.id === user.id ? updatedUser : item
      );

      localStorage.setItem(
        "legalconnect_users",
        JSON.stringify(updatedUsers)
      );
    }

    login(updatedUser);
    setMessage("Profile updated successfully!");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <main className="profile-page">
        <div className="profile-card">
          <h2>Please log in to view your profile.</h2>
          <button onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-card">
        <div className="profile-heading">
          <div className="profile-avatar">
            <User size={30} />
          </div>
          <h1>Profile Settings</h1>
          <p>Manage your LegalConnect account details.</p>
        </div>

        <div className="profile-role">
          Account Type: <strong>{user.role}</strong>
        </div>

        <form onSubmit={handleSave}>
          <label>Full Name</label>
          <div className="profile-input">
            <User size={18} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <label>Email Address</label>
          <div className="profile-input">
            <Mail size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {message && <p className="profile-message">{message}</p>}

          <button type="submit" className="profile-save">
            <Save size={17} /> Save Changes
          </button>
        </form>

        <button
          type="button"
          className="profile-logout"
          onClick={handleLogout}
        >
          <LogOut size={17} /> Log Out
        </button>
      </div>
    </main>
  );
}

export default ProfileSettings;