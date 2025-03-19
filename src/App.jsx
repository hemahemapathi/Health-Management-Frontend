import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar.jsx'
import Home from './pages/Home/Home.jsx'
import Login from './pages/Auth/Login/Login.jsx'
import Register from './pages/Auth/Register/Register.jsx'
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword.jsx'
import Contact from './pages/Contact/Contact.jsx'
import PatientDashboard from './pages/Dashboard/PatientDashboard/PatientDashboard.jsx'
import DoctorList from './pages/Doctors/DoctorList/DoctorList.jsx'
import AppointmentList from './pages/Appointments/AppointmentList/AppointmentList.jsx'
import PrescriptionList from './pages/Prescription/PrescriptionList/PrescriptionList.jsx'
import BookAppointment from './pages/Appointments/BookAppointment/BookAppointment.jsx'
import DoctorDashboard from './pages/Dashboard/DoctorDashboard/DoctorDashboard.jsx'
import CreatePrescription from './pages/Prescription/CreatePrescription/CreatePrescription.jsx';
import PatientList from './pages/Patients/PatientList/PatientList.jsx'
import Schedule from './pages/Schedule/Schedule.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import DoctorDashboardLayout from './pages/Dashboard/DoctorDashboard/DoctorDashboardLayout/DoctorDashboardLayout.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx'
import About from './pages/AboutUs/About.jsx'
import DoctorProfile from './pages/Doctors/DoctorProfile/DoctorProfile.jsx'
// import AdminDashboard from './pages/Dashboard/AdminDashboard/AdminDashboard';
import AppointmentDetails from './pages/Appointments/AppointmentDetails/AppointmentDetails.jsx'; //

function App() {
  return (
    <>
      <Navbar />
      {/* <Sidebar /> */}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/doctors/:id" element={<DoctorProfile />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Add this new route */}
        <Route path="/appointments/book" element={<BookAppointment />} />

        {/* Patient Routes - Make sure these are properly protected */}
        <Route 
          path="/patient-dashboard"
          element={<ProtectedRoute role="patient"><PatientDashboard/></ProtectedRoute>}
        />
        <Route 
          path="/patient-dashboard/doctors" 
          element={<ProtectedRoute role="patient"><DoctorList /></ProtectedRoute>}
        />
        <Route 
          path="/patient-dashboard/appointments/:id" 
          element={<ProtectedRoute role="patient"><AppointmentDetails /></ProtectedRoute>}
        />
        <Route 
          path="/patient-dashboard/prescriptions" 
          element={<ProtectedRoute role="patient"><PrescriptionList /></ProtectedRoute>}
        />
        <Route 
          path="/patient-dashboard/book-appointment" 
          element={<ProtectedRoute role="patient"><BookAppointment /></ProtectedRoute>}
        />

        {/* Doctor Routes */}
        <Route 
          path="/doctor-dashboard" 
          element={<ProtectedRoute role="doctor"><DoctorDashboardLayout /></ProtectedRoute>}
        >
          <Route index element={<DoctorDashboard />} />
          <Route path="createprescription" element={<CreatePrescription />} />
          <Route path="prescriptions" element={<PrescriptionList />} /> 
          <Route path="patients" element={<PatientList />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="profile" element={<DoctorProfile />} />
        {/*appointments route */}
          <Route path="appointments" element={<AppointmentList />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
