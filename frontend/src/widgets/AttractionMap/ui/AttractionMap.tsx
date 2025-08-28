import type { Coordinates } from 'entities/location/model/types';
import styles from './AttractionMap.module.scss';
import MapWithMarker from 'widgets/MiniMap/ui';

interface AttractionMapProps {
  titleClassName?: string;
  textClassName?: string;
  location?: Coordinates;
  address: string;
}

export default function AttractionMap({
  titleClassName,
  textClassName,
  location,
  address,
}: AttractionMapProps) {
  return (
    <div className={styles.map_section}>
      <div className={styles.map_container}>
        {location && <MapWithMarker lat={location.latitude} lng={location.longitude} />}
      </div>
      <div className={styles.adress}>
        <h3 className={titleClassName}>Адрес</h3>
        <p className={textClassName}>{address}</p>
      </div>
    </div>
  );
}
