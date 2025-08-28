import styles from "./Location.module.scss";
import locationSharp from "shared/assets/location-sharp.svg";

interface Props {
  distance: string;
  classSize?: string
  classSizeIcon?: string
  city?: string
}

const Location = ({ distance, classSize ="", classSizeIcon ="", city = ""}: Props) => {
  return (
    <div className={styles.location}>
      <img src={locationSharp} alt="Локация" className={classSizeIcon}/>
      {city ? <span>{city}</span> : <span className={`${styles.location_size} ${classSize}`}>{distance}</span>}
    </div>
  );
};

export default Location;
