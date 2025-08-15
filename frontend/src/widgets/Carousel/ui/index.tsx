// widgets/Carousel/ui/index.tsx
import { getRandomSight } from "widgets/SightCard/lib/getRandomSight";
import SightCard from "widgets/SightCard/ui";
import style from "./Carousel.module.scss";
import arrowLeft from "shared/assets/arro-left.svg";

interface Props {
  category: string;
  count?: number;
}

const Carousel = ({ category, count = 5 }: Props) => {
  const sights = Array.from({ length: count }, getRandomSight);

  return (
    <div>
      <div className={style.header}>
        <h1>{category}</h1>
        <img src={arrowLeft} alt="Стрелочка в право" />
      </div>
      <div className={style.carousel}>
        <div className={style.carousel_list}>
          {sights.map((sight, index) => (
            <SightCard
              key={index}
              name={sight.name}
              description={sight.description}
              prices={sight.prices}
              rating={Number(sight.rating)}
              img={sight.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
