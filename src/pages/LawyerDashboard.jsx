
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle,
  Clock,
  XCircle,
  IndianRupee,
  User,
  Search,
  Filter,
  Video,
  Phone,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
  CalendarCheck,
  ArrowRight,
  AlertCircle,
  FileText,
  Edit,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./LawyerDashboard.css";

function LawyerDashboard() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("appointments") || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Load the professional profile belonging to this account.
  const lawyerProfile = useMemo(() => {
    try {
      const profiles = JSON.parse(
        localStorage.getItem("legalconnect_lawyer_profiles") || "[]"
      );

      if (!Array.isArray(profiles)) return null;

      return (
        profiles.find(
          (profile) => String(profile.userId) === String(user?.id)
        ) || null
      );
    } catch {
      return null;
    }
  }, [user]);

  const profileStatus = !lawyerProfile
    ? "Not Submitted"
    : lawyerProfile.verified === true ||
        lawyerProfile.status === "Approved"
      ? "Approved"
      : lawyerProfile.status === "Rejected"
        ? "Rejected"
        : "Pending";

  const isApproved = profileStatus === "Approved";

  // Only show appointments linked to this lawyer's account ID.
  const lawyerAppointments = useMemo(() => {
    if (!user?.id || !lawyerProfile || !isApproved) return [];

    return appointments.filter(
      (item) =>
        String(item.lawyerUserId) === String(user.id)
    );
  }, [appointments, user, lawyerProfile, isApproved]);

  const saveAppointments = (updated) => {
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
  };

  const updateStatus = (id, newStatus) => {
    const belongsToLawyer = lawyerAppointments.some(
      (item) => item.id === id
    );

    if (!belongsToLawyer) return;

    const updated = appointments.map((appointment) =>
      appointment.id === id
        ? { ...appointment, status: newStatus }
        : appointment
    );

    saveAppointments(updated);
  };

  const pendingCount = lawyerAppointments.filter(
    (item) => item.status === "Pending"
  ).length;

  const acceptedCount = lawyerAppointments.filter(
    (item) => item.status === "Accepted"
  ).length;

  const rejectedCount = lawyerAppointments.filter(
    (item) => item.status === "Rejected"
  ).length;

  const cancelledCount = lawyerAppointments.filter(
    (item) => item.status === "Cancelled"
  ).length;

  const completedCount = lawyerAppointments.filter(
    (item) => item.status === "Completed"
  ).length;

  const earnings = lawyerAppointments
    .filter(
      (item) =>
        item.status === "Accepted" || item.status === "Completed"
    )
    .reduce((total, item) => total + Number(item.fee || 0), 0);

  const filteredAppointments = useMemo(() => {
    return lawyerAppointments
      .filter((item) => {
        const status = item.status || "Pending";

        const matchesFilter =
          activeFilter === "All" || status === activeFilter;

        const search = searchTerm.toLowerCase();

        const matchesSearch =
          (item.specialization || "").toLowerCase().includes(search) ||
          (item.issue || "").toLowerCase().includes(search) ||
          (item.clientName || "").toLowerCase().includes(search);

        return matchesFilter && matchesSearch;
      })
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
  }, [lawyerAppointments, activeFilter, searchTerm]);

  const getStatusIcon = (status) => {
    if (status === "Accepted" || status === "Completed") {
      return <CheckCircle size={14} />;
    }

    if (status === "Rejected" || status === "Cancelled") {
      return <XCircle size={14} />;
    }

    return <AlertCircle size={14} />;
  };

  const getConsultationIcon = (type) => {
    const value = (type || "").toLowerCase();

    if (value.includes("video")) return <Video size={15} />;

    if (value.includes("audio") || value.includes("phone")) {
      return <Phone size={15} />;
    }

    return <MessageCircle size={15} />;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date not selected";

    const date = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(date.getTime())) return dateValue;

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const statusStyles = {
    Approved: {
      background: "#e8f6ed",
      color: "#237344",
      border: "1px solid #c6e8d1",
    },
    Pending: {
      background: "#fff6e5",
      color: "#946315",
      border: "1px solid #f0dfbd",
    },
    Rejected: {
      background: "#fff0ef",
      color: "#b33d36",
      border: "1px solid #f2cfcc",
    },
    "Not Submitted": {
      background: "#f1f3f6",
      color: "#5c6878",
      border: "1px solid #dfe3e8",
    },
  };

  return (
    <main className="lawyer-dashboard">
      <div className="lawyer-dash-header">
        <div>
          <p className="dash-eyebrow">LAWYER PORTAL</p>
          <h1>Welcome, {user?.name || "Lawyer"}</h1>
          <p>Manage your professional profile and consultation requests.</p>
        </div>

        <Link to="/lawyer-profile-setup" className="lawyer-profile-link">
          <Edit size={17} />
          {lawyerProfile ? "Edit Professional Profile" : "Create Professional Profile"}
        </Link>
      </div>

      {/* PROFESSIONAL PROFILE STATUS */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #e9e5dc",
          borderRadius: "14px",
          padding: "24px",
          marginBottom: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#f6f1e7",
              color: "#a47d39",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={25} />
          </div>

          <div>
            <p className="dash-eyebrow">PROFESSIONAL PROFILE</p>
            <h3 style={{ margin: "5px 0", color: "#14243a" }}>
              {profileStatus === "Approved"
                ? "Your profile is approved"
                : profileStatus === "Rejected"
                  ? "Profile requires attention"
                  : profileStatus === "Pending"
                    ? "Profile under review"
                    : "Complete your lawyer profile"}
            </h3>

            <p style={{ margin: 0, color: "#697586", fontSize: "13px" }}>
              {profileStatus === "Approved"
                ? "Your profile is eligible to appear in the Find Lawyers directory."
                : profileStatus === "Rejected"
                  ? "Please review and update your professional profile before resubmitting."
                  : profileStatus === "Pending"
                    ? "Your submitted profile is waiting for admin approval."
                    : "Submit your professional details to start the approval process."}
            </p>
          </div>
        </div>

        <span
          style={{
            ...statusStyles[profileStatus],
            padding: "9px 14px",
            borderRadius: "30px",
            fontSize: "12px",
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          {profileStatus.toUpperCase()}
        </span>
      </section>

      {/* PROFILE DETAILS */}
      {lawyerProfile && (
        <section
          style={{
            background: "#fff",
            border: "1px solid #e9e5dc",
            borderRadius: "14px",
            padding: "22px",
            marginBottom: "28px",
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <FileText size={20} color="#a47d39" />
            <h3 style={{ margin: 0, color: "#14243a" }}>
              Professional Details
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "18px",
              marginTop: "20px",
            }}
          >
            <div>
              <p className="dash-eyebrow">SPECIALIZATION</p>
              <strong>{lawyerProfile.specialization || "Not added"}</strong>
            </div>

            <div>
              <p className="dash-eyebrow">EXPERIENCE</p>
              <strong>{lawyerProfile.experience || 0} years</strong>
            </div>

            <div>
              <p className="dash-eyebrow">LOCATION</p>
              <strong>{lawyerProfile.location || "Not added"}</strong>
            </div>

            <div>
              <p className="dash-eyebrow">CONSULTATION FEE</p>
              <strong>
                ₹{Number(lawyerProfile.fee || 0).toLocaleString("en-IN")}
              </strong>
            </div>
          </div>
        </section>
      )}

      {/* STATISTICS */}
      <section className="lawyer-stats">
        <div className="lawyer-stat-card">
          <span className="stat-icon">
            <BriefcaseBusiness />
          </span>
          <p>Total Requests</p>
          <h2>{lawyerAppointments.length}</h2>
        </div>

        <div className="lawyer-stat-card">
          <span className="stat-icon">
            <Clock />
          </span>
          <p>Pending Requests</p>
          <h2>{pendingCount}</h2>
        </div>

        <div className="lawyer-stat-card">
          <span className="stat-icon">
            <CheckCircle />
          </span>
          <p>Accepted</p>
          <h2>{acceptedCount}</h2>
        </div>

        <div className="lawyer-stat-card">
          <span className="stat-icon">
            <IndianRupee />
          </span>
          <p>Accepted Fees</p>
          <h2>₹{earnings.toLocaleString("en-IN")}</h2>
        </div>
      </section>

      {/* APPOINTMENT OVERVIEW */}
      <section className="lawyer-overview-strip">
        <div>
          <span><CalendarCheck size={17} /></span>
          <div>
            <strong>{completedCount}</strong>
            <p>Completed</p>
          </div>
        </div>

        <div>
          <span><XCircle size={17} /></span>
          <div>
            <strong>{rejectedCount}</strong>
            <p>Rejected</p>
          </div>
        </div>

        <div>
          <span><AlertCircle size={17} /></span>
          <div>
            <strong>{cancelledCount}</strong>
            <p>Cancelled</p>
          </div>
        </div>
      </section>

      {/* CONSULTATION REQUESTS */}
      <section className="lawyer-requests">
        <div className="requests-heading">
          <div>
            <p className="dash-eyebrow">REQUEST MANAGEMENT</p>
            <h2>Consultation Requests</h2>
            <p>Review and manage your incoming demo requests.</p>
          </div>

          <span className="rejected-count">
            {rejectedCount} Rejected
          </span>
        </div>

        <div className="lawyer-request-toolbar">
          <div className="lawyer-request-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search client, specialization or legal issue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="lawyer-filter-label">
            <Filter size={15} />
            Filter Requests
          </div>
        </div>

        <div className="lawyer-filter-tabs">
          {["All", "Pending", "Accepted", "Rejected", "Cancelled", "Completed"].map(
            (filter) => (
              <button
                key={filter}
                className={activeFilter === filter ? "selected" : ""}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
                {filter === "All" && (
                  <span>{lawyerAppointments.length}</span>
                )}
              </button>
            )
          )}
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="lawyer-empty">
            <CalendarDays size={42} />
            <h3>
              {!isApproved
                ? "Appointments will appear after profile approval"
                : lawyerAppointments.length === 0
                  ? "No consultation requests yet"
                  : "No matching requests found"}
            </h3>
            <p>
              {!isApproved
                ? "Complete your professional profile and wait for admin approval before receiving demo booking requests."
                : lawyerAppointments.length === 0
                  ? "New booking requests linked to your account will appear here."
                  : "Try another search term or status filter."}
            </p>

            {!isApproved && (
              <Link to="/lawyer-profile-setup">
                {lawyerProfile ? "Update Professional Profile" : "Create Professional Profile"}
                <ArrowRight size={15} />
              </Link>
            )}
          </div>
        ) : (
          <div className="request-list">
            {filteredAppointments.map((appointment) => {
              const status = appointment.status || "Pending";

              return (
                <article className="request-card" key={appointment.id}>
                  <div className="request-top">
                    <div>
                      <h3>{appointment.clientName || "Client"}</h3>
                      <p>
                        {appointment.specialization || "Legal Consultation"}
                      </p>
                    </div>

                    <span className={`request-status ${status.toLowerCase()}`}>
                      {getStatusIcon(status)}
                      {status}
                    </span>
                  </div>

                  <div className="request-details">
                    <p>
                      <CalendarDays size={15} />
                      {formatDate(appointment.date)}
                    </p>

                    <p>
                      <Clock size={15} />
                      {appointment.time || "Time not selected"}
                    </p>

                    <p>
                      {getConsultationIcon(appointment.consultationType)}
                      {appointment.consultationType || "Consultation"}
                    </p>

                    <p>
                      <IndianRupee size={15} />
                      ₹{Number(appointment.fee || 0).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="request-issue">
                    <strong>Legal Issue</strong>
                    <p>
                      {appointment.issue || "No issue description provided."}
                    </p>
                  </div>

                  {status === "Pending" && (
                    <div className="request-actions">
                      <button
                        className="accept-request"
                        onClick={() => updateStatus(appointment.id, "Accepted")}
                      >
                        <CheckCircle size={16} />
                        Accept Request
                      </button>

                      <button
                        className="reject-request"
                        onClick={() => updateStatus(appointment.id, "Rejected")}
                      >
                        <XCircle size={16} />
                        Reject Request
                      </button>
                    </div>
                  )}

                  {status === "Accepted" && (
                    <div className="request-actions">
                      <button
                        className="complete-request"
                        onClick={() => updateStatus(appointment.id, "Completed")}
                      >
                        <CheckCircle size={16} />
                        Mark as Completed
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* EARNINGS OVERVIEW */}
      <section className="lawyer-earnings-section">
        <div className="earnings-icon">
          <TrendingUp size={23} />
        </div>

        <div className="earnings-content">
          <p className="dash-eyebrow">EARNINGS OVERVIEW</p>
          <h2>₹{earnings.toLocaleString("en-IN")}</h2>
          <p>
            Total fees from accepted and completed demo consultations.
          </p>
        </div>

        <span className="earnings-note">DEMO SUMMARY</span>
      </section>

      {/* AVAILABILITY */}
      <section className="lawyer-availability">
        <div className="availability-icon">
          <CalendarDays size={22} />
        </div>

        <div>
          <p className="dash-eyebrow">SCHEDULE MANAGEMENT</p>
          <h3>Consultation Availability</h3>
          <p>
            Availability scheduling and live calendar management can be
            connected in a future version.
          </p>
        </div>

        <span className="availability-coming-soon">
          COMING SOON
        </span>
      </section>

      <div className="lawyer-demo-note">
        <ShieldCheck size={16} />
        Demo dashboard: profile approval, appointment updates and fee
        summaries are stored locally in this browser.
      </div>
    </main>
  );
}

export default LawyerDashboard;
