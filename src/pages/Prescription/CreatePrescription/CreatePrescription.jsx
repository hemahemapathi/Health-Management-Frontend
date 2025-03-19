import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPrescriptionBottleAlt, FaUserAlt, FaCalendarAlt, FaNotesMedical, FaPlus, FaTrash } from 'react-icons/fa';
import './CreatePrescription.css';

const CreatePrescription = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    patientId: '',
    diagnosis: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await axios.get('https://health-management-backend.onrender.com/api/prescriptions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPatients(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch patients');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleMedicationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMedications = [...formData.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [name]: value
    };
    
    setFormData({
      ...formData,
      medications: updatedMedications
    });
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
      ]
    });
  };

  const removeMedication = (index) => {
    if (formData.medications.length === 1) {
      return; // Keep at least one medication form
    }
    
    const updatedMedications = formData.medications.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      medications: updatedMedications
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.patientId) {
      setError('Please select a patient');
      return;
    }
    
    if (!formData.diagnosis.trim()) {
      setError('Please enter a diagnosis');
      return;
    }
    
    const isValidMedications = formData.medications.every(
      med => med.name.trim() && med.dosage.trim() && med.frequency.trim()
    );
    
    if (!isValidMedications) {
      setError('Please fill in all required medication fields (name, dosage, frequency)');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        setSubmitting(false);
        return;
      }

      await axios.post('/api/prescriptions', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess(true);
      setSubmitting(false);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/doctor-dashboard/prescriptions');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create prescription');
      setSubmitting(false);
    }
  };

  if (loading && !patients.length) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading patients...</p>
      </Container>
    );
  }

  return (
    <Container className="create-prescription-container my-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <Card className="prescription-card">
            <Card.Body>
              <h2 className="section-title mb-4">
                <FaPrescriptionBottleAlt className="me-2" />
                Create New Prescription
              </h2>
              
              {error && <Alert variant="danger">{error}</Alert>}
              {success && (
                <Alert variant="success">
                  Prescription created successfully! Redirecting...
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="form-label">
                        <FaUserAlt className="me-2" />
                        Select Patient
                      </Form.Label>
                      <Form.Select
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleChange}
                        required
                        className="form-input"
                        disabled={submitting}
                      >
                        <option value="">Select a patient</option>
                        {patients.map(patient => (
                          <option key={patient._id} value={patient._id}>
                            {patient.user?.name || 'Unknown'} 
                            {patient.user?.email && `(${patient.user.email})`}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="form-label">
                        <FaNotesMedical className="me-2" />
                        Diagnosis
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={handleChange}
                        required
                        placeholder="Enter diagnosis"
                        className="form-input"
                        disabled={submitting}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="form-label">
                        <FaCalendarAlt className="me-2" />
                        Start Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="form-input"
                        disabled={submitting}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="form-label">
                        <FaCalendarAlt className="me-2" />
                        End Date (Optional)
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="form-input"
                        min={formData.startDate}
                        disabled={submitting}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="medications-section">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Medications</h4>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={addMedication}
                      disabled={submitting}
                    >
                      <FaPlus className="me-1" /> Add Medication
                    </Button>
                  </div>
                  
                  {formData.medications.map((medication, index) => (
                    <Card key={index} className="medication-card mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between">
                          <h5 className="medication-number">Medication #{index + 1}</h5>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => removeMedication(index)}
                            disabled={formData.medications.length === 1 || submitting}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                        
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Medication Name*</Form.Label>
                              <Form.Control
                                type="text"
                                name="name"
                                value={medication.name}
                                onChange={(e) => handleMedicationChange(index, e)}
                                required
                                placeholder="Enter medication name"
                                disabled={submitting}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Dosage*</Form.Label>
                              <Form.Control
                                type="text"
                                name="dosage"
                                value={medication.dosage}
                                onChange={(e) => handleMedicationChange(index, e)}
                                required
                                placeholder="e.g., 500mg"
                                disabled={submitting}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        
                        <Row>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>Frequency*</Form.Label>
                              <Form.Control
                                type="text"
                                name="frequency"
                                value={medication.frequency}
                                onChange={(e) => handleMedicationChange(index, e)}
                                required
                                placeholder="e.g., Twice daily"
                                disabled={submitting}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>Duration (Optional)</Form.Label>
                              <Form.Control
                                type="text"
                                name="duration"
                                value={medication.duration}
                                onChange={(e) => handleMedicationChange(index, e)}
                                placeholder="e.g., 7 days"
                                disabled={submitting}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>Instructions (Optional)</Form.Label>
                              <Form.Control
                                type="text"
                                name="instructions"
                                value={medication.instructions}
                                onChange={(e) => handleMedicationChange(index, e)}
                                placeholder="e.g., Take after meals"
                                disabled={submitting}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
                
                <Form.Group className="mb-4">
                  <Form.Label className="form-label">
                    <FaNotesMedical className="me-2" />
                    Additional Notes (Optional)
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Enter any additional notes or instructions"
                    className="form-input notes-textarea"
                    rows={4}
                    disabled={submitting}
                  />
                </Form.Group>
                
                <div className="d-grid gap-2 mt-4">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={submitting || success}
                    className="create-btn"
                  >
                    {submitting ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Creating...
                      </>
                    ) : 'Create Prescription'}
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/doctor-dashboard/prescriptions')}
                    className="cancel-btn"
                    disabled={submitting}
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

export default CreatePrescription;
