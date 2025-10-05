import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ProbabilityResult } from '../../types';

interface ProbabilityChartProps {
  result: ProbabilityResult;
}

export function ProbabilityChart({ result }: ProbabilityChartProps) {
  const data = [
    { name: 'Meets Threshold', value: result.probability },
    { name: 'Does Not Meet', value: 100 - result.probability }
  ];

  const COLORS = ['#2563eb', '#e5e7eb'];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
