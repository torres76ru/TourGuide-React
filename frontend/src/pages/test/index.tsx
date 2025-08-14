import { useState } from "react";

const Test = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Ваш браузер не поддерживает геолокацию");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setError(null);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Пользователь запретил доступ к геолокации");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Информация о местоположении недоступна");
            break;
          case err.TIMEOUT:
            setError("Время ожидания запроса истекло");
            break;
          default:
            setError("Неизвестная ошибка");
        }
      }
    );
  };

  return (
    <div>
      <button onClick={getLocation}>📍 Определить местоположение</button>

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
