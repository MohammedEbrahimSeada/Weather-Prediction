# Rain-Sight - From Space to Your Schedule

A comprehensive web application that uses NASA Earth observation data to estimate the likelihood of specific weather conditions for user-selected locations and dates. Rain-Sight helps users plan outdoor events like hiking, fishing, vacations, or festivals by analyzing historical weather patterns.

## Features

- **Location Selection**: Search for cities or select locations directly on an interactive map
- **Date Range Analysis**: Choose specific dates or use seasonal presets (Summer, Winter, Spring, Fall)
- **Weather Variables**: Analyze temperature, rainfall, windspeed, snowfall, dust concentration, and cloud cover
- **Activity Presets**: Quick configurations for common activities (Hiking, Beach, Festivals, Fishing)
- **Probability Calculations**: Statistical analysis of historical data to predict weather likelihood
- **Data Visualizations**: Interactive charts including trend lines, distributions, and probability charts
- **Risk Assessment**: Overall risk scores and detailed interpretations
- **Data Export**: Download complete analysis in CSV or JSON format with metadata
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Maps**: React Leaflet with OpenStreetMap
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components (Button, Card, Loading)
│   ├── dashboard/       # Results display components
│   ├── date/           # Date picker components
│   ├── layout/         # Header, Footer, About page
│   ├── location/       # Location search and map components
│   ├── visualization/  # Chart components
│   └── weather/        # Weather variable selection
├── data/
│   └── mockDataGenerator.ts  # Mock NASA data generator
├── services/
│   ├── supabase.ts          # Supabase client
│   └── weatherService.ts    # Weather data fetching
├── types/
│   └── index.ts            # TypeScript type definitions
├── utils/
│   ├── constants.ts        # Constants and presets
│   ├── exportData.ts       # Data export utilities
│   └── probabilityCalculator.ts  # Probability calculation engine
└── App.tsx                # Main application component
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Database Schema

The application uses Supabase with the following tables:

### `locations`
- Stores location information (name, coordinates, country, region)
- Public read access for reference data

### `saved_queries`
- Stores user query history
- Users can save and retrieve past analyses

### `user_preferences`
- Stores user preferences (default thresholds, favorite locations, units)
- Optional authentication for personalized experience

## Integrating Real NASA APIs

**IMPORTANT**: This application currently uses mock data to simulate NASA API responses. To connect to real NASA APIs:

### 1. NASA POWER API

Replace mock data calls in `src/services/weatherService.ts`:

```typescript
// CURRENT (Mock):
const historicalData = generateMockWeatherData(location, dateRange, 20);

// REPLACE WITH (Real API):
const response = await fetch(
  `https://power.larc.nasa.gov/api/temporal/daily/point?` +
  `parameters=T2M,PRECTOTCORR,WS10M&` +
  `community=RE&` +
  `longitude=${location.longitude}&` +
  `latitude=${location.latitude}&` +
  `start=${formatDate(dateRange.startDate)}&` +
  `end=${formatDate(dateRange.endDate)}&` +
  `format=JSON`
);
const nasaData = await response.json();
const historicalData = transformNASADataToWeatherDataPoints(nasaData);
```

### 2. NASA Earthdata

For additional datasets (dust, cloud cover):

```typescript
// Register for NASA Earthdata account at: https://urs.earthdata.nasa.gov/
// Use NASA GES DISC API for aerosol and cloud data

const response = await fetch(
  `https://disc.gsfc.nasa.gov/api/data/query?` +
  `dataset=MERRA2&` +
  `variable=DUST&` +
  `bbox=${location.latitude},${location.longitude},...`,
  {
    headers: {
      'Authorization': `Bearer ${NASA_API_TOKEN}`
    }
  }
);
```

### 3. API Key Management

Add NASA API credentials to `.env`:

```env
VITE_NASA_POWER_API_KEY=your_api_key_here
VITE_NASA_EARTHDATA_TOKEN=your_token_here
```

### 4. Data Transformation

Create transformation functions in `src/utils/dataTransformers.ts`:

```typescript
export function transformNASADataToWeatherDataPoints(
  nasaResponse: any
): WeatherDataPoint[] {
  // Transform NASA API response format to app's WeatherDataPoint format
  // Handle missing data, unit conversions, etc.
}
```

## Mock Data Details

The mock data generator (`src/data/mockDataGenerator.ts`) simulates:

- **Seasonal patterns**: Temperature varies with day of year and hemisphere
- **Latitude effects**: Temperature ranges adjust based on latitude
- **Weather correlations**: Rainfall affects cloud cover, temperature affects snowfall
- **Regional characteristics**: Dust concentration higher in known dust belt regions
- **Random variations**: Realistic day-to-day weather variability

## Probability Calculation Algorithm

The app calculates probabilities using:

1. **Historical Data Collection**: Gather 20+ years of data for the selected date range
2. **Threshold Matching**: Count days meeting user-defined thresholds
3. **Probability Calculation**: `Probability = (Matching Days / Total Days) × 100`
4. **Risk Scoring**: Weighted average across all selected variables
5. **Interpretation Generation**: Context-aware descriptions based on probability levels

## Data Export Format

### CSV Export
- One row per historical data point
- Columns: Date, Temperature, Rainfall, Windspeed, etc.
- Compatible with Excel and data analysis tools

### JSON Export
- Complete analysis object including:
  - Query parameters
  - Probability results
  - Historical data
  - Metadata (source, timestamp, API version)
  - Notes about data source

## NASA Data Sources

- **NASA POWER**: https://power.larc.nasa.gov/
- **NASA Earthdata**: https://www.earthdata.nasa.gov/
- **NASA GES DISC**: https://disc.gsfc.nasa.gov/

## Development Notes

### Type Safety
All components use TypeScript with strict type checking. See `src/types/index.ts` for type definitions.

### State Management
Uses React hooks (useState, useEffect) for state management. For larger apps, consider adding Redux or Zustand.

### Error Handling
Comprehensive error handling in:
- API calls (try/catch blocks)
- Form validation
- Data transformation
- Chart rendering

### Performance Considerations
- Lazy load heavy components (maps, charts)
- Memoize expensive calculations
- Use React.memo for frequently re-rendered components
- Implement pagination for large datasets

### Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support
- High contrast colors
- Screen reader friendly

## Future Enhancements

1. **Authentication System**: Add user accounts for saving queries and preferences
2. **Real NASA API Integration**: Connect to live NASA data sources
3. **Advanced Analytics**: Add correlation analysis between weather variables
4. **Forecast Integration**: Combine historical probabilities with current forecasts
5. **Mobile App**: React Native version for iOS and Android
6. **Collaborative Features**: Share analyses with team members
7. **Machine Learning**: Predict future trends using ML models
8. **Multi-location Comparison**: Compare weather patterns across locations

## Contributing

When adding new features:
1. Follow the existing component structure
2. Add TypeScript types for new data structures
3. Update this README with relevant documentation
4. Test responsive design on multiple devices
5. Ensure accessibility standards are met

## License

MIT License - feel free to use this project as a starting point for your own weather analysis applications.

## Support

For questions about NASA APIs:
- NASA POWER Documentation: https://power.larc.nasa.gov/docs/
- NASA Earthdata Forum: https://forum.earthdata.nasa.gov/

For application issues:
- Check browser console for errors
- Verify Supabase connection
- Review component props and state

---

**Note**: This application uses mock data for demonstration. Connect to real NASA APIs before deploying to production.
