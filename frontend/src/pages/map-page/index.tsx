import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'app/store/mainStore';
import { setCity, setCoords } from 'entities/location/model/slice';
import { locationApi } from 'entities/location/model/api';
import { fetchAttractionsRequest } from 'entities/attraction/model/slice';

// Simple modal component
const ConfirmModal: React.FC<{
  coords: [number, number];
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ coords, onConfirm, onCancel }) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: '#fff',
        padding: 24,
        borderRadius: 8,
        minWidth: 300,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      <h3>Подтвердите точку</h3>
      <p>
        Координаты:{' '}
        <b>
          {coords[0].toFixed(5)}, {coords[1].toFixed(5)}
        </b>
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <button onClick={onConfirm}>Подтвердить</button>
        <button onClick={onCancel}>Отмена</button>
      </div>
    </div>
  </div>
);

// Custom marker icon (fixes default icon issue)
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const LocationSelector: React.FC<{
  onSelect: (coords: [number, number]) => void;
}> = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const categories = [
  { tag: 'museum', label: 'Лучшие музеи' },
  { tag: 'cafe', label: 'Лучшие кафе' },
  { tag: 'restaurant', label: 'Лучшие рестораны' },
  { tag: 'theatre', label: 'Лучшие театры' },
];

const MapPage: React.FC = () => {
  const dispatch = useDispatch();
  const savedLocation = useSelector((state: RootState) => state.location);

  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleMapClick = (coords: [number, number]) => {
    setSelectedCoords(coords);
    setModalOpen(true);
  };

  async function getCity(lat: number, lon: number) {
    try {
      const data = await locationApi.getByCity(lat, lon);

      if (!data) {
        console.error(`City not found by your coords: lat=${lat}, lon=${lon}}`);
        dispatch(setCity(''));
        return;
      }
      dispatch(setCity(data.city));
    } catch (error) {
      console.error(`City not found by your coords: lat=${lat}, lon=${lon}}`, error);
    }
  }

  const handleConfirm = () => {
    if (selectedCoords) {
      dispatch(
        setCoords({
          latitude: selectedCoords[0],
          longitude: selectedCoords[1],
        })
      );

      categories.forEach(({ tag }) => {
        dispatch(
          fetchAttractionsRequest({
            tag,
            nearby: { lat: selectedCoords[0], lon: selectedCoords[1] },
          })
        );
      });
      getCity(selectedCoords[0], selectedCoords[1]);
      setModalOpen(false);
    }
  };

  const handleCancel = () => {
    setSelectedCoords(null);
    setModalOpen(false);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <MapContainer
        center={
          savedLocation.coords?.latitude !== undefined &&
          savedLocation.coords?.longitude !== undefined
            ? [savedLocation.coords.latitude, savedLocation.coords.longitude]
            : [55.751244, 37.618423]
        } // Moscow default
        zoom={13}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationSelector onSelect={handleMapClick} />
        {selectedCoords && <Marker position={selectedCoords} icon={markerIcon} />}
        {savedLocation?.coords?.latitude !== undefined &&
          savedLocation?.coords?.longitude !== undefined && (
            <Marker
              position={[savedLocation.coords.latitude, savedLocation.coords.longitude]}
              icon={markerIcon}
            />
          )}
      </MapContainer>
      {modalOpen && selectedCoords && (
        <ConfirmModal coords={selectedCoords} onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default MapPage;
