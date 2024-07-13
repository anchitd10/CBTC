import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

const Weather = () => {
    const inputRef = useRef();
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState([]);

    const allIcons = {
        '01d': clear_icon,
        '01n': clear_icon,
        '02d': cloud_icon,
        '02n': cloud_icon,
        '03d': cloud_icon,
        '03n': cloud_icon,
        '04d': drizzle_icon,
        '04n': drizzle_icon,
        '09d': rain_icon,
        '09n': rain_icon,
        '10d': rain_icon,
        '10n': rain_icon,
        '13d': snow_icon,
        '13n': snow_icon,
    };

    const search = async (city) => {
        if (city === '') {
            alert('Please enter city name');
            return;
        }
        try {
            const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

            const [currentResponse, forecastResponse] = await Promise.all([
                fetch(currentUrl),
                fetch(forecastUrl),
            ]);

            const currentData = await currentResponse.json();
            const forecastData = await forecastResponse.json();

            if (!currentResponse.ok || !forecastResponse.ok) {
                alert(currentData.message || forecastData.message);
                return;
            }

            console.log(currentData);
            console.log(forecastData);

            const currentIcon = allIcons[currentData.weather[0].icon] || clear_icon;
            setCurrentWeather({
                humidity: currentData.main.humidity,
                windSpeed: currentData.wind.speed,
                temperature: Math.floor(currentData.main.temp),
                location: currentData.name,
                icon: currentIcon,
            });

            // Next 4 days weather data
            const dailyForecast = forecastData.list.filter((item) =>
                item.dt_txt.includes('12:00:00')
            ).slice(1, 5).map((item) => {
                const date = new Date(item.dt_txt);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

                return {
                    day: dayName,
                    temperature: Math.floor(item.main.temp),
                    icon: allIcons[item.weather[0].icon] || clear_icon,
                };
            });

            setForecast(dailyForecast);

        } catch (error) {
            setCurrentWeather(null);
            setForecast([]);
            console.error('Error in fetching weather data');
        }
    };

    useEffect(() => {
        search('New Delhi');
    }, []);

    return (
        <div className='weather'>
            <div className="current-weather">
                <div className="search-bar">
                    <input ref={inputRef} type="text" placeholder='Search' />
                    <img src={search_icon} alt="" onClick={() => search(inputRef.current.value)} />
                </div>
                {currentWeather && (
                    <>
                        <img src={currentWeather.icon} alt="" className='weather-icon' />
                        <p className='temperature'>{currentWeather.temperature}°C</p>
                        <p className='location'>{currentWeather.location}</p>
                        <div className="weather-data">
                            <div className="col">
                                <img src={humidity_icon} alt="" />
                                <div>
                                    <p>{currentWeather.humidity} %</p>
                                    <span>Humidity</span>
                                </div>
                            </div>
                            <div className="col">
                                <img src={wind_icon} alt="" />
                                <div>
                                    <p>{currentWeather.windSpeed} Km/h</p>
                                    <span>Wind Speed</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="separator"></div>
            <div className="forecast">
                {forecast.map((day, index) => (
                    <div key={index} className="forecast-item">
                        <img src={day.icon} alt="" className='forecast-icon' />
                        <div>
                            <p className='day'>{day.day}</p>
                            <p>{day.temperature}°C</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Weather;
