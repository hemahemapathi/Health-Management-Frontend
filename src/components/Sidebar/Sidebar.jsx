import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUserMd, 
  FaCalendarAlt, 
  FaPrescriptionBottleAlt, 
  FaUserInjured, 
  FaCog, 
  FaSignOutAlt,
  FaChartLine,
  FaClipboardList,
  FaUserCog,
  FaHospital,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';

const Sidebar = ({ role }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    window.location.href = '/login';
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    switch (role) {
      case 'doctor':
        return [
          { path: '/doctor-dashboard', icon: <FaChartLine />, label: 'Dashboard' },
          { path: '/doctor-dashboard/patients', icon: <FaUserInjured />, label: 'Patients' },
          { path: '/doctor-dashboard/appointments', icon: <FaCalendarAlt />, label: 'Appointments' },
          { path: '/doctor-dashboard/prescriptions', icon: <FaPrescriptionBottleAlt />, label: 'Prescriptions' },
          { path: '/doctor-dashboard/schedule', icon: <FaClipboardList />, label: 'Schedule' },
          { path: '/doctor-dashboard/profile', icon: <FaUserCog />, label: 'Profile' }
        ];
      case 'patient':
        return [
          { path: '/patient-dashboard', icon: <FaChartLine />, label: 'Dashboard' },
          { path: '/patient-dashboard/doctors', icon: <FaUserMd />, label: 'Find Doctors' },
          { path: '/patient-dashboard/appointments', icon: <FaCalendarAlt />, label: 'Appointments' },
          { path: '/patient-dashboard/prescriptions', icon: <FaPrescriptionBottleAlt />, label: 'Prescriptions' },
          { path: '/patient-dashboard/medical-records', icon: <FaClipboardList />, label: 'Medical Records' },
          { path: '/patient-dashboard/profile', icon: <FaUserCog />, label: 'Profile' }
        ];
      case 'admin':
        return [
          { path: '/admin-dashboard', icon: <FaChartLine />, label: 'Dashboard' },
          { path: '/admin-dashboard/doctors', icon: <FaUserMd />, label: 'Doctors' },
          { path: '/admin-dashboard/patients', icon: <FaUserInjured />, label: 'Patients' },
          { path: '/admin-dashboard/appointments', icon: <FaCalendarAlt />, label: 'Appointments' },
          { path: '/admin-dashboard/settings', icon: <FaCog />, label: 'Settings' }
        ];
      default:
        return [
          { path: '/', icon: <FaHome />, label: 'Home' }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile menu toggle button */}
      <div className="mobile-toggle" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <FaHospital className="logo-icon" />
            {!isCollapsed && <span className="logo-text">HealthCare</span>}
          </div>
          <button className="collapse-btn" onClick={toggleSidebar}>
            {isCollapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <ul className="nav-list">
              {navItems.map((item, index) => (
                <li key={index} className="nav-item">
                  <Link 
                    to={item.path} 
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!isCollapsed && <span className="nav-label">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
