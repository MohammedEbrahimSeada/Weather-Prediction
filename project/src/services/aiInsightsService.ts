import { GoogleGenerativeAI } from '@google/generative-ai';
import { WeatherAnalysis, ProbabilityResult } from '../types';

export interface AIInsight {
  summary: string;
  recommendations: string[];
  risks: string[];
  bestDays: string;
}

const genAI = import.meta.env.VITE_GEMINI_API_KEY
  ? new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
  : null;

function generateMockInsight(analysis: WeatherAnalysis, activityType?: string): AIInsight {
  const highProbVariables = analysis.probabilities.filter(p => p.probability > 70);
  const lowProbVariables = analysis.probabilities.filter(p => p.probability < 30);

  const summary = `Based on ${analysis.historicalData.data.length} days of historical data for ${analysis.location.name}, ` +
    `your selected weather conditions have a ${Math.round(analysis.riskScore)}% overall probability of occurring. ` +
    (highProbVariables.length > 0
      ? `${highProbVariables.map(v => v.variableName).join(' and ')} show high likelihood. `
      : '') +
    `This ${analysis.riskScore > 70 ? 'favorable' : analysis.riskScore > 40 ? 'moderate' : 'challenging'} outlook suggests ` +
    `${activityType || 'your activity'} planning should proceed with ${analysis.riskScore > 70 ? 'confidence' : 'caution'}.`;

  const recommendations: string[] = [];
  if (analysis.riskScore > 70) {
    recommendations.push('Conditions look favorable for outdoor activities');
    recommendations.push('Consider booking accommodations early as weather is expected to be pleasant');
  } else if (analysis.riskScore > 40) {
    recommendations.push('Have backup plans ready for variable weather');
    recommendations.push('Monitor weather updates closer to your dates');
  } else {
    recommendations.push('Consider alternative dates with better weather probability');
    recommendations.push('Prepare for challenging weather conditions');
  }

  if (activityType) {
    switch (activityType.toLowerCase()) {
      case 'beach':
        recommendations.push('Pack sunscreen and light clothing for warm weather');
        break;
      case 'hiking':
        recommendations.push('Bring layers and rain gear for mountain weather variability');
        break;
      case 'skiing':
        recommendations.push('Check snow conditions and avalanche reports before departure');
        break;
    }
  }

  const risks: string[] = [];
  if (lowProbVariables.length > 0) {
    risks.push(`${lowProbVariables.map(v => v.variableName).join(' and ')} may not meet your expectations`);
  }
  if (analysis.riskScore < 40) {
    risks.push('Historical patterns suggest unfavorable conditions');
  }

  const bestDays = 'Mid-week periods historically show slightly better conditions than weekends';

  return { summary, recommendations, risks, bestDays };
}

export async function generateWeatherInsights(
  analysis: WeatherAnalysis,
  activityType?: string
): Promise<AIInsight> {
  if (!genAI) {
    return generateMockInsight(analysis, activityType);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a weather analysis expert. Analyze this historical weather data and provide insights for planning ${activityType || 'outdoor activities'}.

Location: ${analysis.location.name}
Date Range: ${analysis.dateRange.startDate.toLocaleDateString()} to ${analysis.dateRange.endDate.toLocaleDateString()}
Overall Risk Score: ${analysis.riskScore.toFixed(1)}%

Weather Probability Results:
${analysis.probabilities.map(p =>
  `- ${p.variableName}: ${p.probability.toFixed(1)}% probability (${p.historicalOccurrences} out of ${p.totalDays} days)`
).join('\n')}

Provide a response in JSON format with these fields:
{
  "summary": "A 2-3 sentence friendly summary of what the data means for planning",
  "recommendations": ["3-4 specific actionable recommendations"],
  "risks": ["2-3 potential weather risks to be aware of"],
  "bestDays": "Brief note on which days or periods tend to have better conditions"
}

Keep language natural, helpful, and encouraging while being honest about conditions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const insight = JSON.parse(jsonMatch[0]);
      return insight as AIInsight;
    }

    return generateMockInsight(analysis, activityType);
  } catch (error) {
    console.error('AI insights generation failed:', error);
    return generateMockInsight(analysis, activityType);
  }
}

export async function parseNaturalLanguageQuery(query: string): Promise<{
  location?: string;
  dateRange?: { month?: string; season?: string };
  activity?: string;
  intent: string;
}> {
  if (!genAI) {
    const mockResult = {
      intent: 'weather_analysis',
      location: query.match(/in\s+(\w+)/i)?.[1],
      dateRange: { month: query.match(/(january|february|march|april|may|june|july|august|september|october|november|december)/i)?.[1] },
      activity: query.match(/(camping|hiking|beach|skiing|fishing)/i)?.[1],
    };
    return mockResult;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Parse this natural language weather query and extract structured information:
"${query}"

Return JSON with these fields:
{
  "intent": "weather_analysis",
  "location": "city or region name if mentioned",
  "dateRange": {"month": "month name", "season": "winter/spring/summer/fall"},
  "activity": "activity type if mentioned (hiking, camping, beach, etc)"
}

Only include fields that are clearly mentioned. Return valid JSON only.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { intent: 'weather_analysis' };
  } catch (error) {
    console.error('Query parsing failed:', error);
    return { intent: 'weather_analysis' };
  }
}
