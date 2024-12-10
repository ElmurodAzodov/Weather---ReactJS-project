import React, { useEffect, useRef, useState } from "react";
import "./weather.css";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import humidity_icon from "../assets/humidity.png";
import rain_icon from "../assets/rain.png";
import search_icon from "../assets/search.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import admin_icon from "../assets/admin.png";

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);

  const allIcons = {
    "01d": clear_icon, // Clear day
    "01n": clear_icon, // Clear night
    "02d": cloud_icon, // Few clouds day
    "02n": cloud_icon, // Few clouds night
    "03d": cloud_icon, // Scattered clouds
    "03n": cloud_icon,
    "04d": drizzle_icon, // Broken clouds
    "04n": drizzle_icon,
    "09d": rain_icon, // Shower rain
    "09n": rain_icon,
    "10d": rain_icon, // Rain day
    "10n": rain_icon, // Rain night
    "11d": drizzle_icon, // Thunderstorm
    "11n": drizzle_icon,
    "13d": snow_icon, // Snow day
    "13n": snow_icon, // Snow night
    "50d": cloud_icon, // Mist day
    "50n": cloud_icon, // Mist night
  };

  // Qidiruv funksiyasi
  // const search = async (query, type = "city") => {
  //   if (!query) {
  //     alert("Enter a city name or allow location access!");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     let url = "";
  //     if (type === "city") {
  //       url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${
  //         import.meta.env.VITE_APP_ID
  //       }`;
  //     } else if (type === "coords") {
  //       const { lat, lon } = query;
  //       url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${
  //         import.meta.env.VITE_APP_ID
  //       }`;
  //     }

  //     const response = await fetch(url);
  //     const data = await response.json();

  //     if (data.cod !== 200) throw new Error(data.message);

  //     // const icon = allIcons[data.weather?.[0]?.icon] || clear_icon;
  //     const icon = allIcons[data.weather?.[0]?.icon] || clear_icon;

  //     setWeatherData({
  //       humidity: data.main?.humidity || 0,
  //       windSpeed: data.wind?.speed || 0,
  //       temperature: Math.floor(data.main?.temp || 0),
  //       location: data.name || "Unknown Location",
  //       icon: icon,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching weather data:", error);
  //     setWeatherData(false);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Toastify kutubxonasini qo'llash uchun Toastify.js va Toastify.css fayllarini loyihangizga ulashing.
  // Toastify.js kutubxonasini ulashganingizni tasdiqlang:
  // <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
  // <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>

  const search = async (query, type = "city") => {
    if (!query) {
      Toastify({
        text: "Enter a city name or allow location access!",
        duration: 3000, // 3 soniya
        gravity: "top", // "top" yoki "bottom"
        position: "center", // "left", "center" yoki "right"
        backgroundColor: "#FF6F61", // chiroyli qizil rang
        stopOnFocus: true, // hover qilganda to'xtash
      }).showToast();
      return;
    }

    try {
      setLoading(true);
      let url = "";
      if (type === "city") {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${
          import.meta.env.VITE_APP_ID
        }`;
      } else if (type === "coords") {
        const { lat, lon } = query;
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${
          import.meta.env.VITE_APP_ID
        }`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== 200) throw new Error(data.message);

      const icon = allIcons[data.weather?.[0]?.icon] || clear_icon;

      setWeatherData({
        humidity: data.main?.humidity || 0,
        windSpeed: data.wind?.speed || 0,
        temperature: Math.floor(data.main?.temp || 0),
        location: data.name || "Unknown Location",
        icon: icon,
      });

      Toastify({
        text: `Weather data fetched successfully for "${data.name}"!`,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#4CAF50", // yashil rang
        stopOnFocus: true,
      }).showToast();
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData(false);

      Toastify({
        text: `Error: ${error.message}`,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF6F61", // qizil rang
        stopOnFocus: true,
      }).showToast();
    } finally {
      setLoading(false);
    }
  };

  // Jonli joylashuvni olish uchun geolokatsiya API
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        search({ lat, lon }, "coords");
      },
      (error) => {
        console.error("Geolocation error:", error);
        search("Tashkent", "city"); // Fallback joylashuv
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Enter tugmasi bilan qidiruvni ishga tushirish
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      search(inputRef.current.value, "city");
    }
  };

  return (
    <>
      <div className="weather">
        <div className="search-bar">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            onKeyDown={handleKeyDown} // Enter tugmasi bosilganda ishlaydi
          />
          <img
            src={search_icon}
            alt="Search"
            onClick={() => search(inputRef.current.value, "city")}
          />
        </div>
        {loading ? (
          <p className="loading">Loading... </p>
        ) : weatherData ? (
          <>
            <img
              src={weatherData.icon || clear_icon}
              alt="Weather Icon"
              className="weather-icon"
            />
            <p className="temperature">{weatherData.temperature || 0}°C</p>
            <p className="location">
              {weatherData.location || "Unknown Location"}
            </p>
            <div className="weather-data">
              <div className="col">
                <img src={humidity_icon} alt="Humidity" />
                <div>
                  <p>{weatherData.humidity || 0} %</p>
                  <span>Humidity</span>
                </div>
              </div>
              <div className="col">
                <img src={wind_icon} alt="Wind Speed" />
                <div>
                  <p>{weatherData.windSpeed || 0} km/h</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Error fetching data. Try again.</p>
        )}
      </div>
      <div className="admin">
        <a href="https://t.me/the_elmurod">
          <img src={admin_icon} alt="Not found!" />
        </a>
      </div>
    </>
  );
};

export default Weather;
