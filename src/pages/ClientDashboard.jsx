
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Video,
  Phone,
  MessageCircle,
  FileText,
  LayoutDashboard,
  Settings,
  LogOut,
  Search,
  Plus,
  BriefcaseBusiness,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import "./ClientDashboard.css";

function ClientDashboard() {
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("appointments") || "[]"
      );
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const saveAppointments = (updated) => {
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
  };

  const cancelAppointment = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment request?"
    );

    if (!confirmed) return;

    const updated = appointments.map((appointment) =>
      appointment.id === id
        ? { ...appointment, status: "Cancelled" }
        : appointment
    );

    saveAppointments(updated);
  };

  const totalRequests = appointments.length;

  const pendingCount = appointments.filter(
    (item) => item.status === "Pending"
  ).length;

  const acceptedCount = appointments.filter(
    (item) => item.status === "Accepted"
  ).length;

  const cancelledCount = appointments.filter(
    (item) => item.status === "Cancelled"
  ).length;

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((item) => {
        const matchesFilter =
          activeFilter === "All" ||
          item.status === activeFilter;

        const search = searchTerm.toLowerCase();

        const matchesSearch =
          (item.lawyerName || "").toLowerCase().includes(search) ||
          (item.specialization || "").toLowerCase().includes(search);

        return matchesFilter && matchesSearch;
      })
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
  }, [appointments, activeFilter, searchTerm]);

  const getStatusIcon = (status) => {
    if (status === "Accepted") return <CheckCircle size={14} />;
    if (status === "Rejected") return <XCircle size={14} />;
    if (status === "Cancelled") return <XCircle size={14} />;
    return <AlertCircle size={14} />;
  };

  const getConsultationIcon = (type) => {
    if (type === "Video") return <Video size={15} />;
    if (type === "Audio") return <Phone size={15} />;
    return <MessageCircle size={15} />;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date not selected";

    const date = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(date.getTime())) return dateValue;

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <main className="client-dashboard">

      {/* Sidebar */}

      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">L</div>
          <div>
            <strong>LegalConnect</strong>
            <span>CLIENT PORTAL</span>
          </div>
        </div>

        <div className="dashboard-user">
          <div className="dashboard-avatar">U</div>
          <div>
            <strong>Client Account</strong>
            <span>Welcome back</span>
          </div>
        </div>

        <p className="dashboard-nav-label">MAIN MENU</p>

        <nav>
          <a href="#overview" className="active">
            <LayoutDashboard size={18} />
            Overview
          </a>

          <a href="#appointments">
            <CalendarDays size={18} />
            My Appointments
          </a>

          <a href="#documents">
            <FileText size={18} />
            Documents
          </a>

          <Link to="/profile">
            <Settings size={18} />
            Settings
          </Link>

          <Link to="/login">
            <LogOut size={18} />
            Log Out
          </Link>
        </nav>

        <div className="dashboard-sidebar-help">
          <ShieldCheck size={21} />
          <h4>Your Legal Journey</h4>
          <p>Keep track of your consultation requests in one place.</p>
          <Link to="/lawyers">
            Find a Lawyer <ArrowRight size={14} />
          </Link>
        </div>
      </aside>

      {/* Main Content */}

      <section className="dashboard-main">

        <header className="dashboard-welcome" id="overview">
          <div>
            <span className="dashboard-eyebrow">
              CLIENT DASHBOARD
            </span>

            <h1>Welcome Back!</h1>

            <p>
              Manage your legal consultations and stay updated
              on your requests.
            </p>
          </div>

          <Link to="/lawyers" className="dashboard-find-btn">
            <Plus size={17} />
            Find a Lawyer
          </Link>
        </header>

        {/* Statistics */}

        <div className="dashboard-stat-grid">

          <div className="dashboard-stat">
            <div className="stat-icon navy">
              <CalendarDays size={21} />
            </div>

            <div>
              <strong>{totalRequests}</strong>
              <span>Total Requests</span>
            </div>
          </div>

          <div className="dashboard-stat">
            <div className="stat-icon gold">
              <Clock size={21} />
            </div>

            <div>
              <strong>{pendingCount}</strong>
              <span>Pending Requests</span>
            </div>
          </div>

          <div className="dashboard-stat">
            <div className="stat-icon green">
              <CheckCircle size={21} />
            </div>

            <div>
              <strong>{acceptedCount}</strong>
              <span>Accepted</span>
            </div>
          </div>

          <div className="dashboard-stat">
            <div className="stat-icon red">
              <XCircle size={21} />
            </div>

            <div>
              <strong>{cancelledCount}</strong>
              <span>Cancelled</span>
            </div>
          </div>

        </div>

        {/* Appointments */}

        <section
          className="dashboard-appointments"
          id="appointments"
        >
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-section-eyebrow">
                CONSULTATION MANAGEMENT
              </span>

              <h2>My Appointments</h2>

              <p>View and manage all your consultation requests.</p>
            </div>

            <Link to="/lawyers" className="dashboard-more-link">
              Explore Lawyers <ArrowRight size={15} />
            </Link>
          </div>

          {/* Search */}

          <div className="appointment-toolbar">
            <div className="appointment-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search lawyer or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="appointment-filter-label">
              <Filter size={15} />
              Filter
            </div>
          </div>

          {/* Filters */}

          <div className="appointment-filter-tabs">
            {["All", "Pending", "Accepted", "Rejected", "Cancelled"].map(
              (filter) => (
                <button
                  key={filter}
                  type="button"
                  className={
                    activeFilter === filter ? "selected" : ""
                  }
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                  {filter === "All" && (
                    <span>{totalRequests}</span>
                  )}
                </button>
              )
            )}
          </div>

          {/* Appointment List */}

          {filteredAppointments.length > 0 ? (
            <div className="appointment-list">

              {filteredAppointments.map((appointment) => (
                <article
                  className="client-appointment-card"
                  key={appointment.id}
                >
                  <div className="appointment-lawyer-avatar">
                    {(appointment.lawyerName || "Lawyer")
                      .split(" ")
                      .slice(-1)[0]
                      .charAt(0)}
                  </div>

                  <div className="appointment-details">
                    <h3>
                      {appointment.lawyerName || "Lawyer"}
                    </h3>

                    <p className="appointment-specialization">
                      <BriefcaseBusiness size={13} />
                      {appointment.specialization || "Legal Consultation"}
                    </p>

                    <div className="appointment-meta">
                      <span>
                        <CalendarDays size={14} />
                        {formatDate(appointment.date)}
                      </span>

                      <span>
                        <Clock size={14} />
                        {appointment.time || "Time not selected"}
                      </span>

                      <span>
                        {getConsultationIcon(
                          appointment.consultationType
                        )}
                        {appointment.consultationType || "Consultation"}
                      </span>
                    </div>

                    <p className="appointment-issue">
                      {appointment.issue || "No issue description provided."}
                    </p>

                    <div className="appointment-fee">
                      Consultation Fee:{" "}
                      <strong>
                        ₹{Number(appointment.fee || 0).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>

                  <div className="appointment-actions">
                    <span
                      className={`appointment-status ${(appointment.status || "Pending").toLowerCase()}`}
                    >
                      {getStatusIcon(appointment.status)}
                      {appointment.status || "Pending"}
                    </span>

                    {appointment.status !== "Cancelled" &&
                      appointment.status !== "Rejected" && (
                        <button
                          type="button"
                          onClick={() =>
                            cancelAppointment(appointment.id)
                          }
                        >
                          Cancel Request
                        </button>
                      )}
                  </div>
                </article>
              ))}

            </div>
          ) : (
            <div className="empty-appointments">
              <div className="empty-appointment-icon">
                <CalendarDays size={32} />
              </div>

              <h3>
                {appointments.length === 0
                  ? "No Appointments Yet"
                  : "No Matching Appointments"}
              </h3>

              <p>
                {appointments.length === 0
                  ? "Your consultation requests will appear here once you book a lawyer."
                  : "Try another search term or select a different filter."}
              </p>

              {appointments.length === 0 && (
                <Link to="/lawyers">
                  Explore Lawyers <ArrowRight size={15} />
                </Link>
              )}
            </div>
          )}

        </section>

        {/* Documents */}

        <section
          className="dashboard-documents"
          id="documents"
        >
          <div className="documents-icon">
            <FileText size={24} />
          </div>

          <div className="documents-content">
            <h3>My Legal Documents</h3>
            <p>
              Secure document upload and sharing features are
              planned for a future version.
            </p>
            <span>DOCUMENT MANAGEMENT · COMING SOON</span>
          </div>

          <ArrowRight size={19} className="documents-arrow" />
        </section>

        {/* Footer Note */}

        <div className="dashboard-demo-note">
          <ShieldCheck size={16} />
          Demo dashboard: appointment information is stored
          locally in this browser only.
        </div>

      </section>
    </main>
  );
}

export default ClientDashboard;
