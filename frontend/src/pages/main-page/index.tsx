// import { useNavigate } from "react-router";

import WhereToGo from 'widgets/where-to-go';
import styles from './MainPage.module.scss';
import { Carousel } from 'widgets/index';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from 'app/store/mainStore';
import { useEffect } from 'react';
import { fetchAttractionsRequest } from 'entities/attraction/model/slice';

const MainPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const museums = useSelector(
    (state: RootState) => state.attraction.attractionsByTag['museum']?.attractions ?? []
  );
  const loadingMuseums = useSelector(
    (state: RootState) => state.attraction.attractionsByTag['museum']?.loading ?? false
  );
  const errorMuseums = useSelector(
    (state: RootState) => state.attraction.attractionsByTag['museum']?.error ?? null
  );

  const entertainments = useSelector(
    (state: RootState) => state.attraction.attractionsByTag['amenity']?.attractions ?? []
  );
  const loadingEntertainment = useSelector(
    (state: RootState) => state.attraction.attractionsByTag['amenity']?.loading ?? false
  );
  const errorEntertainment = useSelector(
    (state: RootState) => state.attraction.attractionsByTag['amenity']?.error ?? null
  );

  const city = useSelector((state: RootState) => state.location.city);

  useEffect(() => {
    if (city) {
      console.log('here');
      dispatch(fetchAttractionsRequest({ city: city, tag: 'museum' }));
      dispatch(fetchAttractionsRequest({ city: city, tag: 'amenity' }));
    }
  }, [dispatch, city]);

  return (
    <div className={styles.body}>
      <div style={{ margin: '40px 0 66px' }}>
        <WhereToGo />
      </div>
      <Carousel
        category="Лучшие музеи"
        attractions={museums}
        loading={loadingMuseums}
        error={errorMuseums}
      />
      <div style={{ height: '56px' }}></div>
      <Carousel
        category="Лучшие развлечения"
        attractions={entertainments}
        loading={loadingEntertainment}
        error={errorEntertainment}
      />
      <div style={{ height: '56px' }}></div>
    </div>
  );
};

export default MainPage;
