import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AboutPage } from './components/layout/AboutPage';
import { LocationSearch } from './components/location/LocationSearch';
import { MapSelector } from './components/location/MapSelector';
import { DateRangePicker } from './components/date/DateRangePicker';
import { VariableSelector } from './components/weather/VariableSelector';
import { ResultsSummary } from './components/dashboard/ResultsSummary';
import { VisualizationPanel } from './components/dashboard/VisualizationPanel';
import { ExportPanel } from './components/dashboard/ExportPanel';
import { Button } from './components/common/Button';
import { Loading } from './components/common/Loading';
import { Card, CardBody } from './components/common/Card';
import { Location, DateRange, WeatherThreshold, WeatherAnalysis, LoadingState } from './types';
import { fetchWeatherAnalysis } from './services/weatherService';
import { AlertCircle } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about'>('home');
  const [location, setLocation] = useState<Location | undefined>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [thresholds, setThresholds] = useState<WeatherThreshold[]>([]);
  const [analysis, setAnalysis] = useState<WeatherAnalysis | undefined>();
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async () => {
    if (!location || !dateRange || selectedVariables.length === 0) {
      setError('Please complete all required fields: location, date range, and at least one weather variable.');
      return;
    }

    setLoadingState('loading');
    setError(undefined);

    try {
      const result = await fetchWeatherAnalysis({
        location,
        dateRange,
        selectedVariables,
        thresholds
      });

      setAnalysis(result);
      setLoadingState('success');
    } catch (err) {
      setError('Failed to fetch weather analysis. Please try again.');
      setLoadingState('error');
    }
  };

  const handleReset = () => {
    setAnalysis(undefined);
    setLoadingState('idle');
    setError(undefined);
  };

  if (currentPage === 'about') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col transition-colors duration-200">
        <Header onNavigate={setCurrentPage} currentPage={currentPage} />
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <AboutPage />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col transition-colors duration-200">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-text-primary mb-4">
              Weather Probability Analysis
            </h1>
            <p className="text-xl text-gray-600 dark:text-text-secondary max-w-3xl mx-auto">
              Plan your outdoor events with confidence using historical weather data from NASA Earth observations
            </p>
          </div>

          {loadingState === 'loading' && (
            <Loading fullScreen text="Analyzing historical weather patterns..." />
          )}

          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardBody>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-900">{error}</p>
                </div>
              </CardBody>
            </Card>
          )}

          {!analysis ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="lg:col-span-2">
                <CardBody>
                  <LocationSearch
                    onLocationSelect={setLocation}
                    selectedLocation={location}
                  />
                </CardBody>
              </Card>

              <Card className="lg:col-span-2">
                <CardBody>
                  <MapSelector
                    onLocationSelect={setLocation}
                    selectedLocation={location}
                  />
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <DateRangePicker
                    onDateRangeChange={setDateRange}
                    dateRange={dateRange}
                  />
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <VariableSelector
                    selectedVariables={selectedVariables}
                    onVariablesChange={setSelectedVariables}
                    thresholds={thresholds}
                    onThresholdsChange={setThresholds}
                  />
                </CardBody>
              </Card>

              <Card className="lg:col-span-2">
                <CardBody>
                  <div className="flex justify-center">
                    <Button
                      onClick={handleSubmit}
                      size="lg"
                      disabled={!location || !dateRange || selectedVariables.length === 0}
                      className="min-w-64"
                    >
                      Analyze Weather Probability
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button onClick={handleReset} variant="outline">
                  New Analysis
                </Button>
              </div>

              <ResultsSummary analysis={analysis} />
              <VisualizationPanel analysis={analysis} />
              <ExportPanel analysis={analysis} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
