import style from "./SightCard.module.scss";
import starImg from "shared/assets/star-blue.svg";

interface Props {
  name?: string;
  description?: string;
  prices?: string;
  rating?: number;
  img?: string;
}

const SightCard = ({ name, description, prices, rating, img }: Props) => {
  return (
    <div className={style.cardBody}>
      <div className={style.cardImage}>
        <img src={img} alt="Достопримечательность"></img>
      </div>
      <div className={style.context}>
        <div className={style.info}>
          <div className={style.row}>
            <h3>{name}</h3>
            <div className={style.rating}>
              <img src={starImg} alt="Рейтинг" />
              <span>{rating?.toFixed(1)}</span>
            </div>
          </div>
          <div className={style.description}>{description}</div>
        </div>
        <div className={style.prices}>От {prices} рублей</div>
      </div>
    </div>
  );
};

export default SightCard;
