import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '../../types';

const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapSelectorProps {
  onLocationSelect: (location: Location) => void;
  selectedLocation?: Location;
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export function MapSelector({ onLocationSelect, selectedLocation }: MapSelectorProps) {
  const [position, setPosition] = useState<[number, number]>([20, 0]);

  useEffect(() => {
    if (selectedLocation) {
      setPosition([selectedLocation.latitude, selectedLocation.longitude]);
    }
  }, [selectedLocation]);

  const handleMapClick = (lat: number, lng: number) => {
    const location: Location = {
      name: `Location (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`,
      latitude: lat,
      longitude: lng
    };
    setPosition([lat, lng]);
    onLocationSelect(location);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Location on Map
      </label>
      <div className="rounded-lg overflow-hidden border border-gray-300 h-96">
        <MapContainer
          center={position}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleMapClick} />
          {selectedLocation && (
            <Marker
              position={[selectedLocation.latitude, selectedLocation.longitude]}
              icon={customIcon}
            />
          )}
        </MapContainer>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        Click anywhere on the map to select a location
      </p>
    </div>
  );
}
