import { WeatherDataPoint, Location, HistoricalWeatherData, DateRange } from '../types';
import { addDays, startOfDay, differenceInDays } from 'date-fns';

export function generateMockWeatherData(
  location: Location,
  dateRange: DateRange,
  yearsOfHistory: number = 20
): HistoricalWeatherData {
  const data: WeatherDataPoint[] = [];
  const currentYear = new Date().getFullYear();

  const daysInRange = differenceInDays(dateRange.endDate, dateRange.startDate) + 1;

  for (let yearOffset = 0; yearOffset < yearsOfHistory; yearOffset++) {
    const year = currentYear - yearOffset - 1;

    for (let dayOffset = 0; dayOffset < daysInRange; dayOffset++) {
      const date = new Date(
        year,
        dateRange.startDate.getMonth(),
        dateRange.startDate.getDate() + dayOffset
      );

      if (date > new Date()) continue;

      const dataPoint = generateWeatherDataPoint(location, date);
      data.push(dataPoint);
    }
  }

  return {
    location,
    data: data.sort((a, b) => a.date.getTime() - b.date.getTime()),
    source: 'Mock NASA POWER API Data (Replace with real API)',
    dateRange
  };
}

function generateWeatherDataPoint(location: Location, date: Date): WeatherDataPoint {
  const dayOfYear = getDayOfYear(date);
  const latitude = location.latitude;

  const seasonalTemp = getSeasonalTemperature(dayOfYear, latitude);
  const randomVariation = (Math.random() - 0.5) * 10;
  const temperature = seasonalTemp + randomVariation;

  const temperatureMin = temperature - Math.random() * 5 - 2;
  const temperatureMax = temperature + Math.random() * 5 + 2;

  const rainfall = generateRainfall(dayOfYear, latitude);

  const windspeed = Math.random() * 12 + 2 + (Math.abs(latitude) > 40 ? 5 : 0);

  const snowfall = temperature < 0 && Math.random() > 0.6
    ? Math.random() * 15
    : 0;

  const dustConcentration = generateDustConcentration(location, dayOfYear);

  const cloudCover = rainfall > 1
    ? 60 + Math.random() * 40
    : Math.random() * 60;

  return {
    date: startOfDay(date),
    temperature: Number(temperature.toFixed(1)),
    temperatureMin: Number(temperatureMin.toFixed(1)),
    temperatureMax: Number(temperatureMax.toFixed(1)),
    rainfall: Number(rainfall.toFixed(1)),
    windspeed: Number(windspeed.toFixed(1)),
    snowfall: Number(snowfall.toFixed(1)),
    dustConcentration: Number(dustConcentration.toFixed(1)),
    cloudCover: Number(cloudCover.toFixed(0))
  };
}

function getSeasonalTemperature(dayOfYear: number, latitude: number): number {
  const hemisphere = latitude >= 0 ? 1 : -1;

  const summerPeak = hemisphere === 1 ? 172 : 355;
  const winterPeak = hemisphere === 1 ? 355 : 172;

  const baseTemp = 15;
  const amplitude = 20;

  const latitudeFactor = 1 - (Math.abs(latitude) / 90) * 0.5;

  const angle = ((dayOfYear - summerPeak) / 365) * 2 * Math.PI;
  const seasonalVariation = Math.cos(angle) * amplitude * latitudeFactor;

  const tropicalBase = Math.abs(latitude) < 23.5 ? 10 : 0;

  return baseTemp + seasonalVariation + tropicalBase;
}

function generateRainfall(dayOfYear: number, latitude: number): number {
  const baseRainProbability = 0.3;

  const hemisphere = latitude >= 0 ? 1 : -1;
  const summerPeak = hemisphere === 1 ? 172 : 355;

  const angle = ((dayOfYear - summerPeak) / 365) * 2 * Math.PI;
  const seasonalFactor = Math.cos(angle) * 0.2;

  const rainProbability = baseRainProbability + seasonalFactor;

  if (Math.random() > rainProbability) {
    return 0;
  }

  const intensity = Math.random();
  if (intensity > 0.9) {
    return Math.random() * 80 + 40;
  } else if (intensity > 0.7) {
    return Math.random() * 30 + 10;
  } else {
    return Math.random() * 10;
  }
}

function generateDustConcentration(location: Location, dayOfYear: number): number {
  const { latitude, longitude } = location;

  const isDustBelt = (
    (latitude > 15 && latitude < 35 && longitude > -20 && longitude < 60) ||
    (latitude > 30 && latitude < 50 && longitude > 60 && longitude < 120)
  );

  const baseConcentration = isDustBelt ? 80 : 20;

  const summerIncrease = Math.cos(((dayOfYear - 172) / 365) * 2 * Math.PI) * 30;

  const randomVariation = (Math.random() - 0.5) * 40;

  return Math.max(5, baseConcentration + summerIncrease + randomVariation);
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function generateMultiYearComparison(
  location: Location,
  date: Date,
  yearsToCompare: number = 10
): WeatherDataPoint[] {
  const currentYear = new Date().getFullYear();
  const dataPoints: WeatherDataPoint[] = [];

  for (let yearOffset = 1; yearOffset <= yearsToCompare; yearOffset++) {
    const year = currentYear - yearOffset;
    const historicalDate = new Date(year, date.getMonth(), date.getDate());

    if (historicalDate <= new Date()) {
      dataPoints.push(generateWeatherDataPoint(location, historicalDate));
    }
  }

  return dataPoints;
}
