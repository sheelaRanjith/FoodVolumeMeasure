import { Container, Row, Col, Nav, Navbar, Form } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUpload, FaChartLine, FaHistory } from 'react-icons/fa';

const linkConfig = [
  { to: '/', label: 'Home', icon: <FaHome className="me-2" /> },
  { to: '/upload', label: 'Upload / Capture Food', icon: <FaUpload className="me-2" /> },
  { to: '/results', label: 'Results', icon: <FaChartLine className="me-2" /> },
  { to: '/history', label: 'History', icon: <FaHistory className="me-2" /> }
];

function DashboardLayout({ children, isDarkMode, setIsDarkMode }) {
  return (
    <Container fluid className="min-vh-100">
      <Row>
        <Col md={3} lg={2} className="sidebar d-flex flex-column p-3">
          <h5 className="fw-bold mb-4">Food Vision</h5>
          <Nav className="flex-column gap-2">
            {linkConfig.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `nav-link rounded px-3 py-2 ${isActive ? 'active-link' : ''}`}
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </Nav>
        </Col>
        <Col md={9} lg={10} className="px-0">
          <Navbar className="border-bottom px-4 py-3 justify-content-between">
            <h4 className="mb-0">Computer Vision Based Food Volume Measurement System</h4>
            <Form.Check
              type="switch"
              id="dark-mode-toggle"
              label="Dark Mode"
              checked={isDarkMode}
              onChange={(e) => setIsDarkMode(e.target.checked)}
            />
          </Navbar>
          <main className="p-4">{children}</main>
        </Col>
      </Row>
    </Container>
  );
}

export default DashboardLayout;
