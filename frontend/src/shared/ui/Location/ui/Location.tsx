import styles from "./Location.module.scss";
import locationSharp from "shared/assets/location-sharp.svg";

interface Props {
  location: number;
  classSize?: string
  classSizeIcon?: string
}

const Location = ({ location, classSize ="", classSizeIcon =""}: Props) => {
  return (
    <div className={styles.location}>
      <img src={locationSharp} alt="Локация" className={classSizeIcon}/>
      <span className={`${styles.location_size} ${classSize}`}>{location?.toFixed(1)}м</span>
    </div>
  );
};

export default Location;