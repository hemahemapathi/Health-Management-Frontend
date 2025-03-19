import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DoctorDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    pendingPrescriptions: 0
  });
  
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch doctor dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }
        
        // For development/testing, use mock data
        if (process.env.NODE_ENV === 'development') {
          // Mock data
          setTimeout(() => {
            setStats({
              totalPatients: 24,
              upcomingAppointments: 8,
              completedAppointments: 156,
              pendingPrescriptions: 3
            });
            
            setRecentAppointments([
              { id: 1, patientName: 'John Doe', date: '2023-08-15', time: '10:00 AM', status: 'Confirmed' },
              { id: 2, patientName: 'Jane Smith', date: '2023-08-16', time: '2:30 PM', status: 'Pending' },
              { id: 3, patientName: 'Robert Johnson', date: '2023-08-17', time: '11:15 AM', status: 'Confirmed' }
            ]);
            
            setLoading(false);
          }, 1000);
          return;
        }
        
        // In production, fetch real data from multiple endpoints
        const headers = {
          Authorization: `Bearer ${token}`
        };
        
        // You would replace these with your actual API endpoints
        const [patientsRes, appointmentsRes, prescriptionsRes] = await Promise.all([
          axios.get('/api/patients/count', { headers }),
          axios.get('/api/appointments/doctor', { headers }),
          axios.get('/api/prescriptions/pending', { headers })
        ]);
        
        // Process the data
        const upcomingAppts = appointmentsRes.data.filter(a => new Date(a.date) > new Date()).length;
        const completedAppts = appointmentsRes.data.filter(a => a.status === 'completed').length;
        
        setStats({
          totalPatients: patientsRes.data.count,
          upcomingAppointments: upcomingAppts,
          completedAppointments: completedAppts,
          pendingPrescriptions: prescriptionsRes.data.length
        });
        
        // Get recent appointments
        const recent = appointmentsRes.data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
          .map(a => ({
            id: a._id,
            patientName: a.patient.name,
            date: new Date(a.date).toLocaleDateString(),
            time: a.time,
            status: a.status
          }));
        
        setRecentAppointments(recent);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to mock data on error
        setStats({
          totalPatients: 24,
          upcomingAppointments: 8,
          completedAppointments: 156,
          pendingPrescriptions: 3
        });
        
        setRecentAppointments([
          { id: 1, patientName: 'John Doe', date: '2023-08-15', time: '10:00 AM', status: 'Confirmed' },
          { id: 2, patientName: 'Jane Smith', date: '2023-08-16', time: '2:30 PM', status: 'Pending' },
          { id: 3, patientName: 'Robert Johnson', date: '2023-08-17', time: '11:15 AM', status: 'Confirmed' }
        ]);
        
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="doctor-dashboard">
      <h1>Doctor Dashboard</h1>
      
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Patients</h3>
          <p>{stats.totalPatients}</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming Appointments</h3>
          <p>{stats.upcomingAppointments}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Appointments</h3>
          <p>{stats.completedAppointments}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Prescriptions</h3>
          <p>{stats.pendingPrescriptions}</p>
        </div>
      </div>

      <div className="recent-appointments">
        <h2>Recent Appointments</h2>
        <table>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentAppointments.map(appointment => (
              <tr key={appointment.id}>
                <td>{appointment.patientName}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.status}</td>
                <td>
                  <button className="view-btn">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorDashboard;
