import type { AppDispatch, RootState } from 'app/store/mainStore';
import { selectAttractionsByTags } from 'entities/attraction/model/selectors';
import { fetchLeadersRequest } from 'entities/attraction/model/slice';
import { setCoords } from 'entities/location/model/slice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { useGeolocation } from 'shared/lib/useGeolocation';
import Footer from 'widgets/Footer';
import Header from 'widgets/Header';

const categories = [
  { tag: 'museum', label: 'Лучшие музеи' },
  { tag: 'cafe', label: 'Лучшие кафе' },
  { tag: 'restaurant', label: 'Лучшие рестораны' },
  { tag: 'theatre', label: 'Лучшие театры' },
];

const MainLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coords, error } = useGeolocation();
  // const city = useSelector((state: RootState) => state.location.city);
  // const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (coords) {
      // Запрос города по координатам
      dispatch(setCoords({ latitude: coords.lat, longitude: coords.lon }));
    }
  }, [dispatch, coords, error]);

  const attractionsByTag = useSelector((state: RootState) =>
    selectAttractionsByTags(
      state,
      categories.map((c) => c.tag)
    )
  );

  useEffect(() => {
    categories.forEach(({ tag }) => {
      const { loading, error } = attractionsByTag[tag];
      if (!loading && !error) {
        dispatch(fetchLeadersRequest({ tag, limit: 50 }));
      }
    });
  }, [dispatch]);

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
