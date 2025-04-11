import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Spinner } from 'react-bootstrap';
import { OPENWEATHER_API_KEY } from './App';

const UNSPLASH_ACCESS_KEY = 'Pp8bqVBLEiq3NgNO0NrKMYKISYvSP-MvamjjRuFGfuI';

function CityDetails() {
  const { cityName } = useParams();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );
        const weatherData = await weatherRes.json();

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );
        const forecastData = await forecastRes.json();

        const photoRes = await fetch(
          `https://api.unsplash.com/search/photos?query=${cityName}&client_id=${UNSPLASH_ACCESS_KEY}`
        );
        const photoData = await photoRes.json();

        setWeather(weatherData);
        setForecast(forecastData);
        setPhoto(photoData.results[0]?.urls?.regular);
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
      }
      setLoading(false);
    };

    fetchCityData();
  }, [cityName]);

  if (loading) {
    return (
      <div className="page-background">
        <Container className="py-5 text-center">
          <Spinner animation="border" />
        </Container>
      </div>
    );
  }

  if (!weather || !forecast) {
    return (
      <div className="page-background">
        <Container className="py-5 text-center">
          <p>Dati meteo non disponibili per "{cityName}".</p>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-background">
      <Container className="py-5">
        <h2 className="mb-4 text-center">
          <i className="bi bi-geo-alt-fill me-2"></i>Meteo a {weather.name}
        </h2>

        {photo && (
          <div className="mb-4 text-center">
            <img
              src={photo}
              alt={`Vista di ${cityName}`}
              className="img-fluid rounded shadow"
              style={{ maxHeight: '600px', objectFit: 'cover', width: "100%" }}
            />
          </div>
        )}

        <Card className="mb-4 shadow rounded">
          <Card.Body>
            <Card.Title><i className="bi bi-thermometer-half me-2"></i>Condizioni Attuali</Card.Title>
            <Card.Text>
              <i className="bi bi-thermometer me-2"></i>Temperatura: {weather.main.temp}°C<br />
              <i className="bi bi-cloud me-2"></i>Condizioni: {weather.weather[0].description}<br />
              <i className="bi bi-droplet me-2"></i>Umidità: {weather.main.humidity}%<br />
              <i className="bi bi-wind me-2"></i>Vento: {weather.wind.speed} m/s
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="shadow rounded">
          <Card.Body>
            <Card.Title><i className="bi bi-calendar3 me-2"></i>Previsioni</Card.Title>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
              {forecast.list.filter((_, i) => i % 8 === 0).map((item, idx) => (
                <div key={idx} className="border rounded p-2 text-center forecast-box">
                  <strong>{new Date(item.dt_txt).toLocaleDateString()}</strong>
                  <div><i className="bi bi-thermometer me-1"></i>{item.main.temp}°C</div>
                  <div><i className="bi bi-cloud me-1"></i>{item.weather[0].description}</div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default CityDetails;