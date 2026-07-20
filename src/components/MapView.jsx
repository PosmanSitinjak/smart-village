import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from 'react-leaflet';
import { Navigation, Compass, MapPin } from 'lucide-react';
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

// Sub-component: stable map view updater — only moves when triggerCount increments
const ChangeMapView = ({ center, zoom = 16, triggerCount = 0 }) => {
  const map = useMap();
  const prevTriggerRef = useRef(0);

  useEffect(() => {
    if (!center || center[0] === undefined || center[1] === undefined) return;
    // Only fly when trigger explicitly incremented (user action or initial GPS lock)
    if (triggerCount > prevTriggerRef.current) {
      prevTriggerRef.current = triggerCount;
      map.setView(center, zoom, { animate: true, duration: 0.6 });
    }
  }, [triggerCount, center, zoom, map]);

  return null;
};

const MapView = ({ 
  reports = [], 
  center,
  zoom = 15,
  interactive = false, 
  onLocationSelect = null,
  selectedLocation = null,
  height = "350px"
}) => {
  const DEFAULT_CENTER = [-6.354400, 106.789200];
  const [activeCenter, setActiveCenter] = useState(center || DEFAULT_CENTER);
  const [userLocation, setUserLocation] = useState(null);
  const [userAccuracy, setUserAccuracy] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);
  const [locationMessage, setLocationMessage] = useState('');
  const hasGpsLockedRef = useRef(false);

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

  // Show a toast message that auto-clears
  const showToast = (msg, duration = 3000) => {
    setLocationMessage(msg);
    setTimeout(() => setLocationMessage(''), duration);
  };

  // Function to fetch high-accuracy GPS position with fallback
  const fetchCurrentLocation = (autoCenter = true) => {
    if (!navigator.geolocation) {
      showToast('⚠️ GPS tidak didukung pada browser ini', 4000);
      return;
    }

    setIsLocating(true);
    showToast('🛰️ Mengunci sinyal GPS satelit...', 20000);

    // First attempt: hardware GPS (high accuracy, fresh reading)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        applyPosition(position, autoCenter);
      },
      (highAccErr) => {
        console.warn("High-accuracy GPS failed:", highAccErr.message);
        showToast('⏳ GPS presisi gagal, mencoba mode jaringan...', 10000);
        // Fallback: network-based location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            applyPosition(position, autoCenter);
          },
          (lowAccErr) => {
            console.warn("All geolocation failed:", lowAccErr.message);
            setIsLocating(false);
            showToast('❌ Gagal mendapatkan lokasi. Aktifkan GPS HP atau klik langsung di peta.', 5000);
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 }
        );
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  // Apply obtained GPS position to state
  const applyPosition = (position, autoCenter) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy ? Math.round(position.coords.accuracy) : null;

    setUserLocation({ lat, lng });
    setUserAccuracy(accuracy);
    setIsLocating(false);
    hasGpsLockedRef.current = true;

    if (autoCenter) {
      setActiveCenter([lat, lng]);
      setRecenterTrigger(prev => prev + 1);
    }

    const accLabel = accuracy 
      ? (accuracy <= 20 ? '🎯 Sangat Presisi' : accuracy <= 100 ? '📍 Cukup Akurat' : '⚠️ Kurang Akurat')
      : '📍';
    const accText = accuracy ? ` (±${accuracy}m)` : '';
    showToast(`${accLabel} Lokasi ditemukan${accText}`, 4000);
  };

  // Automatically request GPS position once on component mount
  useEffect(() => {
    fetchCurrentLocation(true);
  }, []);

  // Sync activeCenter when center prop changes externally (e.g., alert dashboard button)
  useEffect(() => {
    if (center && center[0] !== undefined && center[1] !== undefined) {
      setActiveCenter(center);
      setRecenterTrigger(prev => prev + 1);
    }
  }, [center]);

  const handleMapClick = (latlng) => {
    if (interactive && onLocationSelect) {
      onLocationSelect(latlng.lat, latlng.lng);
      showToast(`📍 Titik dipilih: ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`);
    }
  };

  const handleRecenterClick = () => {
    fetchCurrentLocation(true);
  };

  return (
    <div className="map-view-wrapper" style={{ 
      height: height, 
      width: "100%", 
      borderRadius: "16px", 
      overflow: "hidden", 
      border: "1px solid rgba(0,0,0,0.08)",
      position: 'relative',
      isolation: 'isolate',
      WebkitMaskImage: '-webkit-radial-gradient(white, black)'
    }}>
      <MapContainer 
        center={activeCenter} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", borderRadius: "16px", overflow: "hidden", background: "#f1f5f9" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Stable map view updater */}
        <ChangeMapView center={activeCenter} zoom={16} triggerCount={recenterTrigger} />

        {/* User Location — accuracy circle + beacon dot */}
        {userLocation && (
          <>
            {/* Accuracy radius circle (shows how precise the GPS reading is) */}
            {userAccuracy && userAccuracy > 10 && (
              <Circle 
                center={[userLocation.lat, userLocation.lng]}
                radius={userAccuracy}
                pathOptions={{
                  color: '#3b82f6',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.08,
                  weight: 1.5,
                  dashArray: '5 5'
                }}
              />
            )}
            {/* Blue beacon dot */}
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>
                <div className="map-popup-content" style={{ textAlign: 'center', padding: '0.3rem' }}>
                  <strong style={{ color: '#2563eb', fontSize: '0.88rem' }}>📍 Posisi GPS Perangkat Anda</strong>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                    Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
                  </p>
                  {userAccuracy && (
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.72rem', color: userAccuracy <= 20 ? '#10b981' : userAccuracy <= 100 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>
                      Akurasi: ±{userAccuracy}m {userAccuracy <= 20 ? '(Sangat Presisi)' : userAccuracy <= 100 ? '(Cukup Akurat)' : '(Kurang Akurat — aktifkan GPS HP)'}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          </>
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
          top: '0.75rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          color: '#ffffff',
          padding: '0.5rem 1.15rem',
          borderRadius: '30px',
          fontSize: '0.76rem',
          fontWeight: 700,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          whiteSpace: 'nowrap',
          maxWidth: '90%'
        }}>
          {isLocating && <Compass size={14} className="animate-spin" style={{ color: '#38bdf8' }} />}
          <span>{locationMessage}</span>
        </div>
      )}

      {/* Floating GPS Recenter HUD Button */}
      <button
        type="button"
        className="btn-gps-recenter"
        onClick={handleRecenterClick}
        title="Cari Ulang Posisi GPS Saya"
      >
        <Navigation size={20} style={{ color: '#2563eb', fill: 'rgba(37, 99, 235, 0.25)' }} />
      </button>
    </div>
  );
};

export default MapView;
