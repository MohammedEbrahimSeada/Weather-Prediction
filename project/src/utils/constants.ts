import { WeatherVariable } from '../types';

export const WEATHER_VARIABLES: WeatherVariable[] = [
  {
    id: 'temperature',
    name: 'Temperature',
    unit: '°C',
    icon: 'thermometer',
    description: 'Mean, minimum, and maximum temperature'
  },
  {
    id: 'rainfall',
    name: 'Rainfall',
    unit: 'mm',
    icon: 'cloud-rain',
    description: 'Total precipitation'
  },
  {
    id: 'windspeed',
    name: 'Wind Speed',
    unit: 'm/s',
    icon: 'wind',
    description: 'Average wind speed'
  },
  {
    id: 'snowfall',
    name: 'Snowfall',
    unit: 'cm',
    icon: 'snowflake',
    description: 'Snow depth and accumulation'
  },
  {
    id: 'dustConcentration',
    name: 'Dust Concentration',
    unit: 'μg/m³',
    icon: 'circle-dot',
    description: 'Atmospheric dust and aerosol levels'
  },
  {
    id: 'cloudCover',
    name: 'Cloud Cover',
    unit: '%',
    icon: 'cloud',
    description: 'Percentage of sky covered by clouds'
  }
];

export const DEFAULT_THRESHOLDS = {
  temperature: {
    veryHot: 35,
    hot: 30,
    warm: 25,
    cool: 15,
    cold: 5,
    veryCold: -5
  },
  rainfall: {
    veryWet: 50,
    wet: 20,
    moderate: 10,
    light: 2
  },
  windspeed: {
    veryWindy: 15,
    windy: 10,
    breezy: 5
  },
  cloudCover: {
    veryCloudy: 80,
    cloudy: 50,
    partlyCloudy: 25
  }
};

export const ACTIVITY_PRESETS = [
  {
    id: 'hiking',
    name: 'Hiking',
    icon: 'mountain',
    description: 'Ideal conditions for day hikes and trail walks',
    thresholds: [
      { variableId: 'temperature', operator: 'between' as const, value: 15, value2: 28, label: 'Comfortable temperature (15-28°C)' },
      { variableId: 'rainfall', operator: 'lt' as const, value: 5, label: 'Low rainfall (<5mm)' },
      { variableId: 'windspeed', operator: 'lt' as const, value: 10, label: 'Moderate wind (<10m/s)' }
    ]
  },
  {
    id: 'beach',
    name: 'Beach Day',
    icon: 'waves',
    description: 'Perfect weather for sunbathing and swimming',
    thresholds: [
      { variableId: 'temperature', operator: 'gte' as const, value: 25, label: 'Warm weather (≥25°C)' },
      { variableId: 'rainfall', operator: 'lt' as const, value: 2, label: 'Very low rainfall (<2mm)' },
      { variableId: 'cloudCover', operator: 'lt' as const, value: 40, label: 'Mostly sunny (<40% cloud)' }
    ]
  },
  {
    id: 'skiing',
    name: 'Ski Trip',
    icon: 'snowflake',
    description: 'Optimal snow conditions for skiing and snowboarding',
    thresholds: [
      { variableId: 'temperature', operator: 'between' as const, value: -10, value2: 5, label: 'Cold for snow (-10 to 5°C)' },
      { variableId: 'snowfall', operator: 'gte' as const, value: 10, label: 'Good snow depth (≥10cm)' },
      { variableId: 'windspeed', operator: 'lt' as const, value: 15, label: 'Safe wind conditions (<15m/s)' }
    ]
  },
  {
    id: 'camping',
    name: 'Camping',
    icon: 'tent',
    description: 'Comfortable conditions for outdoor camping',
    thresholds: [
      { variableId: 'temperature', operator: 'between' as const, value: 12, value2: 30, label: 'Moderate temperature (12-30°C)' },
      { variableId: 'rainfall', operator: 'lt' as const, value: 8, label: 'Minimal rain (<8mm)' },
      { variableId: 'windspeed', operator: 'lt' as const, value: 10, label: 'Light wind (<10m/s)' }
    ]
  },
  {
    id: 'festival',
    name: 'Outdoor Festival',
    icon: 'music',
    description: 'Pleasant weather for outdoor events and concerts',
    thresholds: [
      { variableId: 'temperature', operator: 'between' as const, value: 18, value2: 32, label: 'Pleasant temperature (18-32°C)' },
      { variableId: 'rainfall', operator: 'lt' as const, value: 10, label: 'Low rainfall (<10mm)' },
      { variableId: 'windspeed', operator: 'lt' as const, value: 12, label: 'Manageable wind (<12m/s)' }
    ]
  },
  {
    id: 'fishing',
    name: 'Fishing',
    icon: 'fish',
    description: 'Calm conditions ideal for fishing',
    thresholds: [
      { variableId: 'temperature', operator: 'between' as const, value: 10, value2: 30, label: 'Comfortable range (10-30°C)' },
      { variableId: 'windspeed', operator: 'lt' as const, value: 8, label: 'Calm conditions (<8m/s)' },
      { variableId: 'rainfall', operator: 'lt' as const, value: 15, label: 'Moderate rainfall (<15mm)' }
    ]
  },
  {
    id: 'cycling',
    name: 'Cycling',
    icon: 'bike',
    description: 'Great weather for road cycling and biking',
    thresholds: [
      { variableId: 'temperature', operator: 'between' as const, value: 15, value2: 28, label: 'Comfortable temperature (15-28°C)' },
      { variableId: 'rainfall', operator: 'lt' as const, value: 3, label: 'Dry conditions (<3mm)' },
      { variableId: 'windspeed', operator: 'lt' as const, value: 12, label: 'Manageable wind (<12m/s)' }
    ]
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: 'camera',
    description: 'Interesting weather conditions for outdoor photography',
    thresholds: [
      { variableId: 'temperature', operator: 'between' as const, value: 10, value2: 30, label: 'Comfortable for equipment (10-30°C)' },
      { variableId: 'cloudCover', operator: 'between' as const, value: 30, value2: 70, label: 'Interesting clouds (30-70%)' },
      { variableId: 'rainfall', operator: 'lt' as const, value: 5, label: 'Equipment safe (<5mm)' }
    ]
  }
];

export const NASA_DATA_SOURCES = {
  POWER: {
    name: 'NASA POWER',
    description: 'Prediction Of Worldwide Energy Resources',
    url: 'https://power.larc.nasa.gov/api',
    docs: 'https://power.larc.nasa.gov/docs/'
  },
  EARTHDATA: {
    name: 'NASA Earthdata',
    description: 'Comprehensive Earth Science Data',
    url: 'https://www.earthdata.nasa.gov/',
    docs: 'https://www.earthdata.nasa.gov/learn'
  },
  GES_DISC: {
    name: 'NASA GES DISC',
    description: 'Goddard Earth Sciences Data and Information Services Center',
    url: 'https://disc.gsfc.nasa.gov/',
    docs: 'https://disc.gsfc.nasa.gov/information'
  }
};

export const MOCK_LOCATIONS = [
  { name: 'Cairo, Egypt', latitude: 30.0444, longitude: 31.2357, country: 'Egypt', region: 'North Africa' },
  { name: 'Paris, France', latitude: 48.8566, longitude: 2.3522, country: 'France', region: 'Europe' },
  { name: 'Tokyo, Japan', latitude: 35.6762, longitude: 139.6503, country: 'Japan', region: 'Asia' },
  { name: 'New York, USA', latitude: 40.7128, longitude: -74.0060, country: 'USA', region: 'North America' },
  { name: 'Sydney, Australia', latitude: -33.8688, longitude: 151.2093, country: 'Australia', region: 'Oceania' },
  { name: 'Rio de Janeiro, Brazil', latitude: -22.9068, longitude: -43.1729, country: 'Brazil', region: 'South America' },
  { name: 'Mumbai, India', latitude: 19.0760, longitude: 72.8777, country: 'India', region: 'Asia' },
  { name: 'London, UK', latitude: 51.5074, longitude: -0.1278, country: 'UK', region: 'Europe' }
];
