import style from "./Rating.module.scss";
import starImg from "shared/assets/star-blue.svg";

interface Props {
  rating: number;
}

const Rating = ({ rating }: Props) => {
  return (
    <div className={style.rating}>
      <img src={starImg} alt="Рейтинг" />
      <span>{rating?.toFixed(1)}</span>
    </div>
  );
};

export default Rating;
