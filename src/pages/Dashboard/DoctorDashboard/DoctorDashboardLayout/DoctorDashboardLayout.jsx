import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../../components/Sidebar/Sidebar'; // Fix the path

import { Container, Row, Col } from 'react-bootstrap';

const DoctorDashboardLayout = () => {
  return (
    <div className="dashboard-container">
      
      <Container fluid>
        <Row>
          <Col md={3} lg={2} className="sidebar-container">
            <Sidebar role="doctor" />
          </Col>
          <Col md={9} lg={10} className="main-content">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DoctorDashboardLayout;
