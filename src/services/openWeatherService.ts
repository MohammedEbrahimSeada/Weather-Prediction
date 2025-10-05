import { Location } from '../types';

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  cloudCover: number;
  rainfall: number;
  description: string;
  icon: string;
  timestamp: Date;
}

export interface WeatherComparison {
  current: CurrentWeather;
  historical: {
    avgTemperature: number;
    avgRainfall: number;
    avgWindSpeed: number;
    avgCloudCover: number;
  };
  deviations: {
    temperature: number;
    rainfall: number;
    windSpeed: number;
    cloudCover: number;
  };
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getCurrentWeather(location: Location): Promise<CurrentWeather> {
  if (!API_KEY) {
    return {
      temperature: 22 + Math.random() * 10,
      feelsLike: 21 + Math.random() * 10,
      humidity: 60 + Math.random() * 30,
      windSpeed: 3 + Math.random() * 5,
      cloudCover: 40 + Math.random() * 30,
      rainfall: Math.random() * 2,
      description: 'Partly cloudy',
      icon: '02d',
      timestamp: new Date(),
    };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch current weather');
    }

    const data = await response.json();

    return {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      cloudCover: data.clouds.all,
      rainfall: data.rain?.['1h'] || 0,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      timestamp: new Date(data.dt * 1000),
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
}

export async function getWeatherForecast(location: Location, days: number = 5): Promise<CurrentWeather[]> {
  if (!API_KEY) {
    return Array.from({ length: days }, (_, i) => ({
      temperature: 20 + Math.random() * 15,
      feelsLike: 19 + Math.random() * 15,
      humidity: 50 + Math.random() * 40,
      windSpeed: 2 + Math.random() * 8,
      cloudCover: 30 + Math.random() * 50,
      rainfall: Math.random() * 5,
      description: i % 2 === 0 ? 'Clear sky' : 'Scattered clouds',
      icon: i % 2 === 0 ? '01d' : '03d',
      timestamp: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
    }));
  }

  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric&cnt=${days * 8}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather forecast');
    }

    const data = await response.json();

    return data.list.filter((_: any, index: number) => index % 8 === 0).map((item: any) => ({
      temperature: item.main.temp,
      feelsLike: item.main.feels_like,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      cloudCover: item.clouds.all,
      rainfall: item.rain?.['3h'] || 0,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      timestamp: new Date(item.dt * 1000),
    }));
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
}

export function compareWithHistorical(
  current: CurrentWeather,
  historicalAvg: {
    temperature: number;
    rainfall: number;
    windSpeed: number;
    cloudCover: number;
  }
): WeatherComparison {
  return {
    current,
    historical: {
      avgTemperature: historicalAvg.temperature,
      avgRainfall: historicalAvg.rainfall,
      avgWindSpeed: historicalAvg.windSpeed,
      avgCloudCover: historicalAvg.cloudCover,
    },
    deviations: {
      temperature: current.temperature - historicalAvg.temperature,
      rainfall: current.rainfall - historicalAvg.rainfall,
      windSpeed: current.windSpeed - historicalAvg.windSpeed,
      cloudCover: current.cloudCover - historicalAvg.cloudCover,
    },
  };
}
