import SearchInput from 'features/search-input';
import style from './styles.module.scss';
import { useEffect, useMemo, useState } from 'react';
import LocationImage from 'shared/ui/LocationImage';
import { useNavigate } from 'react-router';
import { SearchList } from 'widgets/index';
import { getCurrentLocation } from 'shared/lib/geolocation';
import BackHeader from 'shared/ui/BackHeader/ui/BachHeader';
import { useDispatch } from 'react-redux';
import { searchAttractionsRequest } from 'entities/attraction/model/slice';
import debounce from 'lodash.debounce';
import { useSelector } from 'react-redux';
import type { RootState } from 'app/store/mainStore';
import type { Attraction } from 'entities/attraction/model/types';

const SearchPage = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const searchResults: Attraction[] = useSelector(
    (state: RootState) => state.attraction.search.results
  );

  // создаём мемоизированную debounced функцию
  const debouncedSearch = useMemo(
    () =>
      debounce((q: string) => {
        if (q.trim()) {
          dispatch(searchAttractionsRequest({ query: q }));
        }
      }, 400),
    [dispatch]
  );

  // отменяем debounce при анмаунте
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleRedirect = (url: string) => {
    handleGetLocation();
    navigate(url);
  };

  const handleGetLocation = async () => {
    try {
      const loc = await getCurrentLocation();
      alert(`Ваше местоположение: ${loc.lat}, ${loc.lon}`);
    } catch (e) {
      alert(`Ошибка получения местоположения: ${e}`);
    }
  };

  return (
    <div className={style.searchPage}>
      <BackHeader className={style.buttonBack} />
      <SearchInput
        value={query}
        onChange={(val) => {
          setQuery(val);
          debouncedSearch(val);
        }}
      />
      <div onClick={() => handleRedirect('/')} className={style.nearestPlaces}>
        <LocationImage />
        <span>Рядом со мной</span>
      </div>
      <div className={style.sights}>
        {query ? (
          <SearchList attractions={searchResults} />
        ) : (
          <>
            <h2 className={style.title}>Недавно искали:</h2>
            <SearchList />
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
