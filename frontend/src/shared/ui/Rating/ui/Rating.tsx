import style from "./Rating.module.scss";
import starImg from "shared/assets/star-blue.svg";

interface Props {
  rating: number;
  classSize?: string;
  classSizeIcon?: string;
}

const Rating = ({ rating, classSize ="", classSizeIcon =""}: Props) => {
  return (
    <div className={style.rating}>
      <img src={starImg} alt="Рейтинг" className={classSizeIcon}/>
      <span className={`${style.rating_size} ${classSize}`}>{rating?.toFixed(1)}</span>
    </div>
  );
};

export default Rating;
