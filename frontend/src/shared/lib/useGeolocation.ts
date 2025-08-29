import { useEffect, useState } from 'react';

export function useGeolocation() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Геолокация не поддерживается');
      setError('Геолокация не поддерживается');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => {
        console.error('Геолокация не поддерживается');
        setError(err.message);
      }
    );
  }, []);

  return { coords, error };
}
