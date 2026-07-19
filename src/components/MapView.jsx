import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { Navigation } from 'lucide-react';
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

// Sub-component to dynamically fly/pan the map view on center changes
const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] !== undefined && center[1] !== undefined) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
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

  // Custom marker for User's live Location (Google Maps style)
  const userIcon = L.divIcon({
    className: 'custom-map-marker marker-user',
    html: `
      <div class="marker-pin-wrapper">
        <div class="marker-pin"></div>
        <div class="marker-pulse"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });

  // Automatically attempt to fetch user geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          
          // Only auto-center on mount if it's display mode (non-interactive)
          if (!interactive) {
            setActiveCenter([lat, lng]);
          }
        },
        (error) => {
          console.warn("User geolocation retrieval failed on map load", error);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [interactive]);

  // Sync activeCenter when center prop changes externally (e.g. from alert dashboard bar)
  useEffect(() => {
    if (center && center[0] !== undefined && center[1] !== undefined) {
      setActiveCenter(center);
    }
  }, [center]);

  const handleMapClick = (latlng) => {
    if (interactive && onLocationSelect) {
      onLocationSelect(latlng.lat, latlng.lng);
    }
  };

  return (
    <div className="map-view-wrapper" style={{ 
      height: height, 
      width: "100%", 
      borderRadius: "12px", 
      overflow: "hidden", 
      border: "1px solid rgba(0,0,0,0.06)",
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

        {/* Dynamic center updater */}
        <ChangeMapView center={activeCenter} />

        {/* User Location Marker (You are here!) */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="map-popup-content" style={{ textAlign: 'center', padding: '0.2rem' }}>
                <strong>📍 Lokasi Anda</strong>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Perangkat Anda berada di daerah ini.
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

      {/* Floating GPS Recenter HUD Button */}
      {userLocation && (
        <button
          type="button"
          className="btn-gps-recenter"
          onClick={() => setActiveCenter([userLocation.lat, userLocation.lng])}
          style={{
            position: 'absolute',
            bottom: '1.25rem',
            right: '1.25rem',
            zIndex: 1000,
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(15, 23, 42, 0.15)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 23, 42, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(15, 23, 42, 0.15)';
          }}
          title="Temukan Lokasi Saya"
        >
          <Navigation size={18} style={{ color: '#3b82f6', fill: 'rgba(59, 130, 246, 0.2)' }} />
        </button>
      )}
    </div>
  );
};

export default MapView;
