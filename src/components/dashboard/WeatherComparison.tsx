import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, RefreshCw, Cloud, Droplets, Wind, Thermometer } from 'lucide-react';
import { Card, CardBody } from '../common/Card';
import { Button } from '../common/Button';
import { WeatherComparison as WeatherComparisonType } from '../../services/openWeatherService';
import { format } from 'date-fns';

interface WeatherComparisonProps {
  comparison: WeatherComparisonType | null;
  loading: boolean;
  onRefresh?: () => void;
}

export function WeatherComparison({ comparison, loading, onRefresh }: WeatherComparisonProps) {
  if (!comparison && !loading) return null;

  const getDeviationIcon = (value: number) => {
    if (value > 2) return <TrendingUp className="w-4 h-4 text-accent-red" />;
    if (value < -2) return <TrendingDown className="w-4 h-4 text-blue-500" />;
    return <Minus className="w-4 h-4 text-accent-green" />;
  };

  const getDeviationColor = (value: number, isInverse = false) => {
    const threshold = 2;
    if (isInverse) {
      if (value > threshold) return 'text-blue-500';
      if (value < -threshold) return 'text-accent-red';
    } else {
      if (value > threshold) return 'text-accent-red';
      if (value < -threshold) return 'text-blue-500';
    }
    return 'text-accent-green';
  };

  const formatDeviation = (value: number, unit: string) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}${unit}`;
  };

  const comparisonMetrics = comparison ? [
    {
      icon: <Thermometer className="w-5 h-5" />,
      label: 'Temperature',
      current: `${comparison.current.temperature.toFixed(1)}°C`,
      historical: `${comparison.historical.avgTemperature.toFixed(1)}°C`,
      deviation: comparison.deviations.temperature,
      unit: '°C',
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      label: 'Rainfall',
      current: `${comparison.current.rainfall.toFixed(1)}mm`,
      historical: `${comparison.historical.avgRainfall.toFixed(1)}mm`,
      deviation: comparison.deviations.rainfall,
      unit: 'mm',
      isInverse: true,
    },
    {
      icon: <Wind className="w-5 h-5" />,
      label: 'Wind Speed',
      current: `${comparison.current.windSpeed.toFixed(1)}m/s`,
      historical: `${comparison.historical.avgWindSpeed.toFixed(1)}m/s`,
      deviation: comparison.deviations.windSpeed,
      unit: 'm/s',
    },
    {
      icon: <Cloud className="w-5 h-5" />,
      label: 'Cloud Cover',
      current: `${comparison.current.cloudCover}%`,
      historical: `${comparison.historical.avgCloudCover.toFixed(0)}%`,
      deviation: comparison.deviations.cloudCover,
      unit: '%',
    },
  ] : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="dark:bg-dark-secondary">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-text-primary">
                Current vs Historical Average
              </h3>
              {comparison && (
                <p className="text-sm text-gray-500 dark:text-text-tertiary mt-1">
                  Updated {format(comparison.current.timestamp, 'MMM d, HH:mm')}
                </p>
              )}
            </div>
            {onRefresh && !loading && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 dark:bg-dark-tertiary rounded-lg p-4 animate-pulse">
                  <div className="h-8 bg-gray-200 dark:bg-dark-border rounded mb-3" />
                  <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : comparison ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {comparisonMetrics.map((metric, idx) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-50 dark:bg-dark-tertiary rounded-xl p-4 border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-3 text-gray-600 dark:text-text-secondary">
                    {metric.icon}
                    <span className="text-sm font-medium">{metric.label}</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-text-tertiary">Current</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-text-primary">
                        {metric.current}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-text-tertiary">Historical Avg</div>
                        <div className="text-sm text-gray-700 dark:text-text-secondary">
                          {metric.historical}
                        </div>
                      </div>

                      <div className={`flex items-center gap-1 font-semibold ${getDeviationColor(metric.deviation, metric.isInverse)}`}>
                        {getDeviationIcon(metric.deviation)}
                        <span className="text-sm">
                          {formatDeviation(metric.deviation, metric.unit)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : null}

          {comparison && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 p-3 bg-blue-50 dark:bg-nasa-blue/10 rounded-lg border border-blue-200 dark:border-nasa-blue/30"
            >
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Current conditions:</strong> {comparison.current.description}
              </p>
            </motion.div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
