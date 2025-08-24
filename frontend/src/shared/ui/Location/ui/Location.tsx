import styles from "./Location.module.scss";
import locationSharp from "shared/assets/location-sharp.svg";

interface Props {
  distance: string;
  classSize?: string
  classSizeIcon?: string
  sity?: string
}

const Location = ({ distance, classSize ="", classSizeIcon ="", sity = ""}: Props) => {
  return (
    <div className={styles.location}>
      <img src={locationSharp} alt="Локация" className={classSizeIcon}/>
      {sity ? <span>{sity}</span> : <span className={`${styles.location_size} ${classSize}`}>{distance}</span>}
    </div>
  );
};

export default Location;
