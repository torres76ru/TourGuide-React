// import { useNavigate } from "react-router";

import WhereToGo from 'widgets/where-to-go';
import styles from './MainPage.module.scss';
import { Carousel } from 'widgets/index';
import { useSelector } from 'react-redux';
import type { RootState } from 'app/store/mainStore';
import { selectAttractionsByTags } from 'entities/attraction/model/selectors';

const categories = [
  { tag: 'museum', label: 'Лучшие музеи' },
  { tag: 'cafe', label: 'Лучшие кафе' },
  { tag: 'restaurant', label: 'Лучшие рестораны' },
  { tag: 'theatre', label: 'Лучшие театры' },
];

const MainPage = () => {
  // const [searchParams] = useSearchParams();

  // const city = useSelector((state: RootState) => state.location.city);
  // const coords = useSelector((state: RootState) => state.location.coords);

  // const [user] = useSelector((state: RootState) => [state.user.user]);

  // const hasNearby = searchParams.has('nearby');

  // useWatchLocation();

  const attractionsByTag = useSelector((state: RootState) =>
    selectAttractionsByTags(
      state,
      categories.map((c) => c.tag)
    )
  );

  // // Только для загрузки по городу
  // useEffect(() => {
  //   if (city && !hasNearby) {
  //     categories.forEach(({ tag }) => {
  //       dispatch(fetchAttractionsRequest({ city, tag }));
  //     });
  //   } else {
  //     categories.forEach(({ tag }) => {
  //       dispatch(fetchAttractionsRequest({ tag }));
  //     });
  //   }
  // }, [dispatch, city, hasNearby, user]);

  // // Только для nearby
  // useEffect(() => {
  //   if (hasNearby && coords) {
  //     categories.forEach(({ tag }) => {
  //       dispatch(
  //         fetchAttractionsRequest({
  //           tag,
  //           nearby: { lat: coords.latitude, lon: coords.longitude },
  //         })
  //       );
  //     });
  //   }
  // }, [dispatch, hasNearby, coords]);

  return (
    <div className={styles.body}>
      <div style={{ margin: '40px 0 66px' }}>
        <WhereToGo />
      </div>

      {categories.map(({ tag, label }) => {
        const { attractions, loading, error } = attractionsByTag[tag];
        if (error) return;
        return (
          <div key={tag} style={{ marginBottom: '56px' }}>
            <Carousel category={label} attractions={attractions} loading={loading} error={error} />
          </div>
        );
      })}
    </div>
  );
};

export default MainPage;
