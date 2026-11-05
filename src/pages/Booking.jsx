
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Video,
  Phone,
  MessageCircle,
  CheckCircle,
  ShieldCheck,
  ArrowLeft,
  MapPin,
  Briefcase,
  CalendarCheck,
  FileText,
} from "lucide-react";

import initialLawyers from "../data/lawyers";
import { useAuth } from "../context/AuthContext";
import "./Booking.css";

function readStorage(key, fallback) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    return saved ?? fallback;
  } catch {
    return fallback;
  }
}

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

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
          profileId: profile.id,
          title: profile.title || "Advocate",
          fee: Number(profile.fee || 0),
          experience: Number(profile.experience || 0),
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

  const consultationTypes = lawyer
    ? Array.isArray(lawyer.consultation)
      ? lawyer.consultation
      : lawyer.consultation
        ? [lawyer.consultation]
        : []
    : [];

  const [consultationType, setConsultationType] = useState(
    consultationTypes[0] || "Video"
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [issue, setIssue] = useState("");
  const [success, setSuccess] = useState(false);

  const today = new Date();

  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  if (!lawyer) {
    return (
      <main className="booking-error">
        <h2>Lawyer Not Found</h2>
        <p>The requested lawyer profile could not be found.</p>
        <Link to="/lawyers">Back to Find Lawyers</Link>
      </main>
    );
  }

  const fee = Number(lawyer.fee || 0);

  const handleBooking = (e) => {
    e.preventDefault();

    if (!consultationTypes.includes(consultationType)) {
      alert("Please choose a valid consultation method.");
      return;
    }

    if (!issue.trim() || issue.trim().length < 10) {
      alert("Please describe your legal issue in at least 10 characters.");
      return;
    }

    if (!date || date < localToday) {
      alert("Please select a valid future date.");
      return;
    }

    if (!time) {
      alert("Please select a preferred time.");
      return;
    }

    const appointment = {
      id: Date.now(),

      // Lawyer relationship
      lawyerId: String(lawyer.id),
      lawyerProfileId: lawyer.profileId || null,
      lawyerUserId: lawyer.userId || null,
      lawyerName: lawyer.name,
      specialization: lawyer.specialization,

      // Client relationship
      clientId: user?.id ?? null,
      clientName: user?.name || "Guest Client",
      clientEmail: user?.email || "",

      // Appointment details
      fee,
      consultationType,
      date,
      time,
      issue: issue.trim(),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = readStorage("appointments", []);

      if (!Array.isArray(existing)) {
        throw new Error("Invalid appointment data");
      }

      existing.push(appointment);

      localStorage.setItem(
        "appointments",
        JSON.stringify(existing)
      );

      setSuccess(true);
    } catch (error) {
      alert("Unable to save your request. Please try again.");
    }
  };

  if (success) {
    return (
      <main className="booking-success-page">
        <div className="booking-success-card">
          <div className="success-icon">
            <CheckCircle size={48} />
          </div>

          <span className="success-eyebrow">
            REQUEST SAVED
          </span>

          <h1>Appointment Request Submitted!</h1>

          <p>
            Your demo consultation request with{" "}
            <strong>{lawyer.name}</strong> has been saved successfully.
          </p>

          <div className="success-booking-details">
            <div>
              <CalendarDays size={18} />
              <span>{date}</span>
            </div>

            <div>
              <Clock size={18} />
              <span>{time}</span>
            </div>

            <div>
              {consultationType === "Video" && <Video size={18} />}
              {consultationType === "Audio" && <Phone size={18} />}
              {consultationType === "Chat" && (
                <MessageCircle size={18} />
              )}
              <span>{consultationType} Consultation</span>
            </div>
          </div>

          <p className="success-note">
            This is a project demonstration. No real appointment
            has been sent to a lawyer and no payment was collected.
          </p>

          <button
            onClick={() => navigate("/client-dashboard")}
            className="success-dashboard-btn"
          >
            Go to My Dashboard
          </button>

          <Link to="/lawyers" className="success-back-link">
            Explore More Lawyers
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="booking-page">
      <div className="booking-container">
        <Link
          to={`/lawyer/${lawyer.id}`}
          className="booking-back-link"
        >
          <ArrowLeft size={16} />
          Back to Lawyer Profile
        </Link>

        <section className="booking-heading">
          <span className="booking-eyebrow">
            <CalendarCheck size={15} />
            APPOINTMENT REQUEST
          </span>

          <h1>Book Your Consultation</h1>

          <p>
            Take the first step towards resolving your legal concerns.
            Choose your preferred consultation details below.
          </p>
        </section>

        <div className="booking-layout">
          <form className="booking-form" onSubmit={handleBooking}>
            <div className="booking-section-title">
              <div className="booking-title-icon">
                <CalendarCheck size={21} />
              </div>

              <div>
                <h2>Consultation Details</h2>
                <p>Tell us how and when you would like to consult.</p>
              </div>
            </div>

            <div className="booking-field">
              <label>Choose Consultation Method</label>

              <div className="consultation-type-grid">
                {consultationTypes.map((type) => (
                  <button
                    type="button"
                    key={type}
                    className={
                      consultationType === type
                        ? "type-option active"
                        : "type-option"
                    }
                    onClick={() => setConsultationType(type)}
                  >
                    {type.toLowerCase() === "video" && (
                      <Video size={21} />
                    )}

                    {type.toLowerCase() === "audio" && (
                      <Phone size={21} />
                    )}

                    {type.toLowerCase() === "chat" && (
                      <MessageCircle size={21} />
                    )}

                    <span>{type}</span>

                    {consultationType === type && (
                      <CheckCircle size={16} className="type-check" />
                    )}
                  </button>
                ))}

                {consultationTypes.length === 0 && (
                  <p>No consultation methods are available.</p>
                )}
              </div>
            </div>

            <div className="booking-divider"></div>

            <div className="booking-section-title">
              <div className="booking-title-icon">
                <Clock size={21} />
              </div>

              <div>
                <h2>Preferred Schedule</h2>
                <p>Select a convenient date and time.</p>
              </div>
            </div>

            <div className="booking-field-row">
              <div className="booking-field">
                <label htmlFor="booking-date">Preferred Date</label>

                <div className="booking-input-icon">
                  <CalendarDays size={18} />

                  <input
                    id="booking-date"
                    type="date"
                    min={localToday}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="booking-field">
                <label htmlFor="booking-time">Preferred Time</label>

                <div className="booking-input-icon">
                  <Clock size={18} />

                  <input
                    id="booking-time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="booking-divider"></div>

            <div className="booking-section-title">
              <div className="booking-title-icon">
                <FileText size={21} />
              </div>

              <div>
                <h2>Describe Your Legal Issue</h2>
                <p>Share a brief explanation of your concern.</p>
              </div>
            </div>

            <div className="booking-field">
              <label htmlFor="booking-issue">
                Your Legal Concern
              </label>

              <textarea
                id="booking-issue"
                rows="5"
                placeholder="Briefly explain your legal issue and the assistance you are looking for..."
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                minLength={10}
                maxLength={1000}
                required
              />

              <div className="booking-character-count">
                {issue.length}/1000 characters
              </div>
            </div>

            <div className="booking-form-note">
              <ShieldCheck size={19} />

              <p>
                Please avoid sharing highly sensitive personal
                information in this demonstration form.
              </p>
            </div>

            <button
              type="submit"
              className="confirm-booking-btn"
              disabled={consultationTypes.length === 0}
            >
              Submit Booking Request
              <CalendarCheck size={18} />
            </button>

            <p className="booking-disclaimer">
              Demo only: your request is saved locally in this browser.
              No real appointment or payment is processed.
            </p>
          </form>

          <aside className="booking-summary">
            <div className="summary-heading">
              <h2>Booking Summary</h2>
              <span>DEMO BOOKING</span>
            </div>

            <div className="booking-lawyer-info">
              <div className="booking-lawyer-avatar">
                {lawyer.initials}
              </div>

              <div>
                <h3>{lawyer.name}</h3>
                <p>{lawyer.title}</p>
              </div>
            </div>

            <div className="booking-summary-location">
              <MapPin size={16} />
              {lawyer.location}
            </div>

            <div className="booking-summary-divider"></div>

            <div className="booking-summary-row">
              <span>Practice Area</span>
              <strong>{lawyer.specialization}</strong>
            </div>

            <div className="booking-summary-row">
              <span>Experience</span>
              <strong>{lawyer.experience} Years</strong>
            </div>

            <div className="booking-summary-row">
              <span>Consultation Type</span>
              <strong>{consultationType}</strong>
            </div>

            <div className="booking-summary-row">
              <span>Preferred Date</span>
              <strong>{date || "Not selected"}</strong>
            </div>

            <div className="booking-summary-row">
              <span>Preferred Time</span>
              <strong>{time || "Not selected"}</strong>
            </div>

            <div className="booking-summary-divider"></div>

            <div className="booking-total">
              <span>Consultation Fee</span>
              <strong>
                ₹{fee.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="booking-payment-note">
              <ShieldCheck size={18} />

              <p>
                No payment is collected. This amount is displayed
                for demonstration purposes only.
              </p>
            </div>

            <div className="booking-trust-note">
              <Briefcase size={18} />

              <span>
                Review the lawyer's sample profile before submitting
                your request.
              </span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Booking;
