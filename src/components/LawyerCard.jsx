
import { Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Star,
  ShieldCheck,
  ArrowRight,
  Clock,
} from "lucide-react";
import "./LawyerCard.css";

function LawyerCard({ lawyer }) {
  return (
    <article className="lawyer-card">
      <div className="lawyer-card-top">
        <div className="lawyer-avatar">
          {lawyer.initials}
        </div>

        <div className="lawyer-rating">
          <Star size={15} fill="#c5a46d" color="#c5a46d" />
          <strong>{lawyer.rating}</strong>
          <span>({lawyer.reviews} reviews)</span>
        </div>
      </div>

      <div className="lawyer-card-info">
        <div className="lawyer-verified">
          <ShieldCheck size={15} />
          {lawyer.verified
            ? "Demo verified profile"
            : "Verification pending"}
        </div>

        <h3>{lawyer.name}</h3>
        <p className="lawyer-title">{lawyer.title}</p>

        <div className="lawyer-meta">
          <span>
            <Briefcase size={15} />
            {lawyer.experience} Years
          </span>

          <span>
            <MapPin size={15} />
            {lawyer.location}
          </span>
        </div>

        <div className="lawyer-specialization">
          {lawyer.specialization}
        </div>

        <div className="lawyer-card-bottom">
          <div className="lawyer-fee">
            <span className="fee-label">Consultation fee</span>
            <strong>₹{lawyer.fee.toLocaleString("en-IN")}</strong>
            <span className="fee-duration">
              <Clock size={12} /> Per consultation
            </span>
          </div>

          <Link
            to={`/lawyer/${lawyer.id}`}
            className="view-profile-btn"
          >
            View Profile
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default LawyerCard;
