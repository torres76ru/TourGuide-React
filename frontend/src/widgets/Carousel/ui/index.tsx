// widgets/Carousel/ui/index.tsx

import SightCard from "widgets/SightCard/ui";
import style from "./Carousel.module.scss";
import arrowLeft from "shared/assets/arro-left.svg";
import type { Attraction } from "entities/attraction/model/types";
import Loader from "shared/ui/Loader/Loader";

interface Props {
  attractions: Attraction[];
  loading?: boolean;
  error?: string | null;
  category: string;
}

const Carousel = ({ category, attractions, loading = false, error }: Props) => {
  return (
    <div>
      <div className={style.header}>
        <h1>{category}</h1>
        <img src={arrowLeft} alt="Стрелочка в право" />
      </div>

      {loading ? (
        <div className={style.loader}>
          <Loader size={40} color="#000" />
        </div>
      ) : error ? (
        <div className={style.error}>Ошибка: {error}</div>
      ) : (
        <div className={style.carousel}>
          <div className={style.carousel_list}>
            {attractions.map((sight) => (
              <SightCard
                key={sight.id}
                id={sight.id}
                name={sight.name}
                description={sight.address}
                rating={sight.average_rating}
                img={sight.main_photo_url}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Carousel;
