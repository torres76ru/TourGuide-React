import Rating from "shared/ui/Rating/ui/Rating";
import styles from "widgets/Excursion/ui/Excursion.module.scss";
import clsx from "clsx";
import Location from "shared/ui/Location/ui/Location";
import AttractionMap from "widgets/AttractionMap/ui/AttractionMap";
import AttractionContacts from "widgets/AttractionContacts/ui/AttractionContacts";
import AttractionDescription from "widgets/AttractionDescription/ui/AttractionDescription";
import AttractionPlaceholder from "shared/assets/attraction_placeholder.png";
import { excursion } from "features/AddExcursionForm/lib/getExcursion";
import People from "shared/ui/People/People";
import blueArrow from "shared/assets/blue_arrow.svg"
import Button from "shared/ui/Button";
import type { MouseEventHandler } from "react";


interface ExcursionProps {
    TimetableClick?: MouseEventHandler<HTMLButtonElement>;
}

const Excursion = ({TimetableClick} : ExcursionProps) => {

    const formatAddress = (excursion: {
    city: string;
    street: string;
    house?: string;
    entrance?: string;
    flat?: string;
    }): string => {
    const parts = [];
    
    if (excursion.city) parts.push(excursion.city);
    if (excursion.street) parts.push(excursion.street);
    if (excursion.house) parts.push(excursion.house);
    if (excursion.entrance) parts.push(excursion.entrance);
    if (excursion.flat) parts.push(excursion.flat);
    
    return parts.join(', ');
    };
  return (
    <>
      <div className={styles.attr_img}>
        <img
          className={styles.img}
          src={AttractionPlaceholder}
          alt="Достопримечательность"
        />
      </div>
      <div className={clsx(styles.attr_description, styles.container)}>
        <div className={styles.attr_title_rating}>
          <h2 className={styles.attr_title}>{excursion.title}</h2>
          <Rating rating={4.7}></Rating>
        </div>
        <div className={styles.price_section}>
            <p><span>{excursion.price}</span> рублей с человека</p>
        </div>
        <div className={styles.location}>
          <Location distance="2.3км"/>
          <a href="#!" className={styles.link}>
            посмотреть на карте
          </a>
        </div>
        <People max={excursion.max_people}></People>
        <div className={styles.button_section}>
            <button className={styles.btn} onClick={TimetableClick}>Расписание</button>
            <img src={blueArrow} alt="Стрелочка" />
        </div>
        <AttractionDescription
          titleClassName={styles.title}
          textClassName={styles.text}
          description={excursion.description}
        ></AttractionDescription>
        <AttractionMap
          titleClassName={styles.title}
          textClassName={styles.text}
          address={formatAddress(excursion)}
        ></AttractionMap>
        {(excursion.phone ||
          excursion.email) && (
          <AttractionContacts
            titleClassName={styles.title}
            textClassName={styles.text}
            linkClassName={styles.link}
            phone={excursion.phone}
            email={excursion.email}
          ></AttractionContacts>
        )}
        <Button className={styles.button_size} onClick={TimetableClick}>Записаться на экскурсию</Button>
      </div>
    </>
  );
};

export default Excursion;
