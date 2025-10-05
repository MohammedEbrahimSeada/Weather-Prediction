import { useState } from 'react';
import { WeatherAnalysis } from '../../types';
import { Card, CardHeader, CardBody } from '../common/Card';
import { TrendChart } from '../visualization/TrendChart';
import { DistributionChart } from '../visualization/DistributionChart';
import { ProbabilityChart } from '../visualization/ProbabilityChart';
import { WEATHER_VARIABLES } from '../../utils/constants';

interface VisualizationPanelProps {
  analysis: WeatherAnalysis;
}

export function VisualizationPanel({ analysis }: VisualizationPanelProps) {
  const [activeTab, setActiveTab] = useState<'trends' | 'distribution' | 'probability'>('trends');

  return (
    <Card variant="elevated" className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900">Data Visualizations</h2>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'trends'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Trends
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'distribution'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Distribution
          </button>
          <button
            onClick={() => setActiveTab('probability')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'probability'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Probability
          </button>
        </div>
      </CardHeader>
      <CardBody>
        {activeTab === 'trends' && (
          <div className="space-y-8">
            {analysis.probabilities.map((prob, index) => {
              const variable = WEATHER_VARIABLES.find(v => v.id === prob.variableId);
              if (!variable) return null;

              return (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {variable.name} Trend (Last 30 Days)
                  </h3>
                  <TrendChart
                    data={analysis.historicalData.data}
                    variableId={prob.variableId}
                    variableName={variable.name}
                    unit={variable.unit}
                  />
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'distribution' && (
          <div className="space-y-8">
            {analysis.probabilities.map((prob, index) => {
              const variable = WEATHER_VARIABLES.find(v => v.id === prob.variableId);
              if (!variable) return null;

              return (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {variable.name} Distribution
                  </h3>
                  <DistributionChart
                    data={analysis.historicalData.data}
                    variableId={prob.variableId}
                    variableName={variable.name}
                    unit={variable.unit}
                  />
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'probability' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.probabilities.map((prob, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  {prob.variableName}
                </h3>
                <ProbabilityChart result={prob} />
                <p className="text-sm text-gray-600 text-center mt-2">
                  {prob.interpretation}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
