// features/location/hooks/useWatchLocation.ts
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCity, setCoords, setError } from '../model/slice';
import { locationApi } from '../model/api';

export const useWatchLocation = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!navigator.geolocation) {
      dispatch(setError('Geolocation is not supported by your browser'));
      return;
    }

    async function getCity(lat: number, lon: number) {
      try {
        const data = await locationApi.getByCity(lat, lon);
        if (!data) {
          console.error(`City not found by your coords: lat=${lat}, lon=${lon}}`);
          return;
        }
        dispatch(setCity(data.city));
      } catch (error) {
        console.error(`City not found by your coords: lat=${lat}, lon=${lon}}`, error);
        getCity(59.934, 30.306); // DELETE THIS // St. Petersburg coords

      }
    }

    const watcherId = navigator.geolocation.watchPosition(
      (position) => {
        dispatch(
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        );

        getCity(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        dispatch(setError(err.message));

        getCity(59.934, 30.306); // DELETE THIS // St. Petersburg coords
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 30000,
      }
    );

    return () => navigator.geolocation.clearWatch(watcherId);
  }, [dispatch]);
};
