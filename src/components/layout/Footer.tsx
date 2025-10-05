import { ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-dark-secondary border-t border-gray-200 dark:border-dark-border mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img
                src="/WhatsApp Image 2025-10-05 at 11.07.04_0e631f8c.jpg"
                alt="Rain-Sight Logo"
                className="w-8 h-8 object-contain"
              />
              <h3 className="font-semibold text-gray-900 dark:text-text-primary">Rain-Sight</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-text-secondary mb-2">
              From Space to Your Schedule
            </p>
            <p className="text-sm text-gray-600 dark:text-text-secondary">
              Analyze historical weather patterns using NASA Earth observation data to plan
              outdoor events with confidence.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-text-primary mb-3">Data Sources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://power.larc.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
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
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
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
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                >
                  NASA GES DISC
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-text-primary mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  How It Works
                </button>
              </li>
              <li>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  FAQ
                </button>
              </li>
              <li>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  Data Accuracy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-border text-center text-sm text-gray-600 dark:text-text-secondary">
          <p>© {currentYear} Rain-Sight. Data provided by NASA Earth Observation APIs.</p>
        </div>
      </div>
    </footer>
  );
}
