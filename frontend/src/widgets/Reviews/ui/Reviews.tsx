import ReviewList from "widgets/ReviewList/ui/ReviewList"
import styles from "./Reviews.module.scss"
import GalleryCarousel from "widgets/GalleryCarousel/ui/GalleryCarousel"
import DisplayingRating from "widgets/DisplayingRating/ui/DisplayingRating"


export default function Reviews() {

    return (
        <>
        <div className={styles.container}>
            <div className={styles.title_section}>
                <h3 className={styles.title}>Отзывы</h3>
                <a href="#!" className={styles.link}>Написать отзыв</a>
            </div>
            <DisplayingRating rating={4.2}></DisplayingRating>
            <GalleryCarousel count={8} ></GalleryCarousel>
            <ReviewList />
        </div>
        </>
    )
}