import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaUserMd, FaFilter, FaSearch } from 'react-icons/fa';
import './AppointmentList.css';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/patients/appointments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      let filteredAppointments = response.data.data;
      
      // Apply filter
      if (filter === 'upcoming') {
        filteredAppointments = filteredAppointments.filter(
          app => app.status === 'scheduled' && new Date(app.dateTime) > new Date()
        );
      } else if (filter === 'past') {
        filteredAppointments = filteredAppointments.filter(
          app => new Date(app.dateTime) < new Date() || app.status === 'completed'
        );
      } else if (filter === 'cancelled') {
        filteredAppointments = filteredAppointments.filter(
          app => app.status === 'cancelled'
        );
      }

      setAppointments(filteredAppointments);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch appointments');
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/patients/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update the local state
      setAppointments(appointments.map(app => 
        app._id === id ? { ...app, status: 'cancelled' } : app
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <Badge bg="primary">Scheduled</Badge>;
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const doctorName = appointment.doctor?.name?.toLowerCase() || '';
    const reason = appointment.reason?.toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    
    return doctorName.includes(searchLower) || reason.includes(searchLower);
  });

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading appointments...</p>
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
    <Container className="appointment-list-container my-5">
      <Row className="mb-4">
        <Col>
          <h2 className="section-title">
            <FaCalendarAlt className="me-2" />
            My Appointments
          </h2>
          <p className="section-description">
            View and manage your scheduled appointments
          </p>
        </Col>
        <Col md="auto">
          <Button 
            as={Link} 
            to="/appointments/book" 
            variant="primary"
            className="book-appointment-btn"
          >
            Book New Appointment
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <Form.Control
              type="text"
              placeholder="Search by doctor or reason..."
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
              <option value="all">All Appointments</option>
              <option value="upcoming">Upcoming Appointments</option>
              <option value="past">Past Appointments</option>
              <option value="cancelled">Cancelled Appointments</option>
            </Form.Select>
          </div>
        </Col>
      </Row>

      {filteredAppointments.length === 0 ? (
        <Alert variant="info">
          No appointments found. {filter !== 'all' && 'Try changing the filter or '} 
          <Link to="/appointments/book">book a new appointment</Link>.
        </Alert>
      ) : (
        <Row>
          {filteredAppointments.map(appointment => (
            <Col md={6} lg={4} key={appointment._id} className="mb-4">
              <Card className={`appointment-card ${appointment.status}`}>
                <Card.Body>
                  <div className="appointment-header">
                    <div className="appointment-date">
                      <div className="date-day">
                        {new Date(appointment.dateTime).getDate()}
                      </div>
                      <div className="date-month">
                        {new Date(appointment.dateTime).toLocaleString('default', { month: 'short' })}
                      </div>
                    </div>
                    <div className="appointment-status">
                      {getStatusBadge(appointment.status)}
                    </div>
                  </div>
                  
                  <div className="appointment-time">
                    <FaCalendarAlt className="me-2" />
                    {formatDate(appointment.dateTime)}
                  </div>
                  
                  <div className="appointment-doctor">
                    <FaUserMd className="me-2" />
                    <span>Dr. {appointment.doctor?.name || 'Unknown'}</span>
                    {appointment.doctor?.specialization && (
                      <span className="doctor-specialization">
                        {appointment.doctor.specialization}
                      </span>
                    )}
                  </div>
                  
                  <div className="appointment-reason">
                    <h6>Reason:</h6>
                    <p>{appointment.reason}</p>
                  </div>
                  
                  {appointment.status === 'scheduled' && new Date(appointment.dateTime) > new Date() && (
                    <div className="appointment-actions">
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleCancelAppointment(appointment._id)}
                      >
                        Cancel Appointment
                      </Button>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        as={Link}
                        to={`/appointments/${appointment._id}`}
                      >
                        View Details
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default AppointmentList;
