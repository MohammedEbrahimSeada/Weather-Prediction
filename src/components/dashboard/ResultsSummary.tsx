import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { WeatherAnalysis } from '../../types';
import { Card, CardHeader, CardBody } from '../common/Card';

interface ResultsSummaryProps {
  analysis: WeatherAnalysis;
}

export function ResultsSummary({ analysis }: ResultsSummaryProps) {
  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-700 bg-red-50 border-red-200';
    if (score >= 50) return 'text-orange-700 bg-orange-50 border-orange-200';
    if (score >= 30) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-green-700 bg-green-50 border-green-200';
  };

  const getRiskIcon = (score: number) => {
    if (score >= 50) return <AlertCircle className="w-6 h-6" />;
    if (score >= 30) return <Info className="w-6 h-6" />;
    return <CheckCircle className="w-6 h-6" />;
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'High Risk';
    if (score >= 50) return 'Moderate-High Risk';
    if (score >= 30) return 'Moderate Risk';
    return 'Low Risk';
  };

  return (
    <Card variant="elevated" className="mb-6">
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900">Weather Analysis Summary</h2>
        <p className="text-gray-600 mt-1">
          {analysis.location.name} • {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(analysis.dateRange.startDate)} - {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(analysis.dateRange.endDate)}
        </p>
      </CardHeader>
      <CardBody>
        <div className={`flex items-start gap-4 p-4 rounded-lg border ${getRiskColor(analysis.riskScore)} mb-4`}>
          {getRiskIcon(analysis.riskScore)}
          <div className="flex-1">
            <div className="font-semibold text-lg mb-1">
              {getRiskLabel(analysis.riskScore)} (Score: {analysis.riskScore})
            </div>
            <p className="text-sm leading-relaxed">{analysis.summary}</p>
          </div>
        </div>

        <div className="space-y-3">
          {analysis.probabilities.map((prob, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{prob.variableName}</h3>
                <span className={`text-2xl font-bold ${prob.probability >= 50 ? 'text-red-600' : prob.probability >= 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {prob.probability}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{prob.interpretation}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Historical occurrences: {prob.historicalOccurrences} / {prob.totalDays} days</span>
                <span>•</span>
                <span>{prob.threshold.label}</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${prob.probability >= 50 ? 'bg-red-600' : prob.probability >= 30 ? 'bg-yellow-600' : 'bg-green-600'}`}
                  style={{ width: `${prob.probability}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
