import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'app/store/mainStore';
import { setCity, setCoords } from 'entities/location/model/slice';
import { locationApi } from 'entities/location/model/api';
import { fetchAttractionsRequest } from 'entities/attraction/model/slice';
import ConfirmModal from 'widgets/ConfirmModal';
import type { Attraction } from 'entities/attraction/model/types';
import { useNavigate } from 'react-router';
import Header from 'widgets/Header';

// Custom marker icon (fixes default icon issue)
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const nearbyIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // пример: другая иконка
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
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
  const navigate = useNavigate();

  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);

  const handleMapClick = (coords: [number, number]) => {
    setSelectedCoords(coords);
    setModalOpen(true);
  };

  const { attractions: attractionsNearby } = useSelector(
    (state: RootState) => state.attraction.nearby
  );

  const handleRedirect = (href: string) => {
    navigate(href);
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

      dispatch(
        fetchAttractionsRequest({
          tags: categories.map((category) => category.tag),
          lat: selectedCoords[0],
          lon: selectedCoords[1],
          radius: 0.01,
        })
      );
      getCity(selectedCoords[0], selectedCoords[1]);

      setModalOpen(false);
    }
  };

  const handleCancel = () => {
    setSelectedCoords(null);
    setModalOpen(false);
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
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
        {attractionsNearby &&
          attractionsNearby.map((attraction) => (
            <Marker
              key={attraction.id}
              position={[attraction.latitude, attraction.longitude]}
              icon={nearbyIcon}
              eventHandlers={{
                click: () => setSelectedAttraction(attraction),
              }}
            />
          ))}
      </MapContainer>
      {modalOpen && selectedCoords && (
        <ConfirmModal coords={selectedCoords} onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
      {selectedAttraction && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '400px',
            width: '90%',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            padding: 16,
            borderRadius: 8,
            zIndex: 2000,
            boxSizing: 'border-box',
          }}
          onClick={() => handleRedirect(`/sight/${selectedAttraction.id}`)}
        >
          <h3>{selectedAttraction.name}</h3>
          <p>{selectedAttraction.address}</p>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Останавливаем всплытие
              setSelectedAttraction(null);
            }}
          >
            Закрыть
          </button>
        </div>
      )}
    </div>
  );
};

export default MapPage;
