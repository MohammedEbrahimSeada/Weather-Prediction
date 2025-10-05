import { Satellite, TrendingUp, Database, Shield, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { NASA_DATA_SOURCES } from '../../utils/constants';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About WeatherProb</h1>
        <p className="text-xl text-gray-600">
          Make informed decisions about outdoor events using NASA Earth observation data
        </p>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Satellite className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">What is WeatherProb?</h2>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-gray-700 leading-relaxed mb-4">
            WeatherProb is a comprehensive weather analysis tool that helps you understand the
            historical probability of specific weather conditions for any location and time of year.
            Whether you're planning a hiking trip, beach vacation, outdoor festival, or fishing expedition,
            our application provides data-driven insights to help you make informed decisions.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By analyzing decades of historical weather patterns from NASA Earth observation satellites,
            we calculate the likelihood of experiencing conditions like extreme heat, heavy rainfall,
            strong winds, or poor visibility at your chosen location and date.
          </p>
        </CardBody>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Select Your Location</h3>
                <p className="text-gray-600">
                  Choose a location by searching for a city or clicking directly on the interactive map.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Choose Your Date Range</h3>
                <p className="text-gray-600">
                  Select the time period you're interested in, or use preset options like "Summer" or "Winter."
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Configure Weather Variables</h3>
                <p className="text-gray-600">
                  Select which weather conditions matter to you and set custom thresholds, or use
                  activity presets for common use cases.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Analyze Results</h3>
                <p className="text-gray-600">
                  Review probability calculations, visualizations, and historical trends to understand
                  the likelihood of your desired conditions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Export Your Data</h3>
                <p className="text-gray-600">
                  Download complete datasets in CSV or JSON format with full metadata and source information.
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Data Sources</h2>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-gray-700 leading-relaxed mb-6">
            Our analysis is powered by NASA's Earth observation datasets, providing reliable historical
            weather data from satellites and ground stations worldwide.
          </p>

          <div className="space-y-4">
            {Object.values(NASA_DATA_SOURCES).map((source, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{source.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{source.description}</p>
                <div className="flex gap-4 text-sm">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Visit API
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={source.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Documentation
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-900">
              <strong>Development Note:</strong> This application currently uses mock data to simulate
              NASA API responses. When connecting to the real NASA APIs, replace the mock data generator
              functions in <code className="bg-yellow-100 px-1 rounded">src/data/mockDataGenerator.ts</code> with
              actual API calls using the endpoints documented above.
            </p>
          </div>
        </CardBody>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Data Accuracy & Limitations</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Historical Analysis:</strong> Our probabilities are based on historical data patterns.
              While past patterns are excellent indicators, they cannot predict with certainty what will
              happen in the future, especially given climate change trends.
            </p>
            <p>
              <strong>Data Coverage:</strong> NASA satellite data coverage varies by location and time period.
              Some remote locations may have less complete historical records than major populated areas.
            </p>
            <p>
              <strong>Threshold Sensitivity:</strong> Small changes in threshold values can significantly
              affect probability calculations. We recommend testing multiple threshold configurations.
            </p>
            <p>
              <strong>Use as Planning Tool:</strong> This application is designed for planning and
              risk assessment. Always check current weather forecasts closer to your event date.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
