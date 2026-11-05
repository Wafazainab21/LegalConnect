import { Link } from "react-router-dom";
import { Scale, ArrowLeft } from "lucide-react";
import "./NotFound.css";

function NotFound() {
  return (
    <main className="notfound-page">
      <div className="notfound-content">
        <div className="notfound-icon">
          <Scale size={38} />
        </div>

        <h1>404</h1>
        <h2>Page Not Found</h2>

        <p>
          Sorry, the page you are looking for doesn't exist
          or may have been moved.
        </p>

        <Link to="/" className="notfound-button">
          <ArrowLeft size={17} />
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default NotFound;