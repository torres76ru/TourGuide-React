import { useState } from "react";
import { getCurrentLocation } from "../../shared/lib/geolocation";

const Test = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = async () => {
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  };

  return (
    <div>
      <button onClick={handleGetLocation}>📍 Определить местоположение</button>

      {location && (
        <p>
          Широта: {location.lat}, Долгота: {location.lon}
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Test;
