import Rating from 'shared/ui/Rating/ui/Rating';
import styles from './Attraction.module.scss';
import clsx from 'clsx';
import Location from 'shared/ui/Location/ui/Location';
import AttractionMap from 'widgets/AttractionMap/ui/AttractionMap';
import AttractionContacts from 'widgets/AttractionContacts/ui/AttractionContacts';
import AttractionDescription from 'widgets/AttractionDescription/ui/AttractionDescription';
// import AttractionWorkingTime from 'widgets/AttractionWorkingTime/ui/AttractionWorkingTime';
import AttractionPlaceholder from 'shared/assets/attraction_placeholder.png';
import type { AttractionDetails } from 'entities/attraction/model/types';
import { BASE_URL } from 'shared/config/constants';
import type { RootState } from 'app/store/mainStore';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { formatDistance, haversineDistance } from 'entities/location/lib/haversinDistance';

interface AttractionProps {
  attraction: AttractionDetails;
}

const Attraction = ({ attraction }: AttractionProps) => {
  const [distance, setDistance] = useState<string>('');

  const coords = useSelector((state: RootState) => state.location.coords);

  useEffect(() => {
    if (!coords) return;
    const distance_ = haversineDistance(
      coords.latitude,
      coords.longitude,
      attraction.latitude,
      attraction.longitude
    );

    setDistance(formatDistance(distance_));
  }, [coords, attraction.latitude, attraction.longitude]);

  return (
    <>
      <div className={styles.attr_img}>
        <img
          className={styles.img}
          src={
            attraction?.main_photo_url
              ? BASE_URL + attraction?.main_photo_url
              : AttractionPlaceholder
          }
          alt="Достопримечательность"
          onError={(e) => {
            // заменяем на плейсхолдер, если картинка не загрузилась
            (e.currentTarget as HTMLImageElement).src = AttractionPlaceholder;
          }}
        />
      </div>
      <div className={clsx(styles.attr_description, styles.container)}>
        <div className={styles.attr_title_rating}>
          <h2 className={styles.attr_title}>{attraction.name}</h2>
          <Rating rating={attraction.average_rating}></Rating>
        </div>
        <div className={styles.location}>
          {distance && <Location distance={distance} />}

          <a href="#!" className={styles.link}>
            посмотреть на карте
          </a>
        </div>
        {/* <AttractionWorkingTime
          titleClassName={styles.title}
          textClassName={styles.text}
        ></AttractionWorkingTime> */}
        {attraction.description && (
          <AttractionDescription
            titleClassName={styles.title}
            textClassName={styles.text}
            description={attraction.description}
          ></AttractionDescription>
        )}
        <AttractionMap
          titleClassName={styles.title}
          textClassName={styles.text}
          address={attraction.address}
          location={{
            latitude: attraction.latitude,
            longitude: attraction.longitude,
          }}
        ></AttractionMap>
        {(attraction.phone_number || attraction.email || attraction.website) && (
          <AttractionContacts
            titleClassName={styles.title}
            textClassName={styles.text}
            linkClassName={styles.link}
            phone={attraction.phone_number}
            email={attraction.email}
            website={attraction.website}
          ></AttractionContacts>
        )}
      </div>
    </>
  );
};

export default Attraction;
