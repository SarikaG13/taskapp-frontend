import { Link } from "react-router-dom";
import '../App.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2025 TaskManager App. All rights reserved</p>
        <div className="footer-links">
          <Link className="footer-link" to="/terms">Terms of Service</Link>
          <span> | </span>
          <Link className="footer-link" to="/privacy">Privacy Policy</Link>
          <span> | </span>
          <Link className="footer-link" to="/contact">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;