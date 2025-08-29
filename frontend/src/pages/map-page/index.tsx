import React, { useEffect, useState } from 'react';
import styles from './MapPage.module.scss';
import Slider from '@mui/material/Slider';
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
import { SightCard } from 'widgets/index';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

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
  { tag: 'museum', label: 'музеи' },
  { tag: 'cafe', label: 'кафе' },
  { tag: 'restaurant', label: 'рестораны' },
  { tag: 'theatre', label: 'театры' },
  { tag: '', label: 'Все' },
];

const MapPage: React.FC = () => {
  const dispatch = useDispatch();
  const savedLocation = useSelector((state: RootState) => state.location);
  const navigate = useNavigate();

  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [radius, setRadius] = useState<number>(100);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const coords = useSelector((state: RootState) => state.location.coords);
  useEffect(() => {
    if (coords) setSelectedCoords([coords?.latitude, coords?.longitude]);
  }, [coords]);
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
          tags: selectedCategory ? [selectedCategory] : [],
          lat: selectedCoords[0],
          lon: selectedCoords[1],
          radius: radius / 100000,
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

  const loading = useSelector((state: RootState) => state.attraction.nearby.loading)
  const error = useSelector((state: RootState) => state.attraction.nearby.error)


  return (
    <div className={styles.root}>
      <Header />
      <div className={styles.mapWrapper}>
        
     
        <div className={styles.radiusPanel}>

        <div style={{maxWidth: '100%'}}>
        <div className={styles.elegantStatus}>
      {loading && (
        <div className={styles.elegantLoading}>
          <div className={styles.dotFlashing}></div>
          <span>Загрузка данных...</span>
        </div>
      )}
      
      {error && (
        <div className={styles.elegantError}>
          <span className={styles.errorSymbol}>ⓘ</span>
          <div className={styles.errorMessage}>
            <strong>Ошибка</strong>
            <p>Не удалось загрузить данные</p>
          </div>
        </div>
      )}
    </div>
        </div>
        <div className={styles.row}>
          <label htmlFor="radius-slider" className={styles.radiusLabel}>
            Радиус (м):
          </label>
          <div style={{ padding: '0 16px', width: '100%' }}>
            <Slider
              id="radius-slider"
              value={radius}
              min={100}
              max={1000}
              step={10}
              onChange={(_, value) => setRadius(Number(value))}
              valueLabelDisplay="auto"
              className={styles.radiusSlider}
            />
          </div>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            displayEmpty
            className={styles.categoryDropdown}
            style={{
              width: '100%',
              height: 48, // высота
              marginTop: 12, // отступ сверху
              marginBottom: 12, // отступ снизу
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category.tag} value={category.tag}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </div>
        </div>
        <MapContainer
          center={
            savedLocation.coords?.latitude !== undefined &&
            savedLocation.coords?.longitude !== undefined
              ? [savedLocation.coords.latitude, savedLocation.coords.longitude]
              : [55.751244, 37.618423]
          } // Moscow default
          zoom={13}
          className={styles.map}
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
            className={styles.attractionCard}
            onClick={() => handleRedirect(`/sight/${selectedAttraction.id}`)}
          >
            <SightCard
              id={selectedAttraction.id}
              name={selectedAttraction.name}
              description={''}
              rating={selectedAttraction.average_rating}
              img={selectedAttraction.main_photo_url}
              className={styles.sightCard}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
