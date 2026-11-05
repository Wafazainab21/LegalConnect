
import { useMemo, useState } from "react";
import {
  Users,
  BriefcaseBusiness,
  CalendarDays,
  ShieldCheck,
  ShieldX,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Activity,
  UserCheck,
  TrendingUp,
  MapPin,
  Mail,
  FileText,
  IndianRupee,
} from "lucide-react";
import initialLawyers from "../data/lawyers";
import "./AdminDashboard.css";

function readStorage(key, fallback) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    return saved ?? fallback;
  } catch {
    return fallback;
  }
}

function AdminDashboard() {
  const [lawyerList, setLawyerList] = useState(() =>
    readStorage("legalconnect_lawyers", initialLawyers)
  );

  const [lawyerProfiles, setLawyerProfiles] = useState(() =>
    readStorage("legalconnect_lawyer_profiles", [])
  );

  const [users] = useState(() =>
    readStorage("legalconnect_users", [])
  );

  const [appointments] = useState(() =>
    readStorage("appointments", [])
  );

  const [lawyerSearch, setLawyerSearch] = useState("");
  const [lawyerFilter, setLawyerFilter] = useState("All");
  const [profileSearch, setProfileSearch] = useState("");
  const [profileFilter, setProfileFilter] = useState("All");
  const [userSearch, setUserSearch] = useState("");
  const [appointmentFilter, setAppointmentFilter] = useState("All");

  // Existing sample lawyer verification
  const toggleVerification = (id) => {
    const updated = lawyerList.map((lawyer) =>
      lawyer.id === id
        ? { ...lawyer, verified: !lawyer.verified }
        : lawyer
    );

    setLawyerList(updated);
    localStorage.setItem("legalconnect_lawyers", JSON.stringify(updated));
  };

  // Approve or reject registered lawyer profiles
  const updateProfileStatus = (id, newStatus) => {
    const updated = lawyerProfiles.map((profile) =>
      String(profile.id) === String(id)
        ? {
            ...profile,
            status: newStatus,
            verified: newStatus === "Approved",
            reviewedAt: new Date().toISOString(),
          }
        : profile
    );

    setLawyerProfiles(updated);
    localStorage.setItem(
      "legalconnect_lawyer_profiles",
      JSON.stringify(updated)
    );
  };

  const approvedProfiles = lawyerProfiles.filter(
    (profile) =>
      profile.status === "Approved" || profile.verified === true
  );

  const pendingProfiles = lawyerProfiles.filter(
    (profile) =>
      profile.status !== "Approved" &&
      profile.status !== "Rejected" &&
      profile.verified !== true
  );

  const verifiedCount =
    lawyerList.filter((lawyer) => lawyer.verified).length +
    approvedProfiles.length;

  const pendingVerification =
    lawyerList.filter((lawyer) => !lawyer.verified).length +
    pendingProfiles.length;

  const totalLawyers = lawyerList.length + lawyerProfiles.length;

  const acceptedCount = appointments.filter(
    (a) => a.status === "Accepted"
  ).length;

  const pendingCount = appointments.filter(
    (a) => a.status === "Pending"
  ).length;

  const rejectedCount = appointments.filter(
    (a) => a.status === "Rejected"
  ).length;

  const cancelledCount = appointments.filter(
    (a) => a.status === "Cancelled"
  ).length;

  const filteredLawyers = useMemo(() => {
    return lawyerList.filter((lawyer) => {
      const term = lawyerSearch.toLowerCase();

      const matchesSearch =
        (lawyer.name || "").toLowerCase().includes(term) ||
        (lawyer.specialization || "").toLowerCase().includes(term) ||
        (lawyer.location || "").toLowerCase().includes(term);

      const matchesStatus =
        lawyerFilter === "All" ||
        (lawyerFilter === "Verified" && lawyer.verified) ||
        (lawyerFilter === "Unverified" && !lawyer.verified);

      return matchesSearch && matchesStatus;
    });
  }, [lawyerList, lawyerSearch, lawyerFilter]);

  const filteredProfiles = useMemo(() => {
    return lawyerProfiles.filter((profile) => {
      const term = profileSearch.toLowerCase();

      const matchesSearch =
        (profile.name || "").toLowerCase().includes(term) ||
        (profile.email || "").toLowerCase().includes(term) ||
        (profile.specialization || "").toLowerCase().includes(term) ||
        (profile.location || "").toLowerCase().includes(term);

      const status =
        profile.status ||
        (profile.verified ? "Approved" : "Pending");

      const matchesStatus =
        profileFilter === "All" || status === profileFilter;

      return matchesSearch && matchesStatus;
    });
  }, [lawyerProfiles, profileSearch, profileFilter]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const term = userSearch.toLowerCase();

      return (
        (user.name || "").toLowerCase().includes(term) ||
        (user.email || "").toLowerCase().includes(term)
      );
    });
  }, [users, userSearch]);

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointmentFilter === "All" ||
      appointment.status === appointmentFilter
  );

  const activityItems = [
    ...appointments.map((item) => ({
      id: `appointment-${item.id}`,
      title: "Consultation request created",
      detail: item.lawyerName || "Lawyer consultation",
      date: item.createdAt,
      type: "appointment",
    })),

    ...users.map((item, index) => ({
      id: `user-${item.email || index}`,
      title: "User registered",
      detail: item.name || item.email || "New user",
      date: item.createdAt,
      type: "user",
    })),

    ...lawyerProfiles.map((item) => ({
      id: `lawyer-profile-${item.id}`,
      title: "Professional profile submitted",
      detail: item.name || "New lawyer",
      date: item.createdAt,
      type: "lawyer",
    })),
  ]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 5);

  const total = appointments.length || 1;

  const statusData = [
    { label: "Accepted", count: acceptedCount, className: "accepted" },
    { label: "Pending", count: pendingCount, className: "pending" },
    { label: "Rejected", count: rejectedCount, className: "rejected" },
    { label: "Cancelled", count: cancelledCount, className: "cancelled" },
  ];

  const formatDate = (value) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getProfileStatus = (profile) => {
    if (profile.status) return profile.status;
    return profile.verified ? "Approved" : "Pending";
  };

  return (
    <main className="admin-dashboard">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION / OVERVIEW</p>
          <h1>Admin Dashboard</h1>
          <p>Monitor, review and manage the LegalConnect platform.</p>
        </div>

        <div className="admin-badge">
          <ShieldCheck size={18} /> Admin Panel
        </div>
      </header>

      {/* PLATFORM STATISTICS */}
      <section className="admin-stats">
        <article className="admin-stat-card">
          <span className="admin-stat-icon navy"><Users /></span>
          <p>Total Users</p>
          <h2>{users.length}</h2>
          <small>Registered accounts</small>
        </article>

        <article className="admin-stat-card">
          <span className="admin-stat-icon gold"><BriefcaseBusiness /></span>
          <p>Total Lawyers</p>
          <h2>{totalLawyers}</h2>
          <small>Sample and registered profiles</small>
        </article>

        <article className="admin-stat-card">
          <span className="admin-stat-icon orange"><Clock /></span>
          <p>Pending Verifications</p>
          <h2>{pendingVerification}</h2>
          <small>Profiles awaiting review</small>
        </article>

        <article className="admin-stat-card">
          <span className="admin-stat-icon green"><CalendarDays /></span>
          <p>Consultation Requests</p>
          <h2>{appointments.length}</h2>
          <small>{acceptedCount} accepted requests</small>
        </article>
      </section>

      {/* ANALYTICS */}
      <section className="admin-analytics-grid">
        <article className="admin-section analytics-card">
          <div className="admin-section-heading">
            <div>
              <span className="admin-section-eyebrow">PLATFORM INSIGHTS</span>
              <h2>Consultation Overview</h2>
              <p>Current appointment status breakdown.</p>
            </div>
            <Activity className="analytics-heading-icon" />
          </div>

          <div className="analytics-total">
            <strong>{appointments.length}</strong>
            <span>Total consultation requests</span>
          </div>

          <div className="analytics-bars">
            {statusData.map((item) => (
              <div className="analytics-bar-row" key={item.label}>
                <div className="analytics-bar-label">
                  <span>{item.label}</span>
                  <strong>{item.count}</strong>
                </div>

                <div className="analytics-track">
                  <div
                    className={`analytics-fill ${item.className}`}
                    style={{
                      width: `${(item.count / total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-section platform-summary">
          <div className="admin-section-heading">
            <div>
              <span className="admin-section-eyebrow">PLATFORM HEALTH</span>
              <h2>At a Glance</h2>
              <p>Quick summary of platform records.</p>
            </div>
            <TrendingUp className="analytics-heading-icon" />
          </div>

          <div className="summary-row">
            <span><UserCheck /> Verified Lawyers</span>
            <strong>{verifiedCount}</strong>
          </div>

          <div className="summary-row">
            <span><Clock /> Pending Requests</span>
            <strong>{pendingCount}</strong>
          </div>

          <div className="summary-row">
            <span><CheckCircle /> Accepted Requests</span>
            <strong>{acceptedCount}</strong>
          </div>

          <div className="summary-row">
            <span><Users /> Registered Users</span>
            <strong>{users.length}</strong>
          </div>
        </article>
      </section>

      {/* NEW LAWYER PROFILE REVIEW */}
      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <span className="admin-section-eyebrow">
              PROFESSIONAL PROFILE REVIEW
            </span>
            <h2>New Lawyer Applications</h2>
            <p>
              Review professional details and manage submitted lawyer profiles.
            </p>
          </div>

          <span className="admin-count">
            {lawyerProfiles.length} Applications
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div className="admin-search" style={{ flex: "1 1 240px" }}>
            <Search />
            <input
              value={profileSearch}
              onChange={(e) => setProfileSearch(e.target.value)}
              placeholder="Search lawyer, specialization or city..."
            />
          </div>

          <div className="admin-filter">
            <Filter />
            <select
              value={profileFilter}
              onChange={(e) => setProfileFilter(e.target.value)}
            >
              <option value="All">All Applications</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {filteredProfiles.length === 0 ? (
          <div className="admin-empty">
            {lawyerProfiles.length === 0
              ? "No lawyer applications have been submitted yet."
              : "No matching lawyer applications found."}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
              gap: "18px",
            }}
          >
            {filteredProfiles.map((profile) => {
              const status = getProfileStatus(profile);

              return (
                <article
                  key={profile.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #e9e5dc",
                    borderRadius: "12px",
                    padding: "22px",
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: "0 0 6px", color: "#14243a" }}>
                        {profile.name || "Unnamed Lawyer"}
                      </h3>
                      <p style={{ margin: 0, color: "#697586", fontSize: "13px" }}>
                        {profile.email || "Email not provided"}
                      </p>
                    </div>

                    <span
                      className={`admin-status ${
                        status === "Approved"
                          ? "verified"
                          : "unverified"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: "12px",
                      color: "#46566b",
                      fontSize: "13px",
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      <BriefcaseBusiness size={15} style={{ verticalAlign: "middle", marginRight: "8px" }} />
                      <strong>Specialization:</strong>{" "}
                      {profile.specialization || "Not provided"}
                    </p>

                    <p style={{ margin: 0 }}>
                      <MapPin size={15} style={{ verticalAlign: "middle", marginRight: "8px" }} />
                      <strong>Location:</strong>{" "}
                      {profile.location || "Not provided"}
                    </p>

                    <p style={{ margin: 0 }}>
                      <Clock size={15} style={{ verticalAlign: "middle", marginRight: "8px" }} />
                      <strong>Experience:</strong>{" "}
                      {profile.experience || 0} years
                    </p>

                    <p style={{ margin: 0 }}>
                      <IndianRupee size={15} style={{ verticalAlign: "middle", marginRight: "8px" }} />
                      <strong>Consultation Fee:</strong>{" "}
                      ₹{Number(profile.fee || 0).toLocaleString("en-IN")}
                    </p>

                    <p style={{ margin: 0 }}>
                      <FileText size={15} style={{ verticalAlign: "middle", marginRight: "8px" }} />
                      <strong>Consultation:</strong>{" "}
                      {profile.consultation || "Not provided"}
                    </p>

                    <div>
                      <strong>Languages:</strong>{" "}
                      {Array.isArray(profile.languages)
                        ? profile.languages.join(", ")
                        : profile.languages || "Not provided"}
                    </div>

                    <div>
                      <strong>About:</strong>
                      <p
                        style={{
                          margin: "5px 0 0",
                          lineHeight: 1.6,
                          color: "#697586",
                        }}
                      >
                        {profile.about || "No description provided."}
                      </p>
                    </div>

                    <p style={{ margin: 0, color: "#8993a1" }}>
                      Submitted: {formatDate(profile.createdAt)}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginTop: "20px",
                    }}
                  >
                    <button
                      className="verification-button"
                      onClick={() => updateProfileStatus(profile.id, "Approved")}
                      disabled={status === "Approved"}
                      style={{
                        opacity: status === "Approved" ? 0.55 : 1,
                        cursor: status === "Approved" ? "not-allowed" : "pointer",
                      }}
                    >
                      <ShieldCheck />
                      Approve
                    </button>

                    <button
                      className="verification-button"
                      onClick={() => updateProfileStatus(profile.id, "Rejected")}
                      disabled={status === "Rejected"}
                      style={{
                        opacity: status === "Rejected" ? 0.55 : 1,
                        cursor: status === "Rejected" ? "not-allowed" : "pointer",
                        borderColor: "#d9a6a2",
                        color: "#a83d36",
                      }}
                    >
                      <ShieldX />
                      Reject
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* EXISTING SAMPLE LAWYER DIRECTORY */}
      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <span className="admin-section-eyebrow">LAWYER DIRECTORY</span>
            <h2>Sample Lawyer Management</h2>
            <p>Manage verification labels for the built-in demo profiles.</p>
          </div>
          <span className="admin-count">{lawyerList.length} Profiles</span>
        </div>

        <div className="admin-toolbar">
          <div className="admin-search">
            <Search />
            <input
              value={lawyerSearch}
              onChange={(e) => setLawyerSearch(e.target.value)}
              placeholder="Search lawyer, practice area or city..."
            />
          </div>

          <div className="admin-filter">
            <Filter />
            <select
              value={lawyerFilter}
              onChange={(e) => setLawyerFilter(e.target.value)}
            >
              <option value="All">All Profiles</option>
              <option value="Verified">Verified</option>
              <option value="Unverified">Unverified</option>
            </select>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Lawyer</th>
                <th>Specialization</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredLawyers.map((lawyer) => (
                <tr key={lawyer.id}>
                  <td><strong>{lawyer.name}</strong></td>
                  <td>{lawyer.specialization}</td>
                  <td>
                    <span className="admin-location">
                      <MapPin />{lawyer.location}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`admin-status ${
                        lawyer.verified ? "verified" : "unverified"
                      }`}
                    >
                      {lawyer.verified ? "Verified Demo" : "Unverified"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="verification-button"
                      onClick={() => toggleVerification(lawyer.id)}
                    >
                      {lawyer.verified
                        ? <><ShieldX /> Unverify</>
                        : <><ShieldCheck /> Verify</>}
                    </button>
                  </td>
                </tr>
              ))}

              {filteredLawyers.length === 0 && (
                <tr>
                  <td colSpan="5" className="admin-no-results">
                    No matching lawyer profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* USER MANAGEMENT */}
      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <span className="admin-section-eyebrow">ACCOUNT DIRECTORY</span>
            <h2>User Management</h2>
            <p>View client and lawyer accounts registered in this demo.</p>
          </div>
          <span className="admin-count">{users.length} Users</span>
        </div>

        <div className="admin-search user-search">
          <Search />
          <input
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Search by user name or email..."
          />
        </div>

        {filteredUsers.length === 0 ? (
          <div className="admin-empty">
            {users.length === 0
              ? "No registered users available yet."
              : "No matching users found."}
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Account Type</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.email || index}>
                    <td><strong>{user.name || "Unnamed User"}</strong></td>
                    <td>
                      <span className="admin-location">
                        <Mail />{user.email || "Not provided"}
                      </span>
                    </td>
                    <td>
                      <span className="admin-role">
                        {user.role || "client"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CONSULTATION MANAGEMENT */}
      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <span className="admin-section-eyebrow">BOOKING DIRECTORY</span>
            <h2>Consultation Management</h2>
            <p>Review appointment requests and their current status.</p>
          </div>
          <span className="admin-count">{appointments.length} Requests</span>
        </div>

        <div className="admin-appointment-filters">
          {["All", "Pending", "Accepted", "Rejected", "Cancelled", "Completed"].map(
            (filter) => (
              <button
                key={filter}
                className={appointmentFilter === filter ? "selected" : ""}
                onClick={() => setAppointmentFilter(filter)}
              >
                {filter}
              </button>
            )
          )}
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="admin-empty">
            No consultation requests in this category.
          </div>
        ) : (
          <div className="admin-appointments">
            {filteredAppointments.map((appointment) => (
              <article className="admin-appointment-row" key={appointment.id}>
                <div className="admin-appointment-main">
                  <strong>{appointment.lawyerName || "Lawyer consultation"}</strong>
                  <p>{appointment.specialization || "Legal consultation"}</p>
                  <span>
                    <CalendarDays />
                    {formatDate(appointment.date)} · {appointment.time || "Time not selected"}
                  </span>
                </div>

                <span
                  className={`admin-appointment-status ${
                    (appointment.status || "Pending").toLowerCase()
                  }`}
                >
                  {appointment.status || "Pending"}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* RECENT ACTIVITY */}
      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <span className="admin-section-eyebrow">LATEST UPDATES</span>
            <h2>Recent Activity</h2>
            <p>Latest registrations and consultation requests.</p>
          </div>
          <Activity className="analytics-heading-icon" />
        </div>

        {activityItems.length === 0 ? (
          <div className="admin-empty">
            Recent platform activity will appear here.
          </div>
        ) : (
          <div className="admin-activity-list">
            {activityItems.map((item) => (
              <div className="admin-activity-item" key={item.id}>
                <span className="activity-icon">
                  {item.type === "user" ? (
                    <Users />
                  ) : item.type === "lawyer" ? (
                    <BriefcaseBusiness />
                  ) : (
                    <CalendarDays />
                  )}
                </span>

                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>

                <small>
                  {item.date ? formatDate(item.date) : "Recently"}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="admin-demo-note">
        <ShieldCheck />
        Demo environment: records are stored in this browser. Profile approval
        is a simulated admin workflow and does not represent actual Bar Council
        verification.
      </div>
    </main>
  );
}

export default AdminDashboard;
