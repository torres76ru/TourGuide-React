import Rating from "shared/ui/Rating/ui/Rating";
import styles from "./Attraction.module.scss"
import clsx from "clsx";
import attraction from "shared/assets/attraction.png"
import Location from "shared/ui/Location/ui/Location";
import AttractionMap from "shared/ui/AttractionMap/ui/AttractionMap";
import AttractionContacts from "shared/ui/AttractionContacts/ui/AttractionContacts";
import AttractionDescription from "shared/ui/AttractionDescription/ui/AttractionDescription";
import AttractionWorkingTime from "shared/ui/AttractionWorkingTime/ui/AttractionWorkingTime";

export default function Attraction() {
    return (
        <>
        <div className={styles.attr_img}>
            <img className={styles.img} src={attraction} alt="Достопримечательность" />
        </div>
        <div className={clsx(styles.attr_description, styles.container)}>
            <div className={styles.attr_title_rating}>
                <h2 className={styles.attr_title}>Выставка достижений народного хозяйства (ВДНХ)</h2>
                <Rating rating={4.8}></Rating>
            </div>
            <div className={styles.location}>
                <Location location={2.3}></Location>
                <a href="#!" className={styles.link}>посмотреть на карте</a>
            </div>
            <AttractionWorkingTime titleClassName={styles.title} textClassName={styles.text}></AttractionWorkingTime>
            <AttractionDescription titleClassName={styles.title} textClassName={styles.text}></AttractionDescription>
            <AttractionMap titleClassName={styles.title} textClassName={styles.text}></AttractionMap>
            <AttractionContacts titleClassName={styles.title} textClassName={styles.text} linkClassName={styles.link}></AttractionContacts>
        </div>
        </>
    )
}