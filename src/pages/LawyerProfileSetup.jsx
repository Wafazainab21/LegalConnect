
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Scale, BriefcaseBusiness, MapPin, IndianRupee, Languages,
  FileText, ShieldCheck, Save, Video, Phone, MessageCircle,
  CheckCircle2, UserRound, ArrowRight, Clock
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import categories from "../data/categories";
import "./LawyerProfileSetup.css";

function LawyerProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getExistingProfile = () => {
    try {
      const profiles = JSON.parse(
        localStorage.getItem("legalconnect_lawyer_profiles") || "[]"
      );
      return profiles.find(
        (profile) => String(profile.userId) === String(user?.id)
      );
    } catch {
      return null;
    }
  };

  const existingProfile = getExistingProfile();

  const [specialization, setSpecialization] = useState(existingProfile?.specialization || "");
  const [experience, setExperience] = useState(existingProfile?.experience?.toString() || "");
  const [location, setLocation] = useState(existingProfile?.location || "");
  const [fee, setFee] = useState(existingProfile?.fee?.toString() || "");
  const [languages, setLanguages] = useState(existingProfile?.languages?.join(", ") || "");
  const [consultation, setConsultation] = useState(existingProfile?.consultation || ["Video"]);
  const [about, setAbout] = useState(existingProfile?.about || "");
  const [message, setMessage] = useState("");

  const toggleConsultation = (type) => {
    setConsultation((previous) =>
      previous.includes(type)
        ? previous.filter((item) => item !== type)
        : [...previous, type]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!user || user.role !== "lawyer") {
      navigate("/login");
      return;
    }

    if (consultation.length === 0) {
      setMessage("Please select at least one consultation method.");
      return;
    }

    if (about.trim().length < 30) {
      setMessage("Please write at least 30 characters about your experience.");
      return;
    }

    try {
      const saved = JSON.parse(
        localStorage.getItem("legalconnect_lawyer_profiles") || "[]"
      );
      const profiles = Array.isArray(saved) ? saved : [];

      const oldProfile = profiles.find(
        (profile) => String(profile.userId) === String(user.id)
      );

      const initials = user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      const profile = {
        id: oldProfile?.id || Date.now(),
        userId: user.id,
        name: user.name,
        email: user.email,
        title: "Advocate",
        specialization,
        experience: Number(experience),
        location: location.trim(),
        fee: Number(fee),
        languages: languages.split(",").map((item) => item.trim()).filter(Boolean),
        consultation,
        about: about.trim(),
        initials,
        rating: oldProfile?.rating || 0,
        reviews: oldProfile?.reviews || 0,
        availability: "Available",
        verified: false,
        status: "Pending",
        createdAt: oldProfile?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedProfiles = [
        ...profiles.filter(
          (item) => String(item.userId) !== String(user.id)
        ),
        profile,
      ];

      localStorage.setItem(
        "legalconnect_lawyer_profiles",
        JSON.stringify(updatedProfiles)
      );

      navigate("/lawyer-dashboard");
    } catch {
      setMessage("Unable to save your profile. Please try again.");
    }
  };

  if (!user || user.role !== "lawyer") {
    return (
      <main className="lawyer-setup-page">
        <div className="setup-access-card">
          <ShieldCheck size={38} />
          <h2>Lawyer account required</h2>
          <p>Please log in using your lawyer account to continue.</p>
          <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </main>
    );
  }

  const consultationOptions = [
    { name: "Video", icon: Video, detail: "Face-to-face online meeting" },
    { name: "Audio", icon: Phone, detail: "Voice consultation" },
    { name: "Chat", icon: MessageCircle, detail: "Text-based consultation" },
  ];

  return (
    <main className="lawyer-setup-page">
      <div className="setup-shell">
        <div className="setup-topbar">
          <div className="setup-brand">
            <span className="setup-brand-icon"><Scale size={23} /></span>
            <span>Legal<span>Connect</span></span>
          </div>
          <div className="setup-secure"><ShieldCheck size={16} /> Secure profile setup</div>
        </div>

        <header className="setup-hero">
          <div className="setup-eyebrow">LAWYER ONBOARDING</div>
          <h1>Build your professional <span>presence.</span></h1>
          <p>
            Introduce your expertise, connect with clients and make your legal
            services easier to discover.
          </p>
          <div className="setup-progress">
            <div className="setup-progress-step active">
              <span>1</span><div><strong>Your details</strong><small>Professional information</small></div>
            </div>
            <div className="setup-progress-line" />
            <div className="setup-progress-step">
              <span>2</span><div><strong>Review</strong><small>Admin approval</small></div>
            </div>
            <div className="setup-progress-line" />
            <div className="setup-progress-step">
              <span>3</span><div><strong>Go live</strong><small>Meet potential clients</small></div>
            </div>
          </div>
        </header>

        <div className="setup-layout">
          <form className="lawyer-setup-form" onSubmit={handleSubmit}>
            <section className="setup-form-section">
              <div className="setup-section-heading">
                <span className="setup-section-icon"><UserRound size={20} /></span>
                <div>
                  <h2>Basic information</h2>
                  <p>Your account details and area of practice.</p>
                </div>
              </div>

              <div className="setup-grid">
                <div className="setup-field">
                  <label>Full name</label>
                  <input value={user.name} disabled />
                </div>
                <div className="setup-field">
                  <label>Email address</label>
                  <input value={user.email} disabled />
                </div>
                <div className="setup-field full">
                  <label>Legal specialization <span>*</span></label>
                  <select value={specialization} onChange={(e) => setSpecialization(e.target.value)} required>
                    <option value="">Choose your practice area</option>
                    {categories.filter((item) => item !== "All Categories").map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="setup-field">
                  <label><BriefcaseBusiness size={15} /> Experience (years) <span>*</span></label>
                  <input type="number" min="0" max="60" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 5" required />
                </div>
                <div className="setup-field">
                  <label><IndianRupee size={15} /> Consultation fee <span>*</span></label>
                  <input type="number" min="1" value={fee} onChange={(e) => setFee(e.target.value)} placeholder="e.g. 1000" required />
                </div>
                <div className="setup-field full">
                  <label><MapPin size={15} /> City / Location <span>*</span></label>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Chennai, Tamil Nadu" required />
                </div>
                <div className="setup-field full">
                  <label><Languages size={15} /> Languages you speak <span>*</span></label>
                  <input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="English, Tamil, Hindi" required />
                  <small>Separate each language with a comma.</small>
                </div>
              </div>
            </section>

            <section className="setup-form-section">
              <div className="setup-section-heading">
                <span className="setup-section-icon"><Video size={20} /></span>
                <div>
                  <h2>Consultation preferences</h2>
                  <p>Choose how clients can reach you.</p>
                </div>
              </div>

              <div className="setup-consultation-options">
                {consultationOptions.map(({ name, icon: Icon, detail }) => (
                  <button
                    type="button"
                    key={name}
                    className={`setup-method-card ${consultation.includes(name) ? "selected" : ""}`}
                    onClick={() => toggleConsultation(name)}
                  >
                    <span className="setup-method-icon"><Icon size={21} /></span>
                    <span className="setup-method-text"><strong>{name}</strong><small>{detail}</small></span>
                    <span className="setup-method-check">
                      {consultation.includes(name) && <CheckCircle2 size={19} />}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="setup-form-section">
              <div className="setup-section-heading">
                <span className="setup-section-icon"><FileText size={20} /></span>
                <div>
                  <h2>About your practice</h2>
                  <p>Help clients understand your experience and expertise.</p>
                </div>
              </div>

              <div className="setup-field">
                <label>Professional biography <span>*</span></label>
                <textarea
                  rows="6"
                  minLength="30"
                  maxLength="1000"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Tell clients about your legal experience, key practice areas, professional approach and how you can help them..."
                  required
                />
                <div className="setup-character-count">{about.length}/1000 characters · Minimum 30</div>
              </div>
            </section>

            <div className="setup-review-note">
              <ShieldCheck size={23} />
              <div>
                <strong>What happens next?</strong>
                <p>Your profile will be submitted for admin review. It will appear in the lawyer directory only after approval. This is a demo platform and does not independently verify legal credentials.</p>
              </div>
            </div>

            {message && <div className="setup-error">{message}</div>}

            <button type="submit" className="setup-submit">
              <Save size={18} /> Submit profile for review <ArrowRight size={18} />
            </button>
            <p className="setup-submit-caption"><ShieldCheck size={14} /> Your profile details are saved in this demo application.</p>
          </form>

          <aside className="setup-preview-column">
            <div className="setup-preview-card">
              <div className="setup-preview-top">
                <span>PROFILE PREVIEW</span>
                <span className="setup-preview-live"><Clock size={13} /> Draft</span>
              </div>
              <div className="setup-avatar">{user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div>
              <h3>{user.name}</h3>
              <p className="setup-preview-title">{specialization || "Your legal specialization"}</p>
              <div className="setup-preview-divider" />
              <div className="setup-preview-detail"><MapPin size={16} /><span>{location || "Your city"}</span></div>
              <div className="setup-preview-detail"><BriefcaseBusiness size={16} /><span>{experience ? `${experience} years of experience` : "Your experience"}</span></div>
              <div className="setup-preview-detail"><IndianRupee size={16} /><span>{fee ? `₹${fee} consultation fee` : "Your consultation fee"}</span></div>
              <div className="setup-preview-divider" />
              <strong className="setup-preview-label">Consultation methods</strong>
              <div className="setup-preview-tags">
                {consultation.length ? consultation.map((item) => <span key={item}>{item}</span>) : <small>Select a method</small>}
              </div>
              <div className="setup-preview-divider" />
              <strong className="setup-preview-label">Languages</strong>
              <p className="setup-preview-languages">{languages || "Your languages will appear here."}</p>
            </div>

            <div className="setup-tip-card">
              <ShieldCheck size={21} />
              <div>
                <strong>Make a great first impression</strong>
                <p>Use clear details and a helpful biography so potential clients can understand your services.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default LawyerProfileSetup;
