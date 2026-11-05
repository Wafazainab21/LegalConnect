import { Link } from "react-router-dom";
import { Scale, Mail, MapPin } from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <Scale size={25} />
            <span>Legal<span className="brand-gold">Connect</span></span>
          </Link>
          <p>
            Making legal support accessible by connecting people
            with trusted legal professionals.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/lawyers">Find Lawyers</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p><Mail size={16} /> support@legalconnect.com</p>
          <p><MapPin size={16} /> India</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 LegalConnect. All rights reserved.</p>
        <p>Connecting You With Trusted Legal Professionals.</p>
      </div>
    </footer>
  );
}

export default Footer;