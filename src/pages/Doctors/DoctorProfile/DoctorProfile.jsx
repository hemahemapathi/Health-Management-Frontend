import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Tabs, Tab, Form, ListGroup } from 'react-bootstrap';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaUserMd, FaCalendarAlt, FaStar, FaStarHalfAlt, FaRegStar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import AnimatedButton from '../../../components/Buttons/AnimatedButton';
import './DoctorProfile.css';

const DoctorProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  // Check if we're in the doctor dashboard context
  const isDoctorDashboard = location.pathname.includes('/doctor-dashboard/profile');

  useEffect(() => {
    fetchDoctorDetails();
  }, [id, isDoctorDashboard]);

  useEffect(() => {
    if (selectedDate && doctor) {
      fetchAvailableSlots();
    }
  }, [selectedDate, doctor]);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      let response;
      
      if (isDoctorDashboard) {
        // If we're in the doctor dashboard, fetch the doctor's own profile
        response = await axios.get('https://health-management-backend.onrender.com/api/doctors/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else if (id) {
        // If we have an ID parameter, fetch that specific doctor
        response = await axios.get(`https://health-management-backend.onrender.com/api/doctors/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        setError('Doctor ID is required');
        setLoading(false);
        return;
      }

      console.log("Doctor data received:", response.data);
      setDoctor(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching doctor details:", err);
      setError(err.response?.data?.message || 'Failed to fetch doctor details');
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const doctorId = isDoctorDashboard ? doctor._id : id;
      
      const response = await axios.get(`https://health-management-backend.onrender.com/api/doctors/${doctorId}/available-slots`, {
        params: { date: selectedDate },
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      setAvailableSlots(response.data.data || []);
    } catch (err) {
      console.error('Error fetching available slots:', err);
    }
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star-icon filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="star-icon half" />);
      } else {
        stars.push(<FaRegStar key={i} className="star-icon empty" />);
      }
    }
    
    return (
      <div className="star-rating">
        {stars} <span className="rating-value">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const calculateAverageRating = () => {
    if (!doctor || !doctor.ratings || doctor.ratings.length === 0) {
      return 0;
    }
    
    const totalRating = doctor.ratings.reduce((sum, item) => sum + item.rating, 0);
    return totalRating / doctor.ratings.length;
  };

  const formatAvailability = (availability) => {
    if (!availability || availability.length === 0) {
      return 'No availability information';
    }
    
    return availability.map(slot => (
      <div key={slot.day} className="availability-slot">
        <span className="day">{slot.day}:</span> {slot.startTime} - {slot.endTime}
      </div>
    ));
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading doctor profile...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!doctor) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          Doctor not found
        </Alert>
      </Container>
    );
  }

  const averageRating = calculateAverageRating();

  return (
    <Container className="doctor-profile-container my-5">
      <Row>
        <Col lg={4} md={5}>
          <Card className="profile-card mb-4">
            <Card.Body className="text-center">
              <div className="doctor-avatar">
                {doctor.user?.profilePicture ? (
                  <img 
                    src={doctor.user.profilePicture} 
                    alt={`Dr. ${doctor.user?.name || 'Unknown'}`} 
                    className="avatar-img"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <FaUserMd size={50} />
                  </div>
                )}
              </div>
              
              <h3 className="doctor-name mt-3">Dr. {doctor.user?.name || 'Unknown'}</h3>
              <p className="doctor-specialization">{doctor.specialization}</p>
              
              {averageRating > 0 && (
                <div className="mb-3">
                  {renderStarRating(averageRating)}
                  <p className="review-count">
                    Based on {doctor.ratings?.length || 0} reviews
                  </p>
                </div>
              )}
              
              <div className="doctor-contact-info">
                {doctor.user?.email && (
                  <p className="contact-item">
                    <FaEnvelope className="contact-icon" />
                    {doctor.user.email}
                  </p>
                )}
                {doctor.user?.phone && (
                  <p className="contact-item">
                    <FaPhone className="contact-icon" />
                    {doctor.user.phone}
                  </p>
                )}
              </div>
              
              {!isDoctorDashboard && (
                <div className="action-buttons">
                  <AnimatedButton
                    variant="primary"
                    icon={<FaCalendarAlt />}
                    as={Link}
                    to={`/appointments/book?doctorId=${doctor._id}`}
                  >
                    Book Appointment
                  </AnimatedButton>
                  
                  <AnimatedButton
                    variant="outline"
                    icon={<FaPhone />}
                    iconPosition="right"
                  >
                    Contact Doctor
                  </AnimatedButton>
                </div>
              )}
              
              {isDoctorDashboard && (
                <div className="action-buttons">
                  <AnimatedButton
                    variant="primary"
                    icon={<FaCalendarAlt />}
                    as={Link}
                    to={`/doctor-dashboard/schedule`}
                  >
                    Manage Schedule
                  </AnimatedButton>
                  
                  <AnimatedButton
                    variant="outline"
                    icon={<FaUserMd />}
                    as={Link}
                    to={`/doctor-dashboard/edit-profile`}
                  >
                    Edit Profile
                  </AnimatedButton>
                </div>
              )}
            </Card.Body>
          </Card>
          
          <Card className="info-card">
            <Card.Body>
              <h5 className="card-section-title">
                <FaClock className="section-icon" />
                Availability
              </h5>
              <div className="availability-info">
                {formatAvailability(doctor.availability)}
              </div>
              
              <h5 className="card-section-title mt-4">
                <FaUserMd className="section-icon" />
                Experience
              </h5>
              <p>{doctor.experience ? `${doctor.experience} years` : 'Not specified'}</p>
              
              <h5 className="card-section-title mt-4">
                <FaStar className="section-icon" />
                Qualifications
              </h5>
              {doctor.qualifications && doctor.qualifications.length > 0 ? (
                <ul className="qualifications-list">
                  {doctor.qualifications.map((qualification, index) => (
                    <li key={index}>{qualification}</li>
                  ))}
                </ul>
              ) : (
                <p>Not specified</p>
              )}
              
              {doctor.consultationFee && (
                <>
                  <h5 className="card-section-title mt-4">
                    Consultation Fee
                  </h5>
                  <p className="consultation-fee">${doctor.consultationFee}</p>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8} md={7}>
          <Card className="content-card">
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="profile-tabs"
              >
                <Tab eventKey="info" title="About">
                  <div className="tab-content-wrapper">
                    <h4>About Dr. {doctor.user?.name || 'Unknown'}</h4>
                    <p className="doctor-bio">
                      {doctor.bio || 'No information available about this doctor.'}
                    </p>
                    
                    <h5 className="mt-4">Specialization</h5>
                    <p>{doctor.specialization}</p>
                    
                    <h5 className="mt-4">Services Offered</h5>
                    {doctor.services && doctor.services.length > 0 ? (
                      <ul className="services-list">
                        {doctor.services.map((service, index) => (
                          <li key={index}>{service}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No specific services listed</p>
                    )}
                  </div>
                </Tab>
                
                <Tab eventKey="reviews" title="Reviews">
                  <div className="tab-content-wrapper">
                    <h4>Patient Reviews</h4>
                    
                    {doctor.ratings && doctor.ratings.length > 0 ? (
                      <div className="reviews-container">
                        {doctor.ratings.map((review, index) => (
                          <div key={index} className="review-item">
                            <div className="review-header">
                              <div className="reviewer-info">
                                <h6>{review.patient?.name || 'Anonymous Patient'}</h6>
                                <small className="text-muted">
                                  {new Date(review.date).toLocaleDateString()}
                                </small>
                              </div>
                              <div className="review-rating">
                                {renderStarRating(review.rating)}
                              </div>
                            </div>
                            <p className="review-text">{review.review}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Alert variant="info">
                        No reviews yet for this doctor.
                      </Alert>
                    )}
                  </div>
                </Tab>
                
                {!isDoctorDashboard && (
                  <Tab eventKey="schedule" title="Schedule">
                    <div className="tab-content-wrapper">
                      <h4>Check Availability</h4>
                      <p>Select a date to see available appointment slots:</p>
                      
                      <Form.Group className="mb-4">
                        <Form.Label>Select Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={selectedDate}
                          onChange={handleDateChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="date-picker"
                        />
                      </Form.Group>
                      
                      {selectedDate && (
                        <>
                          <h5>Available Slots for {new Date(selectedDate).toLocaleDateString()}</h5>
                          
                          {availableSlots.length > 0 ? (
                            <div className="time-slots">
                              {availableSlots.map((slot, index) => (
                                <Button 
                                  key={index}
                                  variant="outline-primary"
                                  className="time-slot-btn"
                                  as={Link}
                                  to={`/appointments/book?doctorId=${doctor._id}&date=${selectedDate}&time=${slot}`}
                                >
                                  {slot}
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <Alert variant="info">
                              No available slots for this date. Please try another date.
                            </Alert>
                          )}
                        </>
                      )}
                    </div>
                  </Tab>
                )}
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorProfile;
