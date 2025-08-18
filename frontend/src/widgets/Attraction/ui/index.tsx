import Rating from "shared/ui/Rating/ui/Rating";
import styles from "./Attraction.module.scss"
import clsx from "clsx";
import attraction from "shared/assets/attraction.png"
import Location from "shared/ui/Location/ui/Location";
import AttractionMap from "widgets/AttractionMap/ui/AttractionMap";
import AttractionContacts from "widgets/AttractionContacts/ui/AttractionContacts";
import AttractionDescription from "widgets/AttractionDescription/ui/AttractionDescription";
import AttractionWorkingTime from "widgets/AttractionWorkingTime/ui/AttractionWorkingTime";
import {mockAttractions} from "widgets/Attraction/lib/getAttraction"

export default function Attraction() {
    return (
        <>
        <div className={styles.attr_img}>
            <img className={styles.img} src={attraction} alt="Достопримечательность" />
        </div>
        <div className={clsx(styles.attr_description, styles.container)}>
            <div className={styles.attr_title_rating}>
                <h2 className={styles.attr_title}>{mockAttractions[0].name}</h2>
                <Rating rating={mockAttractions[0].rating}></Rating>
            </div>
            <div className={styles.location}>
                <Location location={mockAttractions[0].location}></Location>
                <a href="#!" className={styles.link}>посмотреть на карте</a>
            </div>
            <AttractionWorkingTime titleClassName={styles.title} textClassName={styles.text}></AttractionWorkingTime>
            <AttractionDescription titleClassName={styles.title} textClassName={styles.text}  description={mockAttractions[0].description}></AttractionDescription>
            <AttractionMap titleClassName={styles.title} textClassName={styles.text} address={mockAttractions[0].address}></AttractionMap>
            <AttractionContacts titleClassName={styles.title} textClassName={styles.text} linkClassName={styles.link} phone={mockAttractions[0].phone} email={mockAttractions[0].email} website={mockAttractions[0].website}></AttractionContacts>
        </div>
        </>
    )
}