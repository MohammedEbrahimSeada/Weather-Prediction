import { useState, useRef, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Location } from '../../types';
import { MOCK_LOCATIONS } from '../../utils/constants';

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
  selectedLocation?: Location;
}

export function LocationSearch({ onLocationSelect, selectedLocation }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length >= 2) {
      const filtered = MOCK_LOCATIONS.filter(loc =>
        loc.name.toLowerCase().includes(query.toLowerCase()) ||
        loc.country?.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSelectLocation = (location: Location) => {
    setQuery(location.name);
    setShowSuggestions(false);
    onLocationSelect(location);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Location
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder="Search for a city or location..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((location, index) => (
            <button
              key={index}
              onClick={() => handleSelectLocation(location)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-start gap-3 transition-colors"
            >
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">{location.name}</div>
                <div className="text-sm text-gray-500">
                  {location.country} • {location.region}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedLocation && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-900">{selectedLocation.name}</div>
              <div className="text-sm text-blue-700">
                {selectedLocation.latitude.toFixed(4)}°, {selectedLocation.longitude.toFixed(4)}°
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
