import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WeatherDataPoint } from '../../types';

interface DistributionChartProps {
  data: WeatherDataPoint[];
  variableId: string;
  variableName: string;
  unit: string;
}

export function DistributionChart({ data, variableId, variableName, unit }: DistributionChartProps) {
  const getVariableValue = (dataPoint: WeatherDataPoint): number => {
    switch (variableId) {
      case 'temperature':
        return dataPoint.temperature;
      case 'rainfall':
        return dataPoint.rainfall;
      case 'windspeed':
        return dataPoint.windspeed;
      case 'snowfall':
        return dataPoint.snowfall;
      case 'dustConcentration':
        return dataPoint.dustConcentration;
      case 'cloudCover':
        return dataPoint.cloudCover;
      default:
        return 0;
    }
  };

  const values = data.map(d => getVariableValue(d));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const binCount = 15;
  const binSize = range / binCount;

  const bins = Array.from({ length: binCount }, (_, i) => ({
    range: `${(min + i * binSize).toFixed(1)}-${(min + (i + 1) * binSize).toFixed(1)}`,
    count: 0,
    midpoint: min + i * binSize + binSize / 2
  }));

  values.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binSize), binCount - 1);
    if (binIndex >= 0 && binIndex < binCount) {
      bins[binIndex].count++;
    }
  });

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={bins}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="range"
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={80}
            label={{ value: `${variableName} (${unit})`, position: 'insideBottom', offset: -10 }}
          />
          <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            formatter={(value: number) => [`${value} days`, 'Frequency']}
          />
          <Bar dataKey="count" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
