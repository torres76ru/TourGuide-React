import Rating from "shared/ui/Rating/ui/Rating";
import styles from "./AttractionCard.module.scss";
import Location from "shared/ui/Location/ui/Location";

interface Props {
  name: string;
  isOpen: string;
  rating: number;
  img: string;
  location: number;
  categories: string;
}

const AttractionCard = ({
  name,
  isOpen,
  rating,
  img,
  location,
  categories,
}: Props) => {
  return (
    <div className={styles.cardBody}>
      <div className={styles.cardImage}>
        <img src={img} alt="Достопримечательность"></img>
      </div>
      <div className={styles.context}>
        <h4>{name}</h4>
        <p>{isOpen}</p>
        <div className={styles.rating_location}>
          <Rating
            rating={rating}
            classSize={styles.size}
            classSizeIcon={styles.size_icon}
          />
          <Location
            distance={location + ""}
            classSize={styles.size}
            classSizeIcon={styles.size_icon}
          />
        </div>
        <p>{categories}</p>
      </div>
    </div>
  );
};

export default AttractionCard;
