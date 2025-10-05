import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WeatherDataPoint } from '../../types';
import { format } from 'date-fns';

interface TrendChartProps {
  data: WeatherDataPoint[];
  variableId: string;
  variableName: string;
  unit: string;
}

export function TrendChart({ data, variableId, variableName, unit }: TrendChartProps) {
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

  const chartData = data.map(point => ({
    date: format(point.date, 'MMM dd, yyyy'),
    value: getVariableValue(point)
  }));

  const recentData = chartData.slice(-30);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={recentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            label={{ value: `${variableName} (${unit})`, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)} ${unit}`, variableName]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            name={variableName}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
