import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  const contactInfo = [
    {
      icon: FaPhone,
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543']
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      details: ['contact@medicareplus.com', 'support@medicareplus.com']
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Location',
      details: ['123 Healthcare Avenue', 'Medical District, NY 10001']
    },
    {
      icon: FaClock,
      title: 'Working Hours',
      details: ['Monday - Friday: 9AM - 6PM', 'Saturday: 9AM - 2PM']
    }
  ];

  return (
    <>
      {/* Contact Hero */}
      <section className="contact-hero">
        <div className="container">
          <div className="row justify-content-center text-center">
            <motion.div 
              className="col-lg-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="display-4 fw-bold mb-4">Get in Touch</h1>
              <p className="lead mb-0">We're here to help and answer any questions you might have.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info py-5">
        <div className="container">
          <div className="row g-4">
            {contactInfo.map((info, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <motion.div 
                  className="contact-card"
                  whileHover={{ y: -10 }}
                >
                  <info.icon className="contact-icon" />
                  <h3>{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="mb-1">{detail}</p>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <motion.div 
                className="contact-form-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-center mb-4">Send us a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      />
                    </div>
                    <div className="col-12">
                      <textarea
                        className="form-control"
                        rows="5"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      ></textarea>
                    </div>
                    <div className="col-12 text-center">
                      <button type="submit" className="btn btn-primary btn-lg">
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1!2d-73.9!3d40.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMCcwMC4wIk4gNzPCsDU0JzAwLjAiVw!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </>
  );
};

export default Contact;
