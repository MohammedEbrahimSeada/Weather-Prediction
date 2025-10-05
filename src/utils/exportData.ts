import { WeatherAnalysis, ExportData } from '../types';
import { format } from 'date-fns';

export function exportToCSV(analysis: WeatherAnalysis): string {
  const headers = [
    'Date',
    'Temperature (°C)',
    'Temperature Min (°C)',
    'Temperature Max (°C)',
    'Rainfall (mm)',
    'Wind Speed (m/s)',
    'Snowfall (cm)',
    'Dust Concentration (μg/m³)',
    'Cloud Cover (%)'
  ];

  const rows = analysis.historicalData.data.map(point => [
    format(point.date, 'yyyy-MM-dd'),
    point.temperature,
    point.temperatureMin,
    point.temperatureMax,
    point.rainfall,
    point.windspeed,
    point.snowfall,
    point.dustConcentration,
    point.cloudCover
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
}

export function exportToJSON(analysis: WeatherAnalysis): string {
  const exportData: ExportData = {
    query: {
      location: analysis.location,
      dateRange: analysis.dateRange,
      selectedVariables: analysis.probabilities.map(p => p.variableId),
      thresholds: analysis.probabilities.map(p => p.threshold)
    },
    analysis: {
      ...analysis,
      historicalData: {
        ...analysis.historicalData,
        data: analysis.historicalData.data.map(d => ({
          ...d,
          date: d.date.toISOString()
        })) as any
      }
    },
    metadata: {
      exportDate: new Date(),
      dataSource: 'Mock NASA POWER API (Replace with real API)',
      apiVersion: '1.0.0',
      notes: 'This data is generated using mock historical patterns. Replace with real NASA API calls for production use.'
    }
  };

  return JSON.stringify(exportData, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportAnalysisAsCSV(analysis: WeatherAnalysis): void {
  const csv = exportToCSV(analysis);
  const filename = `weather-analysis-${analysis.location.name.replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  downloadFile(csv, filename, 'text/csv');
}

export function exportAnalysisAsJSON(analysis: WeatherAnalysis): void {
  const json = exportToJSON(analysis);
  const filename = `weather-analysis-${analysis.location.name.replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.json`;
  downloadFile(json, filename, 'application/json');
}
