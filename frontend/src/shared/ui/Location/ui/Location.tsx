import styles from "./Location.module.scss";
import locationSharp from "shared/assets/location-sharp.svg";

interface Props {
  distance: string;
  classSize?: string
  classSizeIcon?: string
  сity?: string
}

const Location = ({ distance, classSize ="", classSizeIcon ="", сity = ""}: Props) => {
  return (
    <div className={styles.location}>
      <img src={locationSharp} alt="Локация" className={classSizeIcon}/>
      {сity ? <span>{сity}</span> : <span className={`${styles.location_size} ${classSize}`}>{distance}</span>}
    </div>
  );
};

export default Location;
