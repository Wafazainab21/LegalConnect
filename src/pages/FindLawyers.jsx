
import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Users,
  MapPin,
  BriefcaseBusiness,
  RotateCcw,
  Scale,
  Sparkles,
  Star,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import LawyerCard from "../components/LawyerCard";
import initialLawyers from "../data/lawyers";
import categories from "../data/categories";
import "./FindLawyers.css";

function readStorage(key, fallback) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    return saved ?? fallback;
  } catch {
    return fallback;
  }
}

function FindLawyers() {
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All Categories");
  const [maxFee, setMaxFee] = useState("5000");
  const [minExperience, setMinExperience] = useState("0");
  const [minRating, setMinRating] = useState("0");

  // Read sample lawyers, including admin's verification changes.
  const sampleLawyers = useMemo(
    () => readStorage("legalconnect_lawyers", initialLawyers),
    []
  );

  // Only approved registered lawyer profiles are public.
  const approvedLawyers = useMemo(() => {
    const profiles = readStorage("legalconnect_lawyer_profiles", []);

    if (!Array.isArray(profiles)) return [];

    return profiles
      .filter(
        (profile) =>
          profile.verified === true || profile.status === "Approved"
      )
      .map((profile) => ({
        ...profile,
        id: `registered-${profile.userId}`,
        profileId: profile.id,
        userId: profile.userId,
        isRegisteredProfile: true,
        title: profile.title || "Advocate",
        rating: Number(profile.rating || 0),
        reviews: Number(profile.reviews || 0),
        languages: Array.isArray(profile.languages)
          ? profile.languages
          : [],
        consultation: profile.consultation || "Online Consultation",
        verified: true,
        initials:
          profile.initials ||
          (profile.name || "LC")
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
      }));
  }, []);

  const allLawyers = useMemo(
    () => [...sampleLawyers, ...approvedLawyers],
    [sampleLawyers, approvedLawyers]
  );

  const filteredLawyers = useMemo(() => {
    return allLawyers.filter((lawyer) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        (lawyer.name || "").toLowerCase().includes(searchText) ||
        (lawyer.location || "").toLowerCase().includes(searchText) ||
        (lawyer.specialization || "").toLowerCase().includes(searchText) ||
        (lawyer.title || "").toLowerCase().includes(searchText);

      const matchesSpecialization =
        specialization === "All Categories" ||
        lawyer.specialization === specialization;

      const matchesFee = Number(lawyer.fee || 0) <= Number(maxFee);

      const matchesExperience =
        Number(lawyer.experience || 0) >= Number(minExperience);

      const matchesRating =
        Number(lawyer.rating || 0) >= Number(minRating);

      return (
        matchesSearch &&
        matchesSpecialization &&
        matchesFee &&
        matchesExperience &&
        matchesRating
      );
    });
  }, [
    allLawyers,
    search,
    specialization,
    maxFee,
    minExperience,
    minRating,
  ]);

  const resetFilters = () => {
    setSearch("");
    setSpecialization("All Categories");
    setMaxFee("5000");
    setMinExperience("0");
    setMinRating("0");
  };

  return (
    <main className="find-lawyers-page">
      <section className="lawyers-heading">
        <div className="heading-content">
          <span className="heading-label">
            <Scale size={15} />
            LEGAL PROFESSIONAL NETWORK
          </span>

          <h1>
            Find the Right <span>Lawyer</span>
          </h1>

          <p>
            Connect with legal professionals who understand your needs.
            Explore specializations, compare experience and find the right
            consultation for your situation.
          </p>

          <div className="heading-trust">
            <span>
              <Users size={16} />
              {allLawyers.length} Lawyer Profiles
            </span>
            <span>
              <BriefcaseBusiness size={16} />
              Multiple Practice Areas
            </span>
          </div>
        </div>

        <div className="heading-decoration">
          <div className="decoration-circle">
            <Scale size={76} strokeWidth={1.1} />
          </div>
          <Sparkles className="decoration-sparkle" size={25} />
        </div>
      </section>

      <section className="lawyers-search-section">
        <div className="search-intro">
          <h2>Explore Legal Experts</h2>
          <p>Search by lawyer name, legal area or city.</p>
        </div>

        <div className="lawyers-search-box">
          <Search size={21} />
          <input
            type="text"
            placeholder="Search lawyer, specialization or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              className="clear-search"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </section>

      <section className="lawyers-content">
        <aside className="lawyer-filters">
          <div className="filter-heading">
            <h3>
              <SlidersHorizontal size={19} />
              Refine Search
            </h3>
            <span>FILTERS</span>
          </div>

          <div className="filter-divider" />

          <div className="filter-group">
            <label htmlFor="specialization">Legal Specialization</label>
            <select
              id="specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="maxFee">Maximum Consultation Fee</label>
            <select
              id="maxFee"
              value={maxFee}
              onChange={(e) => setMaxFee(e.target.value)}
            >
              <option value="5000">Any fee</option>
              <option value="800">Up to ₹800</option>
              <option value="1000">Up to ₹1,000</option>
              <option value="1500">Up to ₹1,500</option>
              <option value="2000">Up to ₹2,000</option>
              <option value="3000">Up to ₹3,000</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="experience">Minimum Experience</label>
            <select
              id="experience"
              value={minExperience}
              onChange={(e) => setMinExperience(e.target.value)}
            >
              <option value="0">Any experience</option>
              <option value="5">5+ years</option>
              <option value="10">10+ years</option>
              <option value="15">15+ years</option>
              <option value="20">20+ years</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="minRating">
              <Star size={13} fill="#c5a46d" color="#c5a46d" />
              Minimum Lawyer Rating
            </label>
            <select
              id="minRating"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              <option value="0">Any rating</option>
              <option value="4">4.0+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.8">4.8+ Stars</option>
            </select>
          </div>

          <button className="reset-filters" onClick={resetFilters}>
            <RotateCcw size={16} />
            Reset All Filters
          </button>

          <div className="filter-help-card">
            <div className="filter-help-icon">
              <MessageCircle size={21} />
            </div>
            <h4>Need Help Choosing?</h4>
            <p>
              Compare lawyer experience, specialization and consultation
              fees before viewing a profile.
            </p>
            <div className="filter-help-trust">
              <ShieldCheck size={14} />
              Check profile details before choosing
            </div>
          </div>
        </aside>

        <div className="lawyer-results">
          <div className="results-header">
            <div>
              <span className="results-eyebrow">OUR DIRECTORY</span>
              <h2>Available Lawyers</h2>
              <p>
                Showing <strong>{filteredLawyers.length}</strong> of{" "}
                <strong>{allLawyers.length}</strong> profiles
              </p>
            </div>

            <div className="directory-label">
              <Users size={17} />
              LegalConnect Directory
            </div>
          </div>

          {filteredLawyers.length > 0 ? (
            <div className="lawyer-grid">
              {filteredLawyers.map((lawyer) => (
                <LawyerCard lawyer={lawyer} key={lawyer.id} />
              ))}
            </div>
          ) : (
            <div className="no-lawyers">
              <div className="no-lawyers-icon">
                <Search size={32} />
              </div>
              <h3>No lawyers found</h3>
              <p>
                We couldn't find matching profiles. Try changing your
                search or adjusting the filters.
              </p>
              <button onClick={resetFilters}>
                <RotateCcw size={16} />
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="directory-note">
        <ShieldCheck size={17} />
        <p>
          This demo directory includes sample lawyers and registered profiles
          approved within the LegalConnect demo workflow. Approval here does
          not represent independent legal credential verification.
        </p>
      </section>
    </main>
  );
}

export default FindLawyers;
