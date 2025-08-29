export const getCurrentLocation = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Ваш браузер не поддерживает геолокацию");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            reject("Пользователь запретил доступ к геолокации");
            break;
          case err.POSITION_UNAVAILABLE:
            reject("Информация о местоположении недоступна");
            break;
          case err.TIMEOUT:
            reject("Время ожидания запроса истекло");
            break;
          default:
            reject("Неизвестная ошибка");
        }
      }
    );
  });
};
