import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Pagination, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaUserInjured } from 'react-icons/fa';
import './PatientList.css';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPatients();
  }, [currentPage, filter]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await axios.get(`/api/patients?page=${currentPage}&filter=${filter}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPatients(response.data.data);
      setTotalPages(response.data.totalPages || 1);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch patients');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPatients();
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const filteredPatients = patients.filter(patient => 
    patient.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPagination = () => {
    const items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item 
          key={number} 
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        {items}
        <Pagination.Next 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading patients...</p>
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
    <Container className="patient-list-container my-5">
      <Row className="mb-4">
        <Col>
          <h2 className="section-title">
            <FaUserInjured className="me-2" />
            Patient Directory
          </h2>
          <p className="section-description">
            View and manage patient information
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                placeholder="Search patients by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="primary" type="submit">
                <FaSearch />
              </Button>
            </InputGroup>
          </Form>
        </Col>
        <Col md={4}>
          <Form.Select 
            value={filter} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Patients</option>
            <option value="recent">Recently Added</option>
            <option value="appointments">With Upcoming Appointments</option>
          </Form.Select>
        </Col>
        <Col md={2} className="text-end">
          <Button as={Link} to="/add-patient" variant="success">
            Add Patient
          </Button>
        </Col>
      </Row>

      {filteredPatients.length === 0 ? (
        <Alert variant="info">
          No patients found. Try adjusting your search criteria.
        </Alert>
      ) : (
        <>
          <Row>
            {filteredPatients.map(patient => (
              <Col md={4} key={patient._id} className="mb-4">
                <Card className="patient-card h-100">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <div className="patient-avatar">
                        {patient.user?.profilePicture ? (
                          <img src={patient.user.profilePicture} alt={patient.user?.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {patient.user?.name?.charAt(0) || '?'}
                          </div>
                        )}
                      </div>
                      <div className="ms-3">
                        <Card.Title>{patient.user?.name}</Card.Title>
                        <Card.Subtitle className="text-muted">
                          {patient.dateOfBirth ? (
                            new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() + ' years'
                          ) : 'Age not available'}
                        </Card.Subtitle>
                      </div>
                    </div>
                    
                    <div className="patient-details">
                      <p><strong>Blood Group:</strong> {patient.bloodGroup || 'Not specified'}</p>
                      <p><strong>Medical Conditions:</strong> {
                        patient.medicalHistory?.length > 0 
                          ? patient.medicalHistory.map(h => h.condition).join(', ')
                          : 'None recorded'
                      }</p>
                    </div>
                    
                    <div className="text-center mt-3">
                      <Button 
                        as={Link} 
                        to={`/patients/${patient._id}`} 
                        variant="outline-primary" 
                        className="me-2"
                      >
                        View Profile
                      </Button>
                      <Button 
                        as={Link} 
                        to={`/appointments/new?patientId=${patient._id}`} 
                        variant="outline-success"
                      >
                        Schedule
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          
          {renderPagination()}
        </>
      )}
    </Container>
  );
};

export default PatientList;
