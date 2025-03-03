'use client'
import { useEffect, useState } from "react";

interface Location {
  name: string;
  country: string;
}

interface Current {
  temp_c: number;
  temp_f: number;
}

interface WeatherData {
  location: Location;
  current: Current;
}

export default function Weather() {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = (query: string) => {
    setLoading(true);
    setError(null);

    fetch(`http://api.weatherapi.com/v1/current.json?key=9390668d48c143adba734806252702&q=${query}&aqi=no`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Location not found");
        }
        return res.json();
      })
      .then((data: WeatherData) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setWeather(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWeather(location);
  }, []);

  return (
    <main style={{ backgroundColor: "white" }}>
      <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "400px", backgroundColor: "white", color: "black" }}>
        <h2>Weather Search</h2>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city or region"
          style={{ padding: "8px", marginRight: "8px", width: "70%" }}
        />
        <button onClick={() => fetchWeather(location)} style={{ padding: "8px" }}>Search</button>

        {loading && <p>Loading weather data...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {weather && (
          <div>
            <h3>Temperature in {weather.location.name}, {weather.location.country}</h3>
            <p><strong>{weather.current.temp_c}°C / {weather.current.temp_f}°F</strong></p>
          </div>
        )}
      </div>
    </main>
  );
}
