import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [patientProfile, setPatientProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile data when currentUser changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setUserProfile(null);
        setDoctorProfile(null);
        setPatientProfile(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch user profile
        const userResponse = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserProfile(userResponse.data);

        // If user is a doctor, fetch doctor profile
        if (currentUser.role === 'doctor') {
          const doctorResponse = await axios.get(`/api/doctors/user/${currentUser._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setDoctorProfile(doctorResponse.data);
        }

        // If user is a patient, fetch patient profile
        if (currentUser.role === 'patient') {
          const patientResponse = await axios.get(`/api/patients/user/${currentUser._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setPatientProfile(patientResponse.data);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.response?.data?.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Update doctor profile
  const updateDoctorProfile = async (doctorId, profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/doctors/${doctorId}`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDoctorProfile(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update doctor profile');
      setLoading(false);
      return null;
    }
  };

  // Update patient profile
  const updatePatientProfile = async (patientId, profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/patients/${patientId}`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPatientProfile(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update patient profile');
      setLoading(false);
      return null;
    }
  };

  // Update doctor availability
  const updateDoctorAvailability = async (doctorId, availability) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/doctors/${doctorId}/availability`, { availability }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDoctorProfile({...doctorProfile, availability: response.data.availability});
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update availability');
      setLoading(false);
      return null;
    }
  };

  const value = {
    userProfile,
    doctorProfile,
    patientProfile,
    loading,
    error,
    updateDoctorProfile,
    updatePatientProfile,
    updateDoctorAvailability
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
