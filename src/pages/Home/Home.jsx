import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserMd, FaCalendarCheck, FaHospital, FaAward } from 'react-icons/fa';
import Footer from '../../components/Footer/Footer.jsx';
import './Home.css';

const Home = () => {
  const specialties = [
    { id: 1, title: 'Cardiology', icon: '🫀', description: 'Heart & Vascular Care' },
    { id: 2, title: 'Neurology', icon: '🧠', description: 'Brain & Nerve Care' },
    { id: 3, title: 'Pediatrics', icon: '👶', description: 'Child Healthcare' },
    { id: 4, title: 'Orthopedics', icon: '🦴', description: 'Bone & Joint Care' }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="display-4 fw-bold mb-4">Your Health Is Our Top Priority</h1>
                <p className="lead mb-4">Connect with top healthcare professionals and book appointments instantly.</p>
                <Link to="/doctors" className="btn btn-primary btn-lg me-3">Find Doctors</Link>
                <Link to="/register" className="btn btn-outline-primary btn-lg">Join Now</Link>
              </motion.div>
            </div>
            <div className="col-lg-6">
              <motion.img
                src="/assets/images/hero-doctor.png"
                alt="Healthcare"
                className="img-fluid"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-3">
              <motion.div 
                className="feature-card"
                whileHover={{ y: -10 }}
              >
                <FaUserMd className="feature-icon" />
                <h3>Expert Doctors</h3>
                <p>Access to qualified healthcare professionals</p>
              </motion.div>
            </div>
            <div className="col-md-3">
              <motion.div 
                className="feature-card"
                whileHover={{ y: -10 }}
              >
                <FaCalendarCheck className="feature-icon" />
                <h3>Easy Booking</h3>
                <p>Schedule appointments with just a few clicks</p>
              </motion.div>
            </div>
            <div className="col-md-3">
              <motion.div 
                className="feature-card"
                whileHover={{ y: -10 }}
              >
                <FaHospital className="feature-icon" />
                <h3>Quality Care</h3>
                <p>Top-rated medical facilities and services</p>
              </motion.div>
            </div>
            <div className="col-md-3">
              <motion.div 
                className="feature-card"
                whileHover={{ y: -10 }}
              >
                <FaAward className="feature-icon" />
                <h3>Certified</h3>
                <p>Verified and accredited healthcare providers</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="specialties-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Our Medical Specialties</h2>
          <div className="row g-4">
            {specialties.map(specialty => (
              <div key={specialty.id} className="col-md-6 col-lg-3">
                <motion.div 
                  className="specialty-card"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="specialty-icon">{specialty.icon}</span>
                  <h3>{specialty.title}</h3>
                  <p>{specialty.description}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-3">
              <div className="stat-card">
                <h2>1000+</h2>
                <p>Doctors</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <h2>50,000+</h2>
                <p>Patients</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <h2>30+</h2>
                <p>Specialties</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <h2>98%</h2>
                <p>Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;