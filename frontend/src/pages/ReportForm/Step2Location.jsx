import React, { useState, useEffect, useRef } from "react";
import { MapPin, Loader2, Map } from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Step2Location = ({ formData, onInputChange }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [addressName, setAddressName] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Reverse geocoding function to get address from coordinates
  const getAddressFromCoordinates = async (lat, lng) => {
    setLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.display_name) {
        setAddressName(data.display_name);
        onInputChange('locationAddress', data.display_name);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    } finally {
      setLoadingAddress(false);
    }
  };

  // Initialize map when showMap becomes true
  useEffect(() => {
    if (showMap && mapRef.current && !mapInstanceRef.current) {
      // Default to Naval, Biliran
      const defaultLat = formData.latitude || 11.5594;
      const defaultLng = formData.longitude || 124.3950;

      // Create map
      const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 13);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add marker
      const marker = L.marker([defaultLat, defaultLng], {
        draggable: true
      }).addTo(map);

      // Update coordinates when marker is dragged
      marker.on('dragend', (e) => {
        const position = e.target.getLatLng();
        // Round to 6 decimal places to fit database constraint (max_digits=9, decimal_places=6)
        const lat = parseFloat(position.lat.toFixed(6));
        const lng = parseFloat(position.lng.toFixed(6));
        onInputChange('latitude', lat);
        onInputChange('longitude', lng);
        onInputChange('location', `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        getAddressFromCoordinates(lat, lng);
      });

      // Update marker position when map is clicked
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        // Round to 6 decimal places to fit database constraint
        const roundedLat = parseFloat(lat.toFixed(6));
        const roundedLng = parseFloat(lng.toFixed(6));
        marker.setLatLng([roundedLat, roundedLng]);
        onInputChange('latitude', roundedLat);
        onInputChange('longitude', roundedLng);
        onInputChange('location', `${roundedLat.toFixed(6)}, ${roundedLng.toFixed(6)}`);
        getAddressFromCoordinates(roundedLat, roundedLng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [showMap]);

  // Update marker position when coordinates change externally
  useEffect(() => {
    if (markerRef.current && formData.latitude && formData.longitude) {
      markerRef.current.setLatLng([formData.latitude, formData.longitude]);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([formData.latitude, formData.longitude], 13);
      }
    }
  }, [formData.latitude, formData.longitude]);

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsCapturing(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Round to 6 decimal places to fit database constraint (max_digits=9, decimal_places=6)
        const lat = parseFloat(latitude.toFixed(6));
        const lng = parseFloat(longitude.toFixed(6));
        
        // Store latitude and longitude
        onInputChange('latitude', lat);
        onInputChange('longitude', lng);
        onInputChange('location', `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        
        // Fetch address name
        getAddressFromCoordinates(lat, lng);
        
        setIsCapturing(false);
      },
      (error) => {
        let errorMessage = "Failed to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
        }
        setLocationError(errorMessage);
        setIsCapturing(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm mb-1">
          Location <span className="text-red-500">*</span>
        </label>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={captureLocation}
            disabled={isCapturing}
            className="bg-[#3b3bff] text-white text-sm font-semibold py-2 rounded-md flex items-center justify-center gap-2 hover:bg-[#4d4dff] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCapturing ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                CAPTURING...
              </>
            ) : (
              <>
                <MapPin size={14} />
                AUTO DETECT
              </>
            )}
          </button>
          
          <button 
            type="button"
            onClick={() => setShowMap(!showMap)}
            className="bg-gray-700 text-white text-sm font-semibold py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-600 transition"
          >
            <Map size={14} />
            {showMap ? 'HIDE MAP' : 'PICK ON MAP'}
          </button>
        </div>
        
        {locationError && (
          <p className="mt-2 text-xs text-red-400">{locationError}</p>
        )}
        
        {formData.latitude && formData.longitude && (
          <div className="mt-2 space-y-1">
            <p className="text-xs text-green-400">
              ✓ Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
            </p>
            {loadingAddress && (
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Loader2 size={12} className="animate-spin" />
                Fetching address...
              </p>
            )}
            {addressName && !loadingAddress && (
              <p className="text-xs text-gray-300">
                📍 {addressName}
              </p>
            )}
          </div>
        )}
        
        {formData.errors?.location && (
          <p className="mt-2 text-xs text-red-400">{formData.errors.location}</p>
        )}
      </div>

      {/* Interactive Map */}
      {showMap && (
        <div className="border border-gray-600 rounded-md overflow-hidden">
          <div 
            ref={mapRef} 
            className="w-full h-80"
            style={{ zIndex: 1 }}
          />
          <div className="bg-gray-800 p-3 text-xs text-gray-400">
            <p>💡 <strong>Tip:</strong> Click anywhere on the map or drag the marker to set your location</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2Location;
