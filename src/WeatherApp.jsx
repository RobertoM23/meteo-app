import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Spinner, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { OPENWEATHER_API_KEY } from './App';

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  const getWeather = async (selectedCity = city) => {
    if (!selectedCity) return;
    setLoading(true);
    try {
      const resWeather = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      const dataWeather = await resWeather.json();

      const resForecast = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      const dataForecast = await resForecast.json();

      setWeather(dataWeather);
      setForecast(dataForecast);

      const updatedSearches = [selectedCity, ...recentSearches.filter(item => item !== selectedCity)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (err) {
      console.error('Errore nel recupero dei dati meteo:', err);
      setWeather(null);
      setForecast(null);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getWeather();
  };

  return (
    <div className="page-background">
    <Container className="py-5">
      <h1 className="mb-4 text-center app-title"><i className="bi bi-cloud-sun fs-3 me-2"></i>MeteoMood</h1>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group controlId="city">
          <Form.Control
            type="text"
            placeholder="Inserisci una città"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Form.Group>
        <Button className="mt-2" variant="primary" type="submit">
          <i className="bi bi-search"></i> Cerca
        </Button>
      </Form>

      {recentSearches.length > 0 && (
        <Card className="mb-4 shadow rounded">
          <Card.Body>
            <Card.Title><i className="bi bi-clock-history me-2"></i>Ricerche recenti</Card.Title>
            <ListGroup variant="flush">
              {recentSearches.map((item, idx) => (
                <ListGroup.Item key={idx}>
                  <Link to={`/city/${item}`}>{item}</Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      {loading && <Spinner animation="border" />}

      {weather && (
        <Card className="mb-4 shadow rounded">
          <Card.Body>
            <Card.Title>
              <Link to={`/city/${weather.name}`}>{weather.name}</Link>
            </Card.Title>
            <Card.Text>
              <i className="bi bi-thermometer me-2"></i>Temperatura: {weather.main.temp}°C<br />
              <i className="bi bi-cloud me-2"></i>Condizioni: {weather.weather[0].description}<br />
              <i className="bi bi-droplet me-2"></i>Umidità: {weather.main.humidity}%<br />
              <i className="bi bi-wind me-2"></i>Vento: {weather.wind.speed} m/s
            </Card.Text>
          </Card.Body>
        </Card>
      )}

      {forecast && (
        <Card className="shadow rounded">
          <Card.Body>
            <Card.Title><i className="bi bi-calendar3 me-2"></i>Previsioni per i prossimi giorni</Card.Title>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
              {forecast.list.filter((_, i) => i % 8 === 0).map((item, idx) => (
                <div key={idx} className="border rounded p-2 text-center forecast-box">
                  <strong>{new Date(item.dt_txt).toLocaleDateString()}</strong>
                  <div><i className="bi bi-thermometer-half me-1"></i>{item.main.temp}°C</div>
                  <div><i className="bi bi-cloud me-1"></i>{item.weather[0].description}</div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
    </div>
  );
}
