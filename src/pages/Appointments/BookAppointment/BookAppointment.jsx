import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaUserMd, FaClock, FaNotesMedical, FaCalendarPlus } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { appointmentAPI, doctorAPI } from '../../../utils/api';
import './BookAppointment.css';

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const doctorIdFromUrl = queryParams.get('doctorId');

  const [formData, setFormData] = useState({
    doctorId: doctorIdFromUrl || '',
    date: '',
    timeSlot: '',
    reason: ''
  });

  useEffect(() => {
    if (!currentUser) {
      setError('Authentication required. Please log in to book an appointment.');
      setTimeout(() => {
        navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      }, 2000);
    }
  }, [currentUser, navigate, location]);

  useEffect(() => {
    if (currentUser) {
      fetchDoctors();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && formData.doctorId && formData.date) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
    }
  }, [formData.doctorId, formData.date, currentUser]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      
      const response = await doctorAPI.getAllDoctors();
      console.log('Doctor API response:', response);
      
      if (response && response.data) {
        // Try to extract doctors array from response
        let doctorsData;
        
        if (Array.isArray(response.data)) {
          doctorsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          doctorsData = response.data.data;
        } else if (response.data.doctors && Array.isArray(response.data.doctors)) {
          doctorsData = response.data.doctors;
        } else {
          // Try to find any array in the response
          const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            doctorsData = possibleArrays[0];
          } else {
            setError('Could not find doctors data in API response');
            setDoctors([]);
          }
        }
        
        if (doctorsData && doctorsData.length > 0) {
          setDoctors(doctorsData);
        } else {
          setError('No doctors available at this time');
          setDoctors([]);
        }
      } else {
        setError('Invalid API response');
        setDoctors([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to fetch doctors: ' + (err.response?.data?.message || err.message));
      setLoading(false);
      setDoctors([]);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      
      const response = await appointmentAPI.getAvailableSlots(formData.doctorId, formData.date);
      console.log('Available slots response:', response);
      
      if (response && response.data) {
        let slotsData;
        
        if (Array.isArray(response.data)) {
          slotsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          slotsData = response.data.data;
        } else if (response.data.slots && Array.isArray(response.data.slots)) {
          slotsData = response.data.slots;
        } else {
          // Generate default time slots if API doesn't return any
          slotsData = generateDefaultTimeSlots();
        }
        
        setAvailableSlots(slotsData);
      } else {
        // Generate default time slots if API response is invalid
        setAvailableSlots(generateDefaultTimeSlots());
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching available slots:', err);
      // Generate default time slots on error
      setAvailableSlots(generateDefaultTimeSlots());
      setLoading(false);
    }
  };

  // Helper function to generate default time slots
  const generateDefaultTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Create a date object from the date and time
      const dateTime = new Date(`${formData.date}T${formData.timeSlot}`);
      
      const appointmentData = {
        doctorId: formData.doctorId,
        dateTime: dateTime.toISOString(),
        reason: formData.reason
      };
      
      console.log('Submitting appointment data:', appointmentData);
      
      try {
        // Try different endpoint patterns
        let response;
        try {
          // Try the simple endpoint first
          response = await appointmentAPI.createAppointment(appointmentData);
        } catch (err1) {
          console.log('First endpoint attempt failed, trying alternative...');
          try {
            // Try with patients prefix
            response = await  appointmentAPI.createPatientAppointment(appointmentData);
          } catch (err2) {
            console.log('Second endpoint attempt failed, trying another alternative...');
            // Try with a different structure
            response = await appointmentAPI.createAppointmentAlternative(appointmentData);
          }
        }
        
        console.log('Appointment creation response:', response);
        
        setSuccess(true);
        setLoading(false);
        
        setTimeout(() => {
          navigate('/patient-dashboard');
        }, 2000);
      } catch (apiError) {
        console.log('API Error booking appointment:', apiError);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('Failed to book appointment: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Container className="text-center my-5">
        <Alert variant="warning">
          Authentication required. Please log in to book an appointment.
          Redirecting to login page...
        </Alert>
      </Container>
    );
  }

  if (loading && doctors.length === 0) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading doctors...</p>
      </Container>
    );
  }

  return (
    <Container className="book-appointment-container my-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="booking-card">
            <Card.Body>
              <h2 className="section-title mb-4">
                <FaCalendarAlt className="me-2" />
                Book an Appointment
              </h2>
              
              {error && <Alert variant="danger">{error}</Alert>}
              {success && (
                <Alert variant="success">
                  Appointment booked successfully! Redirecting to appointments list...
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="form-label">
                    <FaUserMd className="me-2" />
                    Select Doctor
                  </Form.Label>
                  <Form.Select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    required
                    className="form-input"
                    disabled={doctorIdFromUrl || loading}
                  >
                    <option value="">Select a doctor</option>
                    {doctors.length > 0 ? (
                      doctors.map((doctor, index) => (
                        <option key={doctor._id || doctor.id || index} value={doctor._id || doctor.id}>
                          {doctor.user?.name || doctor.name || 'Doctor'} - {doctor.specialization || 'General'}
                        </option>
                      ))
                    ) : (
                      <option disabled>No doctors available</option>
                    )}
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="form-label">
                    <FaCalendarAlt className="me-2" />
                    Select Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="form-input"
                    disabled={loading}
                  />
                </Form.Group>
                
                {availableSlots.length > 0 ? (
                  <Form.Group className="mb-4">
                    <Form.Label className="form-label">
                      <FaClock className="me-2" />
                      Select Time Slot
                    </Form.Label>
                    <div className="time-slots-container">
                      {availableSlots.map((slot, index) => (
                        <Form.Check
                          key={index}
                          type="radio"
                          id={`slot-${index}`}
                          name="timeSlot"
                          value={slot}
                          label={new Date(`2000-01-01T${slot}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          onChange={handleChange}
                          required
                          className="time-slot-option"
                          checked={formData.timeSlot === slot}
                          disabled={loading}
                        />
                      ))}
                    </div>
                  </Form.Group>
                ) : formData.doctorId && formData.date ? (
                  <Alert variant="info">
                    {loading ? 'Loading available time slots...' : 'No available time slots for the selected date. Please choose another date.'}
                  </Alert>
                ) : null}
                
                <Form.Group className="mb-4">
                  <Form.Label className="form-label">
                    <FaNotesMedical className="me-2" />
                    Reason for Visit
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    placeholder="Please describe your symptoms or reason for the appointment"
                    className="form-input reason-textarea"
                    rows={4}
                    disabled={loading}
                  />
                </Form.Group>
                
                <div className="d-grid gap-2 mt-4">
                  <Button
                    type="submit"
                    variant="success"
                    size="lg"
                    disabled={loading || success || !formData.doctorId || !formData.date || !formData.timeSlot || !formData.reason}
                    className="book-btn"
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <FaCalendarPlus className="me-2" />
                        Confirm Appointment
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/patient-dashboard')}
                    className="cancel-btn"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookAppointment;