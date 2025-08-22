// features/location/hooks/useWatchLocation.ts
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCoords, setError } from '../model/slice';

export const useWatchLocation = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!navigator.geolocation) {
      dispatch(setError('Geolocation is not supported by your browser'));
      return;
    }

    const watcherId = navigator.geolocation.watchPosition(
      (position) => {
        dispatch(
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        );
      },
      (err) => {
        dispatch(setError(err.message));
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
