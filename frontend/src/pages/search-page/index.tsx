import SearchInput from "features/search-input";
import style from "./styles.module.scss";
import BackButton from "features/back-button";
import { useState } from "react";
import LocationImage from "shared/ui/LocationImage";
import { useNavigate } from "react-router";
import { SearchList } from "widgets/index";
import { getCurrentLocation } from "shared/lib/geolocation";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleRedirect = (url: string) => {
    handleGetLocation();
    navigate(url);
  };
  // const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
  //   null
  // );
  // const [error, setError] = useState<string | null>(null);

  const handleGetLocation = async () => {
    try {
      const loc = await getCurrentLocation();
      // setLocation(loc);
      // setError(null);
      alert(`Ваше местоположение: ${loc.lat}, ${loc.lon}`);
    } catch (e) {
      // setError(String(e));
      alert(`Ошибка получения местоположения: ${e}`);
    }
  };
  return (
    <div className={style.searchPage}>
      <BackButton className={style.buttonBack} />
      <SearchInput value={query} onChange={setQuery} />
      <div onClick={() => handleRedirect("/")} className={style.nearestPlaces}>
        <LocationImage />
        <span>Рядом со мной</span>
      </div>
      <div className={style.sights}>
        {query ? (
          <SearchList />
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
