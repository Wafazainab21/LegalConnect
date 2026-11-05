
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Star,
  ShieldCheck,
  CalendarCheck,
  Video,
  MessageCircle,
  Phone,
  ArrowLeft,
  Clock,
  Languages,
  Scale,
  Award,
  CheckCircle2,
} from "lucide-react";

import initialLawyers from "../data/lawyers";
import "./LawyerDetails.css";

function readStorage(key, fallback) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    return saved ?? fallback;
  } catch {
    return fallback;
  }
}

function LawyerDetails() {
  const { id } = useParams();

  const sampleLawyers = readStorage(
    "legalconnect_lawyers",
    initialLawyers
  );

  const profiles = readStorage(
    "legalconnect_lawyer_profiles",
    []
  );

  const approvedProfiles = Array.isArray(profiles)
    ? profiles
        .filter(
          (profile) =>
            profile.verified === true || profile.status === "Approved"
        )
        .map((profile) => ({
          ...profile,
          id: `registered-${profile.userId}`,
          title: profile.title || "Advocate",
          rating: Number(profile.rating || 0),
          reviews: Number(profile.reviews || 0),
          languages: Array.isArray(profile.languages)
            ? profile.languages
            : [],
          consultation: Array.isArray(profile.consultation)
            ? profile.consultation
            : profile.consultation
              ? [profile.consultation]
              : [],
          availability: profile.availability || "Available",
          about: profile.about || "No professional introduction provided.",
          initials:
            profile.initials ||
            (profile.name || "LC")
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase(),
          isRegisteredProfile: true,
        }))
    : [];

  const allLawyers = [...sampleLawyers, ...approvedProfiles];

  const lawyer = allLawyers.find(
    (item) => String(item.id) === String(id)
  );

  if (!lawyer) {
    return (
      <div className="lawyer-not-found">
        <Scale size={42} />
        <h2>Lawyer Not Found</h2>
        <p>The requested lawyer profile could not be found.</p>
        <Link to="/lawyers">Back to Lawyers</Link>
      </div>
    );
  }

  const languages = Array.isArray(lawyer.languages)
    ? lawyer.languages
    : [];

  const consultationTypes = Array.isArray(lawyer.consultation)
    ? lawyer.consultation
    : lawyer.consultation
      ? [lawyer.consultation]
      : [];

  const fee = Number(lawyer.fee || 0);
  const experience = Number(lawyer.experience || 0);
  const rating = Number(lawyer.rating || 0);
  const reviews = Number(lawyer.reviews || 0);

  return (
    <main className="lawyer-details-page">
      <div className="details-container">
        <div className="details-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/lawyers">Find Lawyers</Link>
          <span>/</span>
          <span>Lawyer Profile</span>
        </div>

        <Link to="/lawyers" className="back-to-lawyers">
          <ArrowLeft size={16} />
          Back to Lawyers
        </Link>

        <section className="lawyer-profile-header">
          <div className="profile-avatar">
            {lawyer.initials}
          </div>

          <div className="profile-main-info">
            <span className="profile-verified">
              <ShieldCheck size={15} />
              {lawyer.isRegisteredProfile
                ? "Admin Approved Demo Profile"
                : "Demo Profile"}
            </span>

            <h1>{lawyer.name}</h1>
            <p className="profile-profession">{lawyer.title}</p>

            <div className="profile-meta">
              <span>
                <Briefcase size={16} />
                {experience} Years Experience
              </span>

              <span>
                <MapPin size={16} />
                {lawyer.location}
              </span>

              <span>
                <Star size={16} fill="#c5a46d" color="#c5a46d" />
                {rating > 0
                  ? `${rating} (${reviews} reviews)`
                  : "No ratings yet"}
              </span>
            </div>
          </div>

          <div className="profile-booking-box">
            <span className="booking-label">Consultation Fee</span>
            <strong>₹{fee.toLocaleString("en-IN")}</strong>
            <span className="booking-subtitle">Per consultation</span>

            <Link to={`/booking/${lawyer.id}`}>
              Book Consultation
              <CalendarCheck size={17} />
            </Link>
          </div>
        </section>

        <div className="profile-highlights">
          <div className="profile-highlight">
            <div className="highlight-icon">
              <Briefcase size={20} />
            </div>
            <div>
              <strong>{experience} Years</strong>
              <span>Experience</span>
            </div>
          </div>

          <div className="profile-highlight">
            <div className="highlight-icon">
              <Star size={20} />
            </div>
            <div>
              <strong>{rating > 0 ? `${rating}/5` : "New"}</strong>
              <span>{rating > 0 ? "Sample Rating" : "Not Rated"}</span>
            </div>
          </div>

          <div className="profile-highlight">
            <div className="highlight-icon">
              <Languages size={20} />
            </div>
            <div>
              <strong>{languages.length}</strong>
              <span>Languages</span>
            </div>
          </div>

          <div className="profile-highlight">
            <div className="highlight-icon">
              <Award size={20} />
            </div>
            <div>
              <strong>{lawyer.specialization}</strong>
              <span>Practice Area</span>
            </div>
          </div>
        </div>

        <div className="profile-details-grid">
          <section className="profile-about">
            <div className="profile-section-card">
              <div className="profile-section-heading">
                <div className="section-heading-icon">
                  <Briefcase size={19} />
                </div>
                <h2>About the Lawyer</h2>
              </div>

              <p className="profile-about-text">
                {lawyer.about || "No professional introduction provided."}
              </p>
            </div>

            <div className="profile-section-card">
              <div className="profile-section-heading">
                <div className="section-heading-icon">
                  <Scale size={19} />
                </div>
                <h2>Area of Specialization</h2>
              </div>

              <div className="profile-specialization">
                {lawyer.specialization}
              </div>
            </div>

            <div className="profile-section-card">
              <div className="profile-section-heading">
                <div className="section-heading-icon">
                  <Languages size={19} />
                </div>
                <h2>Languages Spoken</h2>
              </div>

              <div className="profile-language-list">
                {languages.length > 0 ? (
                  languages.map((language) => (
                    <span key={language}>
                      <CheckCircle2 size={14} />
                      {language}
                    </span>
                  ))
                ) : (
                  <p>Languages not provided.</p>
                )}
              </div>
            </div>

            <div className="profile-section-card">
              <div className="profile-section-heading">
                <div className="section-heading-icon">
                  <CalendarCheck size={19} />
                </div>
                <h2>Consultation Information</h2>
              </div>

              <div className="profile-information-row">
                <span>Location</span>
                <strong>{lawyer.location}</strong>
              </div>

              <div className="profile-information-row">
                <span>Practice Area</span>
                <strong>{lawyer.specialization}</strong>
              </div>

              <div className="profile-information-row">
                <span>Consultation Fee</span>
                <strong>₹{fee.toLocaleString("en-IN")}</strong>
              </div>
            </div>
          </section>

          <aside className="profile-sidebar">
            <div className="profile-section-card">
              <h3>Consultation Options</h3>

              <p className="sidebar-description">
                Available consultation methods.
              </p>

              {consultationTypes.length > 0 ? (
                consultationTypes.map((type) => (
                  <div className="consultation-option" key={type}>
                    <div className="consultation-option-icon">
                      {type.toLowerCase() === "video" && (
                        <Video size={19} />
                      )}
                      {type.toLowerCase() === "audio" && (
                        <Phone size={19} />
                      )}
                      {type.toLowerCase() === "chat" && (
                        <MessageCircle size={19} />
                      )}
                    </div>

                    <span>{type} Consultation</span>
                    <CheckCircle2 size={16} className="option-check" />
                  </div>
                ))
              ) : (
                <p>No consultation methods provided.</p>
              )}
            </div>

            <div className="profile-section-card availability-card">
              <div className="profile-section-heading">
                <div className="section-heading-icon">
                  <Clock size={19} />
                </div>
                <h3>Availability</h3>
              </div>

              <p className="profile-availability">
                <span></span>
                {lawyer.availability}
              </p>

              <div className="availability-divider"></div>

              <div className="sidebar-fee">
                <span>Consultation Fee</span>
                <strong>₹{fee.toLocaleString("en-IN")}</strong>
              </div>

              <Link
                to={`/booking/${lawyer.id}`}
                className="profile-book-link"
              >
                Request Appointment
                <CalendarCheck size={17} />
              </Link>

              <p className="booking-disclaimer">
                Demo booking only. No real appointment is confirmed.
              </p>
            </div>

            <div className="profile-trust-card">
              <ShieldCheck size={23} />
              <div>
                <strong>Choose Informed</strong>
                <p>
                  Review profile details before making a consultation request.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <div className="profile-demo-note">
          <ShieldCheck size={16} />
          This is a demonstration profile. Admin approval in this demo does
          not represent independent legal credential verification.
        </div>
      </div>
    </main>
  );
}

export default LawyerDetails;
