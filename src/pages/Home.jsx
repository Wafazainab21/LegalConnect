
import { Link } from "react-router-dom";
import {
  Search, ShieldCheck, CalendarCheck, MessageCircle,
  ArrowRight, Scale, BriefcaseBusiness, Users,
  Home as HomeIcon, Heart, FileText, Gavel, Star,
  ChevronDown, Quote
} from "lucide-react";
import { useState } from "react";

const categories = [
  { name: "Family Law", icon: Heart, description: "Marriage, divorce & family matters" },
  { name: "Criminal Law", icon: Gavel, description: "Criminal defence & legal rights" },
  { name: "Corporate Law", icon: BriefcaseBusiness, description: "Business & company matters" },
  { name: "Property Law", icon: HomeIcon, description: "Property disputes & agreements" },
  { name: "Civil Law", icon: Scale, description: "Civil disputes & legal claims" },
  { name: "Documentation", icon: FileText, description: "Legal documents & agreements" }
];

const featuredLawyers = [
  { name: "Adv. Arjun Mehta", role: "Corporate Law", experience: "12 Years Experience", rating: "4.9", initials: "AM" },
  { name: "Adv. Priya Sharma", role: "Family Law", experience: "9 Years Experience", rating: "4.8", initials: "PS" },
  { name: "Adv. Rahul Verma", role: "Criminal Law", experience: "15 Years Experience", rating: "4.9", initials: "RV" }
];

const testimonials = [
  {
    name: "Ananya R.",
    role: "Sample Client Review",
    initials: "AR",
    review: "The platform made it easy to explore different legal specializations and understand the consultation process."
  },
  {
    name: "Rahul M.",
    role: "Sample Client Review",
    initials: "RM",
    review: "A clean and simple experience. I could compare lawyer profiles and find the information I needed."
  },
  {
    name: "Sneha K.",
    role: "Sample Client Review",
    initials: "SK",
    review: "The appointment request process is straightforward and the dashboard makes it easy to track requests."
  }
];

const faqs = [
  {
    question: "How can I find the right lawyer?",
    answer: "Visit the Find Lawyers page and use filters such as specialization, location, experience and consultation fees."
  },
  {
    question: "How do I book a consultation?",
    answer: "Open a lawyer's profile, select Book Consultation, choose your preferred consultation type and submit your request."
  },
  {
    question: "Can I choose an online consultation?",
    answer: "The platform demo supports Video, Audio and Chat consultation options where they are listed on a lawyer's profile."
  },
  {
    question: "Can I manage my appointments?",
    answer: "Yes. Sign in and visit your Client Dashboard to view and manage your saved appointment requests."
  },
  {
    question: "Are the lawyer profiles real and verified?",
    answer: "The profiles currently displayed are sample demonstration data. They are not real endorsements or independently verified lawyer credentials."
  }
];

function Home() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">
            <ShieldCheck size={16} /> TRUSTED LEGAL PROFESSIONALS
          </span>
          <h1>
            The Right Legal Support.
            <span> Just One Connection Away.</span>
          </h1>
          <p>
            Find experienced lawyers, compare profiles and book
            consultations with confidence. Your legal journey starts here.
          </p>
          <form
            className="hero-search"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = "/lawyers";
            }}
          >
            <Search size={21} />
            <input type="text" placeholder="Search by legal issue, lawyer or location..." />
            <button type="submit">Find a Lawyer</button>
          </form>
          <div className="hero-trust">
            <span><ShieldCheck size={17} /> Profile information</span>
            <span><Star size={17} /> Sample reviews</span>
            <span><CalendarCheck size={17} /> Easy booking</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-placeholder">
            <Scale size={90} strokeWidth={1} />
            <span>LEGALCONNECT</span>
            <p>Justice • Trust • Guidance</p>
          </div>
          <div className="hero-floating-card">
            <div className="floating-icon"><Users size={22} /></div>
            <div>
              <strong>Expert Legal Guidance</strong>
              <p>Explore legal professionals</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div><strong>6+</strong><span>Legal Categories</span></div>
        <div><strong>Easy</strong><span>Lawyer Discovery</span></div>
        <div><strong>24/7</strong><span>Online Access</span></div>
        <div><strong>Secure</strong><span>Account Access</span></div>
      </section>

      <section className="categories-section">
        <div className="section-heading">
          <span>OUR LEGAL SERVICES</span>
          <h2>Explore Legal Categories</h2>
          <p>Find professional guidance for different areas of law.</p>
        </div>
        <div className="category-grid">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link to="/lawyers" className="category-card" key={category.name}>
                <div className="category-icon"><Icon size={25} /></div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span className="category-arrow">Explore <ArrowRight size={16} /></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <span>MEET OUR LEGAL PROFESSIONALS</span>
          <h2>Featured Legal Experts</h2>
          <p>Explore sample lawyer profiles across different legal specializations.</p>
        </div>
        <div className="featured-grid">
          {featuredLawyers.map((lawyer) => (
            <div className="featured-card" key={lawyer.name}>
              <div className="featured-avatar">{lawyer.initials}</div>
              <div className="featured-rating">
                <Star size={15} fill="currentColor" /> {lawyer.rating}
              </div>
              <h3>{lawyer.name}</h3>
              <span className="featured-specialization">{lawyer.role}</span>
              <p>{lawyer.experience}</p>
              <Link to="/lawyers">View Profile <ArrowRight size={16} /></Link>
            </div>
          ))}
        </div>
        <div className="featured-action">
          <Link to="/lawyers">Explore All Lawyers <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <span>SIMPLE PROCESS</span>
          <h2>How LegalConnect Works</h2>
          <p>Getting legal guidance is simple and convenient.</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <Search size={30} />
            <h3>Find a Lawyer</h3>
            <p>Search lawyers by specialization, experience and location.</p>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <CalendarCheck size={30} />
            <h3>Book a Consultation</h3>
            <p>Choose a consultation type and request a suitable appointment.</p>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <MessageCircle size={30} />
            <h3>Get Legal Guidance</h3>
            <p>Connect with your selected lawyer and manage your appointment.</p>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="section-heading">
          <span>CLIENT EXPERIENCES</span>
          <h2>What People Say</h2>
          <p>Example feedback illustrating the platform experience.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((item) => (
            <article className="testimonial-card" key={item.name}>
              <Quote className="testimonial-quote" size={30} />
              <div className="testimonial-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-review">{item.review}</p>
              <div className="testimonial-person">
                <div className="testimonial-avatar">{item.initials}</div>
                <div>
                  <h3>{item.name}</h3>
                  <span>{item.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="demo-disclaimer">Illustrative sample testimonials — not actual client endorsements.</p>
      </section>

      <section className="faq-section">
        <div className="section-heading">
          <span>GOT QUESTIONS?</span>
          <h2>Frequently Asked Questions</h2>
          <p>Quick answers to help you get started with LegalConnect.</p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div className={`faq-item ${openFaq === index ? "active" : ""}`} key={faq.question}>
              <button
                className="faq-question"
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                aria-expanded={openFaq === index}
              >
                {faq.question}
                <ChevronDown size={20} />
              </button>
              {openFaq === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div>
          <span>YOUR LEGAL JOURNEY STARTS HERE</span>
          <h2>Need the Right Legal Guidance?</h2>
          <p>Discover lawyers and take the next step with confidence.</p>
        </div>
        <Link to="/lawyers">Explore Lawyers <ArrowRight size={18} /></Link>
      </section>
    </main>
  );
}

export default Home;
