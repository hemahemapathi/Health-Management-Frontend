import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPrescriptionBottleAlt, FaUserMd, FaFilter, FaSearch, FaCalendarAlt, FaNotesMedical } from 'react-icons/fa';
import './PrescriptionList.css';

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, [filter]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/prescriptions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      let filteredPrescriptions = response.data.data;
      
      // Apply filter
      if (filter === 'active') {
        filteredPrescriptions = filteredPrescriptions.filter(
          prescription => prescription.status === 'active'
        );
      } else if (filter === 'completed') {
        filteredPrescriptions = filteredPrescriptions.filter(
          prescription => prescription.status === 'completed'
        );
      } else if (filter === 'cancelled') {
        filteredPrescriptions = filteredPrescriptions.filter(
          prescription => prescription.status === 'cancelled'
        );
      }

      setPrescriptions(filteredPrescriptions);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch prescriptions');
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="primary">Active</Badge>;
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const doctorName = prescription.doctor?.user?.name?.toLowerCase() || '';
    const diagnosis = prescription.diagnosis?.toLowerCase() || '';
    const medications = prescription.medications?.map(med => med.name.toLowerCase()).join(' ') || '';
    const searchLower = searchTerm.toLowerCase();
    
    return doctorName.includes(searchLower) || 
           diagnosis.includes(searchLower) || 
           medications.includes(searchLower);
  });

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading prescriptions...</p>
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
    <Container className="prescription-list-container my-5">
      <Row className="mb-4">
        <Col>
          <h2 className="section-title">
            <FaPrescriptionBottleAlt className="me-2" />
            My Prescriptions
          </h2>
          <p className="section-description">
            View and manage your medical prescriptions
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <Form.Control
              type="text"
              placeholder="Search by doctor, diagnosis, or medication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="filter-container">
            <FaFilter className="filter-icon" />
            <Form.Select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Prescriptions</option>
              <option value="active">Active Prescriptions</option>
              <option value="completed">Completed Prescriptions</option>
              <option value="cancelled">Cancelled Prescriptions</option>
            </Form.Select>
          </div>
        </Col>
      </Row>

      {filteredPrescriptions.length === 0 ? (
        <Alert variant="info">
          No prescriptions found. {filter !== 'all' && 'Try changing the filter.'}
        </Alert>
      ) : (
        <Row>
          {filteredPrescriptions.map(prescription => (
            <Col md={6} lg={4} key={prescription._id} className="mb-4">
              <Card className={`prescription-card ${prescription.status}`}>
                <Card.Body>
                  <div className="prescription-header">
                    <div className="prescription-dates">
                      <div className="date-label">Prescribed:</div>
                      <div className="date-value">{formatDate(prescription.startDate)}</div>
                      {prescription.endDate && (
                        <>
                          <div className="date-label mt-1">Valid until:</div>
                          <div className="date-value">{formatDate(prescription.endDate)}</div>
                        </>
                      )}
                    </div>
                    <div className="prescription-status">
                      {getStatusBadge(prescription.status)}
                    </div>
                  </div>
                  
                  <div className="prescription-doctor">
                    <FaUserMd className="me-2" />
                    <span>Dr. {prescription.doctor?.user?.name || 'Unknown'}</span>
                    {prescription.doctor?.specialization && (
                      <span className="doctor-specialization">
                        {prescription.doctor.specialization}
                      </span>
                    )}
                  </div>
                  
                  {prescription.diagnosis && (
                    <div className="prescription-diagnosis">
                      <h6><FaNotesMedical className="me-2" />Diagnosis:</h6>
                      <p>{prescription.diagnosis}</p>
                    </div>
                  )}
                  
                  <div className="prescription-medications">
                    <h6>Medications:</h6>
                    <ul className="medications-list">
                    // Replace the problematic code with this
           {prescription.medications && prescription.medications.map((medication, index) => (
                     <li key={index} className="medication-item">
                     <div className="medication-name">{medication.name}</div>
                   <div className="medication-details">
                   <span className="dosage">{medication.dosage}</span>
                   <span className="frequency">{medication.frequency}</span>
                   {medication.duration && <span className="duration">for {medication.duration}</span>}
                  </div>
                  {medication.instructions && (
                  <div className="medication-instructions">
                   <small>{medication.instructions}</small>
                   </div>
                   )}
                   </li>
                   ))}

                    </ul>
                  </div>
                  
                  {prescription.notes && (
                    <div className="prescription-notes">
                      <h6>Additional Notes:</h6>
                      <p>{prescription.notes}</p>
                    </div>
                  )}
                  
                  <div className="prescription-actions">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      as={Link}
                      to={`/prescriptions/${prescription._id}`}
                    >
                      View Details
                    </Button>
                    {prescription.status === 'active' && (
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => window.print()}
                      >
                        Print
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default PrescriptionList;
