import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import './Schedule.css';

const Schedule = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newSlot, setNewSlot] = useState({
    day: '',
    startTime: '',
    endTime: ''
  });

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        // Get the doctor profile directly
        const doctorResponse = await axios.get('/api/doctors/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const doctorId = doctorResponse.data._id;
        
        if (!doctorId) {
          setError('Doctor profile not found');
          setLoading(false);
          return;
        }

        // Fetch doctor's availability
        const availabilityResponse = await axios.get(`/api/doctors/${doctorId}/availability`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setAvailability(availabilityResponse.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error details:', err);
        if (err.response?.status === 404) {
          setError('Doctor profile endpoint not found. Please check server configuration.');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch availability');
        }
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch availability');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSlot({
      ...newSlot,
      [name]: value
    });
  };

  const addTimeSlot = () => {
    // Validate inputs
    if (!newSlot.day || !newSlot.startTime || !newSlot.endTime) {
      setError('Please fill in all fields');
      return;
    }

    // Check if end time is after start time
    if (newSlot.startTime >= newSlot.endTime) {
      setError('End time must be after start time');
      return;
    }

    // Check for overlapping time slots on the same day
    const overlappingSlot = availability.find(slot => 
      slot.day === newSlot.day && 
      ((newSlot.startTime >= slot.startTime && newSlot.startTime < slot.endTime) ||
       (newSlot.endTime > slot.startTime && newSlot.endTime <= slot.endTime) ||
       (newSlot.startTime <= slot.startTime && newSlot.endTime >= slot.endTime))
    );

    if (overlappingSlot) {
      setError('This time slot overlaps with an existing slot');
      return;
    }

    // Add the new slot
    setAvailability([...availability, { ...newSlot }]);
    
    // Reset the form
    setNewSlot({
      day: '',
      startTime: '',
      endTime: ''
    });
    
    setError(null);
    setSuccess('Time slot added. Remember to save your changes.');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  const removeTimeSlot = (index) => {
    const updatedAvailability = [...availability];
    updatedAvailability.splice(index, 1);
    setAvailability(updatedAvailability);
    
    setSuccess('Time slot removed. Remember to save your changes.');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  const saveAvailability = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      // Get the doctor ID from the user profile
      const userResponse = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const doctorId = userResponse.data.doctorId;
      
      if (!doctorId) {
        setError('Doctor profile not found');
        setSaving(false);
        return;
      }

      // Update availability
      await axios.put(`/api/doctors/${doctorId}/availability`, 
        { availability }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSaving(false);
      setSuccess('Availability schedule saved successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save availability');
      setSaving(false);
    }
  };

  // Group availability by day for better display
  const getAvailabilityByDay = () => {
    const byDay = {};
    
    daysOfWeek.forEach(day => {
      byDay[day] = availability.filter(slot => slot.day === day);
    });
    
    return byDay;
  };

  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (err) {
      return timeString;
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your schedule...</p>
      </Container>
    );
  }

  const availabilityByDay = getAvailabilityByDay();

  return (
    <Container className="schedule-container my-5">
      <Row className="mb-4">
        <Col>
          <h2 className="section-title">
            <FaCalendarAlt className="me-2" />
            Manage Your Schedule
          </h2>
          <p className="section-description">
            Set your availability for patient appointments
          </p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
          {success}
        </Alert>
      )}

      <Row className="mb-4">
        <Col lg={12}>
          <Card className="schedule-card">
            <Card.Body>
              <h4 className="mb-3">Add New Availability</h4>
              <Form className="add-slot-form">
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Day</Form.Label>
                      <Form.Select 
                        name="day" 
                        value={newSlot.day}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Day</option>
                        {daysOfWeek.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="startTime"
                        value={newSlot.startTime}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>End Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="endTime"
                        value={newSlot.endTime}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-flex align-items-end">
                    <Button 
                      variant="primary" 
                      onClick={addTimeSlot}
                      className="w-100 mb-3"
                    >
                      <FaPlus className="me-2" />
                      Add
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="schedule-card">
            <Card.Body>
              <h4 className="mb-3">Current Availability</h4>
              
              {availability.length === 0 ? (
                <Alert variant="info">
                  You haven't set any availability yet. Add time slots above to get started.
                </Alert>
              ) : (
                <div className="availability-table-container">
                  <Table responsive className="availability-table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Time Slots</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {daysOfWeek.map(day => (
                        <tr key={day}>
                          <td className="day-column">{day}</td>
                          <td>
                            {availabilityByDay[day].length === 0 ? (
                              <span className="text-muted">No availability</span>
                            ) : (
                              <div className="time-slots-list">
                                {availabilityByDay[day].map((slot, index) => (
                                  <div key={index} className="time-slot-item">
                                    <FaClock className="me-2" />
                                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                          <td>
                            {availabilityByDay[day].map((slot, slotIndex) => {
                              // Find the index in the original array
                              const originalIndex = availability.findIndex(
                                s => s.day === day && s.startTime === slot.startTime && s.endTime === slot.endTime
                              );
                              
                              return (
                                <Button 
                                  key={slotIndex}
                                  variant="outline-danger" 
                                  size="sm"
                                  className="remove-slot-btn"
                                  onClick={() => removeTimeSlot(originalIndex)}
                                >
                                  <FaTrash />
                                </Button>
                              );
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
              
              <div className="d-grid mt-4">
                <Button 
                  variant="success" 
                  onClick={saveAvailability}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" />
                      Save Schedule
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Schedule;
