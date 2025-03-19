import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import './Footer.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <div className="footer-brand">
              <img src="/logo.png" alt="MediCare Plus" className="footer-logo" />
              <h3>MediCare Plus</h3>
              <p>Your Health, Our Priority</p>
            </div>
            <div className="social-links">
              <a href="#" className="social-link"><FaFacebook /></a>
              <a href="#" className="social-link"><FaTwitter /></a>
              <a href="#" className="social-link"><FaLinkedin /></a>
              <a href="#" className="social-link"><FaInstagram /></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/doctors">Find Doctors</Link></li>
              <li><Link to="/appointments">Book Appointment</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5>Services</h5>
            <ul className="footer-links">
              <li><Link to="/services/emergency">Emergency Care</Link></li>
              <li><Link to="/services/qualified-doctors">Qualified Doctors</Link></li>
              <li><Link to="/services/online-booking">Online Booking</Link></li>
              <li><Link to="/services/medical-counseling">Medical Counseling</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5>Contact Info</h5>
            <ul className="contact-info">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                123 Healthcare Ave, Medical District
              </li>
              <li>
                <i className="fas fa-phone"></i>
                +1 234 567 8900
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                contact@medicareplus.com
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="row">
            <div className="col-md-6">
              <p>&copy; 2023 MediCare Plus. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
