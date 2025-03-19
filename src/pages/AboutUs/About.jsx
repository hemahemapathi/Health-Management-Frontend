import React from 'react';
import { motion } from 'framer-motion';
import { FaHospital, FaUserMd, FaAward, FaHandHoldingMedical } from 'react-icons/fa';
import './About.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const About = () => {
  const achievements = [
    { icon: FaHospital, count: '20+', label: 'Medical Centers' },
    { icon: FaUserMd, count: '100+', label: 'Skilled Doctors' },
    { icon: FaAward, count: '50+', label: 'Awards' },
    { icon: FaHandHoldingMedical, count: '1000+', label: 'Happy Patients' }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="row align-items-center">
            <motion.div 
              className="col-lg-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="display-4 fw-bold mb-4">Leading Healthcare Provider</h1>
              <p className="lead mb-4">Delivering excellence in healthcare through innovation, compassion, and expertise.</p>
            </motion.div>
            <motion.div 
              className="col-lg-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src="/assets/images/about-hero.jpg" alt="Healthcare" className="img-fluid rounded-3 shadow" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <motion.div 
                className="mission-card h-100"
                whileHover={{ y: -10 }}
              >
                <h3>Our Mission</h3>
                <p>To provide accessible, high-quality healthcare services that improve the well-being of our communities through innovation and compassionate care.</p>
              </motion.div>
            </div>
            <div className="col-md-6">
              <motion.div 
                className="vision-card h-100"
                whileHover={{ y: -10 }}
              >
                <h3>Our Vision</h3>
                <p>To be the leading healthcare provider, recognized for excellence in patient care, medical innovation, and community wellness.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="achievements py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Our Achievements</h2>
          <div className="row g-4">
            {achievements.map((item, index) => (
              <div key={index} className="col-md-3">
                <motion.div 
                  className="achievement-card text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <item.icon className="achievement-icon" />
                  <h3 className="achievement-count">{item.count}</h3>
                  <p className="achievement-label">{item.label}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section py-5">
        <div className="container">
          <h2 className="text-center mb-5">Our Leadership Team</h2>
          <div className="row g-4">
            {[1, 2, 3].map((member) => (
              <div key={member} className="col-md-4">
                <motion.div 
                  className="team-card"
                  whileHover={{ y: -10 }}
                >
                  <img src={`/assets/images/team-${member}.jpg`} alt="Team Member" className="team-img" />
                  <h4>Dr. John Doe</h4>
                  <p className="position">Medical Director</p>
                  <p className="description">Specialized in Internal Medicine with over 15 years of experience.</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
