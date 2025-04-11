import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import WeatherApp from './WeatherApp';
import CityDetails from './CityDetails';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export const OPENWEATHER_API_KEY = 'c399fba5369c3ecf1bb3158e1137b374';

function App() {
  const currentYear = new Date().getFullYear();
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme === 'true';
  });

  const toggleTheme = () => {
    setDarkMode((prev) => {
      localStorage.setItem('darkMode', !prev);
      return !prev;
    });
  };

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <Router>
      <Navbar expand="lg" className="custom-navbar shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className={darkMode ? "navbar-title-dark" : "navbar-title-light"}>
            <i className="bi bi-cloud-sun-fill"></i> MeteoMood
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link onClick={toggleTheme} style={{ cursor: 'pointer' }}>
                {darkMode ? (
                  <i className="bi bi-brightness-high"></i>
                ) : (
                  <i className="bi bi-moon-stars"></i>
                )}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="main-content px-3 px-md-5">
        <Routes>
          <Route path="/" element={<WeatherApp />} />
          <Route path="/city/:cityName" element={<CityDetails />} />
        </Routes>
      </Container>

      <footer className="text-center py-4">
        <div className="mb-2">
          <a href="#" className="mx-2"><i className="bi bi-facebook"></i></a>
          <a href="#" className="mx-2"><i className="bi bi-instagram"></i></a>
          <a href="#" className="mx-2"><i className="bi bi-twitter"></i></a>
          <a href="#" className="mx-2"><i className="bi bi-youtube"></i></a>
        </div>
        <small>&copy; {currentYear} MeteoMood. Tutti i diritti riservati.</small>
      </footer>
    </Router>
  );
}

export default App;
