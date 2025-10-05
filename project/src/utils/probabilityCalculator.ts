import {
  WeatherDataPoint,
  WeatherThreshold,
  ProbabilityResult,
  HistoricalWeatherData,
  WeatherAnalysis,
  Location,
  DateRange
} from '../types';
import { WEATHER_VARIABLES } from './constants';

export function calculateWeatherProbabilities(
  historicalData: HistoricalWeatherData,
  thresholds: WeatherThreshold[]
): ProbabilityResult[] {
  const results: ProbabilityResult[] = [];

  for (const threshold of thresholds) {
    const result = calculateSingleProbability(
      historicalData.data,
      threshold
    );
    results.push(result);
  }

  return results;
}

function calculateSingleProbability(
  data: WeatherDataPoint[],
  threshold: WeatherThreshold
): ProbabilityResult {
  const variable = WEATHER_VARIABLES.find(v => v.id === threshold.variableId);
  const variableName = variable?.name || threshold.variableId;

  let matchingDays = 0;
  const totalDays = data.length;

  for (const dataPoint of data) {
    if (meetsThreshold(dataPoint, threshold)) {
      matchingDays++;
    }
  }

  const probability = totalDays > 0 ? (matchingDays / totalDays) * 100 : 0;

  const interpretation = generateInterpretation(
    probability,
    variableName,
    threshold
  );

  return {
    variableId: threshold.variableId,
    variableName,
    probability: Number(probability.toFixed(1)),
    threshold,
    historicalOccurrences: matchingDays,
    totalDays,
    interpretation
  };
}

function meetsThreshold(
  dataPoint: WeatherDataPoint,
  threshold: WeatherThreshold
): boolean {
  const value = getVariableValue(dataPoint, threshold.variableId);

  switch (threshold.operator) {
    case 'gt':
      return value > threshold.value;
    case 'lt':
      return value < threshold.value;
    case 'gte':
      return value >= threshold.value;
    case 'lte':
      return value <= threshold.value;
    case 'between':
      return threshold.value2 !== undefined
        ? value >= threshold.value && value <= threshold.value2
        : false;
    default:
      return false;
  }
}

function getVariableValue(
  dataPoint: WeatherDataPoint,
  variableId: string
): number {
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
}

function generateInterpretation(
  probability: number,
  variableName: string,
  threshold: WeatherThreshold
): string {
  const level =
    probability >= 70 ? 'Very likely' :
    probability >= 50 ? 'Likely' :
    probability >= 30 ? 'Possible' :
    probability >= 15 ? 'Unlikely' :
    'Very unlikely';

  const condition = threshold.label || formatThresholdCondition(threshold);

  return `${level} to experience ${condition.toLowerCase()}`;
}

function formatThresholdCondition(threshold: WeatherThreshold): string {
  const variable = WEATHER_VARIABLES.find(v => v.id === threshold.variableId);
  const unit = variable?.unit || '';

  switch (threshold.operator) {
    case 'gt':
      return `${variable?.name} > ${threshold.value}${unit}`;
    case 'lt':
      return `${variable?.name} < ${threshold.value}${unit}`;
    case 'gte':
      return `${variable?.name} ≥ ${threshold.value}${unit}`;
    case 'lte':
      return `${variable?.name} ≤ ${threshold.value}${unit}`;
    case 'between':
      return `${variable?.name} between ${threshold.value}-${threshold.value2}${unit}`;
    default:
      return `${variable?.name} condition`;
  }
}

export function calculateRiskScore(probabilities: ProbabilityResult[]): number {
  if (probabilities.length === 0) return 0;

  const weights: Record<string, number> = {
    temperature: 0.25,
    rainfall: 0.25,
    windspeed: 0.20,
    snowfall: 0.15,
    dustConcentration: 0.10,
    cloudCover: 0.05
  };

  let weightedSum = 0;
  let totalWeight = 0;

  for (const result of probabilities) {
    const weight = weights[result.variableId] || 0.1;
    weightedSum += result.probability * weight;
    totalWeight += weight;
  }

  const riskScore = totalWeight > 0 ? weightedSum / totalWeight : 0;

  return Number(riskScore.toFixed(1));
}

export function generateSummary(
  location: Location,
  dateRange: DateRange,
  probabilities: ProbabilityResult[],
  riskScore: number
): string {
  const highRiskConditions = probabilities.filter(p => p.probability >= 50);

  if (highRiskConditions.length === 0) {
    return `Favorable conditions expected for ${location.name} during the selected period. Historical data suggests low probability of adverse weather.`;
  }

  const conditionsList = highRiskConditions
    .map(p => `${p.variableName.toLowerCase()} (${p.probability}% chance)`)
    .join(', ');

  const riskLevel =
    riskScore >= 70 ? 'High risk' :
    riskScore >= 50 ? 'Moderate-high risk' :
    riskScore >= 30 ? 'Moderate risk' :
    'Low-moderate risk';

  return `${riskLevel} for ${location.name}. Historical data indicates likely occurrence of: ${conditionsList}.`;
}

export function calculateStatistics(data: WeatherDataPoint[], variableId: string) {
  const values = data.map(d => getVariableValue(d, variableId));

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

  const sortedValues = [...values].sort((a, b) => a - b);
  const median = sortedValues[Math.floor(sortedValues.length / 2)];

  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  const min = Math.min(...values);
  const max = Math.max(...values);

  const p25 = sortedValues[Math.floor(sortedValues.length * 0.25)];
  const p75 = sortedValues[Math.floor(sortedValues.length * 0.75)];
  const p90 = sortedValues[Math.floor(sortedValues.length * 0.90)];
  const p95 = sortedValues[Math.floor(sortedValues.length * 0.95)];

  return {
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(2)),
    stdDev: Number(stdDev.toFixed(2)),
    min: Number(min.toFixed(2)),
    max: Number(max.toFixed(2)),
    p25: Number(p25.toFixed(2)),
    p75: Number(p75.toFixed(2)),
    p90: Number(p90.toFixed(2)),
    p95: Number(p95.toFixed(2))
  };
}

export function createWeatherAnalysis(
  location: Location,
  dateRange: DateRange,
  historicalData: HistoricalWeatherData,
  thresholds: WeatherThreshold[]
): WeatherAnalysis {
  const probabilities = calculateWeatherProbabilities(historicalData, thresholds);
  const riskScore = calculateRiskScore(probabilities);
  const summary = generateSummary(location, dateRange, probabilities, riskScore);

  return {
    location,
    dateRange,
    probabilities,
    summary,
    riskScore,
    historicalData,
    generatedAt: new Date()
  };
}
