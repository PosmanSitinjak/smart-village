import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { Navigation, Compass } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default marker icon issue in React/Vite builds
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Helper for custom colored CSS markers
const createCustomMarker = (status, severity, category) => {
  let colorClass = 'marker-pending';
  if (category === 'Darurat SOS') {
    colorClass = 'marker-sos';
  } else if (status === 'Selesai') {
    colorClass = 'marker-resolved';
  } else if (status === 'Diproses') {
    colorClass = 'marker-inprogress';
  } else if (severity === 'Tinggi') {
    colorClass = 'marker-urgent';
  }

  return L.divIcon({
    className: `custom-map-marker ${colorClass}`,
    html: `
      <div class="marker-pin-wrapper">
        <div class="marker-pin"></div>
        <div class="marker-pulse"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

// Sub-component to handle map click events
const MapEventsHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

// Sub-component to dynamically pan/center map ONLY when center coordinates or trigger count actually changes
const ChangeMapView = ({ center, zoom = 16, triggerCount = 0 }) => {
  const map = useMap();
  const lastCenterRef = useRef(null);

  const targetLat = center?.[0];
  const targetLng = center?.[1];

  useEffect(() => {
    if (targetLat === undefined || targetLng === undefined) return;

    const last = lastCenterRef.current;
    const isNewPos = !last || Math.abs(last[0] - targetLat) > 0.00005 || Math.abs(last[1] - targetLng) > 0.00005;

    if (isNewPos || triggerCount > 0) {
      lastCenterRef.current = [targetLat, targetLng];
      map.setView([targetLat, targetLng], zoom, { animate: true, duration: 0.8 });
    }
  }, [targetLat, targetLng, zoom, triggerCount, map]);

  return null;
};

const MapView = ({ 
  reports = [], 
  center = [-6.354400, 106.789200], 
  zoom = 15,
  interactive = false, 
  onLocationSelect = null,
  selectedLocation = null,
  height = "350px"
}) => {
  const [activeCenter, setActiveCenter] = useState(center);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);
  const [locationMessage, setLocationMessage] = useState('');

  // Custom marker for interactive coordinate picking
  const pinIcon = L.divIcon({
    className: 'custom-map-marker marker-selected',
    html: `
      <div class="marker-pin-wrapper">
        <div class="marker-pin pin-blue"></div>
        <div class="marker-pulse pulse-blue"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });

  // Custom marker for User's live Location (Blue Pulsing Beacon)
  const userIcon = L.divIcon({
    className: 'custom-map-marker marker-user-live',
    html: `
      <div class="user-beacon-container">
        <div class="user-beacon-dot"></div>
        <div class="user-beacon-ring"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  // Function to fetch current GPS position once on demand or mount
  const fetchCurrentLocation = (autoCenter = true) => {
    if (!navigator.geolocation) {
      setLocationMessage('GPS tidak didukung pada browser ini');
      return;
    }

    setIsLocating(true);
    setLocationMessage('Mencari posisi GPS Anda...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const newPos = { lat, lng };

        setUserLocation(newPos);
        setIsLocating(false);

        if (autoCenter) {
          setActiveCenter([lat, lng]);
          setRecenterTrigger(prev => prev + 1);
        }

        setLocationMessage('📍 Lokasi Anda Ditemukan');
        setTimeout(() => setLocationMessage(''), 2500);
      },
      (error) => {
        console.warn("Geolocation error:", error);
        setIsLocating(false);
        setLocationMessage('Gagal mengambil GPS. Pastikan izin lokasi diizinkan.');
        setTimeout(() => setLocationMessage(''), 3500);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
    );
  };

  // Automatically request GPS position once on component mount
  useEffect(() => {
    fetchCurrentLocation(true);
  }, []);

  // Sync activeCenter when center prop changes externally
  useEffect(() => {
    if (center && center[0] !== undefined && center[1] !== undefined) {
      setActiveCenter(center);
      setRecenterTrigger(prev => prev + 1);
    }
  }, [center]);

  const handleMapClick = (latlng) => {
    if (interactive && onLocationSelect) {
      onLocationSelect(latlng.lat, latlng.lng);
    }
  };

  const handleRecenterClick = () => {
    if (userLocation) {
      setActiveCenter([userLocation.lat, userLocation.lng]);
      setRecenterTrigger(prev => prev + 1);
    }
    fetchCurrentLocation(true);
  };

  return (
    <div className="map-view-wrapper" style={{ 
      height: height, 
      width: "100%", 
      borderRadius: "16px", 
      overflow: "hidden", 
      border: "1px solid rgba(0,0,0,0.08)",
      position: 'relative'
    }}>
      <MapContainer 
        center={activeCenter} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dynamic center updater (stable, no shaking) */}
        <ChangeMapView center={activeCenter} zoom={16} triggerCount={recenterTrigger} />

        {/* User Location Marker (You are here!) */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="map-popup-content" style={{ textAlign: 'center', padding: '0.2rem' }}>
                <strong style={{ color: '#2563eb' }}>📍 Posisi Anda Sekarang</strong>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Lat: {userLocation.lat.toFixed(5)}, Lng: {userLocation.lng.toFixed(5)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Interactive Mode - Click Listener and Selected Pin */}
        {interactive && (
          <>
            <MapEventsHandler onMapClick={handleMapClick} />
            {selectedLocation && (
              <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={pinIcon}>
                <Popup>
                  <div className="map-popup-content">
                    <strong>Lokasi Laporan Terpilih</strong>
                    <p>Lat: {selectedLocation.lat.toFixed(6)}<br/>Lng: {selectedLocation.lng.toFixed(6)}</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </>
        )}

        {/* Display Mode - Show existing reports */}
        {!interactive && reports.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.latitude, report.longitude]} 
            icon={createCustomMarker(report.status, report.severity, report.category)}
          >
            <Popup>
              <div className="map-popup-content">
                <span className={`popup-badge badge-${report.category.toLowerCase().replace(' ', '-')}`} style={{
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  fontSize: '0.65rem'
                }}>
                  {report.category}
                </span>
                <h4 className="popup-title" style={{ margin: '0.45rem 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800 }}>{report.title}</h4>
                <p className="popup-desc" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{report.description.substring(0, 80)}...</p>
                <div className="popup-footer" style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`popup-status status-${report.status.toLowerCase()}`} style={{
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    {report.status}
                  </span>
                  <span className="popup-severity text-gray-400" style={{ fontSize: '0.7rem' }}>
                    Urgensi: <strong style={{ color: report.severity === 'Tinggi' ? 'var(--red)' : 'var(--text-primary)' }}>{report.severity}</strong>
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* GPS Status Toast Badge */}
      {locationMessage && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          backgroundColor: 'rgba(15, 23, 42, 0.88)',
          color: '#ffffff',
          padding: '0.45rem 1rem',
          borderRadius: '30px',
          fontSize: '0.75rem',
          fontWeight: 700,
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          whiteSpace: 'nowrap'
        }}>
          <Compass size={14} className={isLocating ? 'animate-spin' : ''} style={{ color: '#38bdf8' }} />
          <span>{locationMessage}</span>
        </div>
      )}

      {/* Floating GPS Recenter HUD Button */}
      <button
        type="button"
        className="btn-gps-recenter"
        onClick={handleRecenterClick}
        title="Posisikan ke Lokasi Saya Sekarang"
      >
        <Navigation size={20} style={{ color: '#2563eb', fill: 'rgba(37, 99, 235, 0.25)' }} />
      </button>
    </div>
  );
};

export default MapView;
