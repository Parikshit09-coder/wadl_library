import { FiBook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-brand">
          <div className="footer-logo">
            <FiBook className="footer-logo-icon" />
            <span>PICT Library</span>
          </div>
          <p className="footer-description">
            Empowering PICT students and faculty with seamless access to world-class research resources across IEEE, Google Scholar, and more.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/videos">Video Tutorials</Link></li>
            <li><Link to="/search">Search Papers</Link></li>
            <li><Link to="/login">Sign In</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Research Providers</h4>
          <ul>
            <li><a href="https://ieeexplore.ieee.org" target="_blank" rel="noopener noreferrer">IEEE Xplore</a></li>
            <li><a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer">Google Scholar</a></li>
            <li><a href="https://arxiv.org" target="_blank" rel="noopener noreferrer">arXiv</a></li>
            <li><a href="https://dl.acm.org" target="_blank" rel="noopener noreferrer">ACM Digital Library</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul className="contact-list">
            <li><FiPhone /> <span>020 2437 1101</span></li>
            <li><FiMail /> <span>library@pict.edu</span></li>
            <li><FiMapPin /> <span>Survey No. 27, Dhankawadi, Pune</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 PICT Library Portal. All rights reserved.</p>
      </div>
    </footer>
  );
}
