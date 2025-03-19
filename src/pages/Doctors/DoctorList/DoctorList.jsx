import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Pagination, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserMd, FaSearch, FaFilter, FaStar, FaStethoscope, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import './DoctorList.css';

const DoctorList = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { 
    fetchSpecializations();
    fetchDoctors(1);
  }, []);

  useEffect(() => {
    fetchDoctors(1, specialization, searchTerm);
  }, [specialization, searchTerm]);

  const fetchSpecializations = async () => {
    try {
      const response = await axios.get('/api/doctors/specializations');
      // Ensure specializations is always an array
      setSpecializations(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching specializations:', err);
      setSpecializations([]); // Set to empty array on error
    }
  };

  const fetchDoctors = async (page, spec = specialization, search = searchTerm) => {
    try {
      setLoading(true);
      
      let url = `/api/doctors?page=${page}&limit=9`;
      if (spec) url += `&specialization=${spec}`;
      if (search) url += `&search=${search}`;
      
      const response = await axios.get(url);
      
      // Ensure each doctor has a ratings array
      const doctorsWithRatings = response.data.doctors.map(doctor => ({
        ...doctor,
        ratings: doctor.ratings || []
      }));
      
      setDoctors(doctorsWithRatings);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch doctors');
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchDoctors(pageNumber);
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || !Array.isArray(ratings) || ratings.length === 0) return 0;
    const sum = ratings.reduce((total, rating) => total + (rating.rating || 0), 0);
    return (sum / ratings.length).toFixed(1);
  };

  const renderPagination = () => {
    const items = [];
    
    // Previous button
    items.push(
      <Pagination.Prev 
        key="prev" 
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );
    
    // Page numbers
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    
    // Next button
    items.push(
      <Pagination.Next 
        key="next" 
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );
    
    return <Pagination>{items}</Pagination>;
  };

  if (loading && !doctors.length) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading doctors...</p>
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

  return (
    <Container className="doctor-list-container my-5">
      <Row className="mb-4">
        <Col>
          <h2 className="section-title">
            <FaUserMd className="me-2" />
            Find a Doctor
          </h2>
          <p className="section-description">
            Browse our network of qualified healthcare professionals
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <div className="search-container">
            <InputGroup>
              <InputGroup.Text className="search-icon-container">
                <FaSearch className="search-icon" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </InputGroup>
          </div>
        </Col>
        <Col md={6}>
          <div className="filter-container">
            <InputGroup>
              <InputGroup.Text className="filter-icon-container">
                <FaFilter className="filter-icon" />
              </InputGroup.Text>
              <Form.Select 
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="filter-select"
              >
                <option value="">All Specializations</option>
                {Array.isArray(specializations) && specializations.map((spec, index) => (
                  <option key={index} value={spec}>{spec}</option>
                ))}
              </Form.Select>
            </InputGroup>
          </div>
        </Col>
      </Row>

      {doctors.length === 0 ? (
        <Alert variant="info">
          No doctors found matching your criteria. Try adjusting your search or filters.
        </Alert>
      ) : (
        <>
          <Row>
            {doctors.map(doctor => (
              <Col md={6} lg={4} key={doctor._id || index} className="mb-4">
                <Card className="doctor-card">
                  <Card.Body>
                    <div className="doctor-header">
                      <div className="doctor-avatar">
                        {doctor.user?.profilePicture ? (
                          <img 
                            src={doctor.user.profilePicture}
                            alt={`Dr. ${doctor.user?.name || 'Unknown'}`}
                            className="avatar-img"
                          />
                        ) : (
                          <div className="avatar-placeholder">
                            <FaUserMd size={30} />
                          </div>
                        )}
                      </div>
                      <div className="doctor-info">
                        <h5 className="doctor-name">Dr. {doctor.user?.name || 'Unknown'}</h5>
                        <div className="doctor-specialization">
                          <FaStethoscope className="me-1" />
                          {doctor.specialization || 'General Practice'}
                        </div>
                        <div className="doctor-rating">
                          <FaStar className="me-1 star-icon" />
                          <span>{calculateAverageRating(doctor.ratings)}</span>
                          <small className="text-muted ms-1">
                            ({Array.isArray(doctor.ratings) ? doctor.ratings.length : 0} reviews)
                          </small>
                        </div>
                      </div>
                    </div>

                    <div className="doctor-details">
                      {doctor.experience && (
                        <div className="detail-item">
                          <span className="detail-label">Experience:</span>
                          <span className="detail-value">{doctor.experience} years</span>
                        </div>
                      )}
                      
                      {doctor.consultationFee && (
                        <div className="detail-item">
                          <span className="detail-label">
                            <FaMoneyBillWave className="me-1" />
                            Consultation Fee:
                          </span>
                          <span className="detail-value">${doctor.consultationFee}</span>
                        </div>
                      )}
                      
                      {Array.isArray(doctor.qualifications) && doctor.qualifications.length > 0 && (
                        <div className="detail-item">
                          <span className="detail-label">Qualifications:</span>
                          <div className="qualifications-list">
                            {doctor.qualifications.map((qual, index) => (
                              <Badge bg="light" text="dark" key={index} className="qualification-badge">
                                {qual}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {Array.isArray(doctor.availability) && doctor.availability.length > 0 && (
                        <div className="detail-item">
                          <span className="detail-label">
                            <FaCalendarAlt className="me-1" />
                            Available on:
                          </span>
                          <div className="availability-list">
                            {doctor.availability.map((slot, index) => (
                              <Badge bg="light" text="dark" key={index} className="availability-badge">
                                {slot.day} ({slot.startTime}-{slot.endTime})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="doctor-actions">
                      <Button 
                        variant="outline-primary" 
                        as={Link}
                        to={`/doctors/${doctor._id}`}
                        className="view-profile-btn"
                      >
                        View Profile
                      </Button>
                      <Button 
                        variant="primary"
                        onClick={() => {
                          if (currentUser) {
                            navigate(`/appointments/book?doctorId=${doctor._id}`);
                          } else {
                            navigate(`/login?redirect=${encodeURIComponent(`/appointments/book?doctorId=${doctor._id}`)}`);
                          }
                        }}
                        className="book-appointment-btn"
                      >
                        Book Appointment
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          
          <Row className="mt-4">
            <Col className="d-flex justify-content-center">
              {renderPagination()}
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default DoctorList;