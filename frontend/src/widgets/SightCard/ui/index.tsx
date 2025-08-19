import Rating from "shared/ui/Rating/ui/Rating";
import style from "./SightCard.module.scss";
import { useNavigate } from "react-router";

interface Props {
  name: string;
  description: string;
  prices: string;
  rating: number;
  img: string;
}

const SightCard = ({ name, description, prices, rating, img }: Props) => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/sight");
  };
  return (
    <div className={style.cardBody} onClick={() => handleRedirect()}>
      <div className={style.cardImage}>
        <img src={img} alt="Достопримечательность"></img>
      </div>
      <div className={style.context}>
        <div className={style.info}>
          <div className={style.row}>
            <h3>{name}</h3>
            <Rating rating={rating} />
          </div>
          <div className={style.description}>{description}</div>
        </div>
        <div className={style.prices}>От {prices} рублей</div>
      </div>
    </div>
  );
};

export default SightCard;
