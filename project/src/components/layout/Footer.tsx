import { ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">About WeatherProb</h3>
            <p className="text-sm text-gray-600">
              Analyze historical weather patterns using NASA Earth observation data to plan
              outdoor events with confidence.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Data Sources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://power.larc.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  NASA POWER API
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.earthdata.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  NASA Earthdata
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://disc.gsfc.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  NASA GES DISC
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="text-blue-600 hover:text-blue-700">
                  How It Works
                </button>
              </li>
              <li>
                <button className="text-blue-600 hover:text-blue-700">
                  FAQ
                </button>
              </li>
              <li>
                <button className="text-blue-600 hover:text-blue-700">
                  Data Accuracy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>© {currentYear} WeatherProb. Data provided by NASA Earth Observation APIs.</p>
        </div>
      </div>
    </footer>
  );
}
