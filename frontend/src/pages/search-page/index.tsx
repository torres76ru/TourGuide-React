import SearchInput from "features/search-input";
import style from "./styles.module.scss";
import BackButton from "features/back-button";
import { useState } from "react";
import LocationImage from "shared/ui/LocationImage";
import { useNavigate } from "react-router";
import { SearchList } from "widgets/index";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleRedirect = (url: string) => {
    navigate(url);
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
