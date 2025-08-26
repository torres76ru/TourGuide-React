import type { RootState } from 'app/store/mainStore';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { useGeolocation } from 'shared/lib/useGeolocation';
import Footer from 'widgets/Footer';
import Header from 'widgets/Header';

const MainLayout = () => {
  // const dispatch = useDispatch();
  // const { coords, error } = useGeolocation();
  // const city = useSelector((state: RootState) => state.location.city);
  // const [showModal, setShowModal] = useState(false);

  // useEffect(() => {
  //   if (coords) {
  //     // Запрос города по координатам
  //     dispatch(fetchCityByCoords(coords));
  //   } else if (error) {
  //     setShowModal(true); // Нет разрешения — показать модалку выбора города
  //   }
  // }, [coords, error]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <main style={{ flex: '1 1 100%' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
