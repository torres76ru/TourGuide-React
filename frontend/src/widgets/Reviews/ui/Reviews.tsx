import ReviewList from "widgets/ReviewList/ui/ReviewList"
import styles from "./Reviews.module.scss"
import GalleryCarousel from "widgets/GalleryCarousel/ui/GalleryCarousel"
import DisplayingRating from "widgets/DisplayingRating/ui/DisplayingRating"
import { useNavigate } from "react-router-dom";


export default function Reviews() {
    const navigate = useNavigate();

    const handleRedirect = (href: string) => {
        navigate(href);
    };

    return (
        <>
        <div className={styles.container}>
            <div className={styles.title_section}>
                <h3 className={styles.title}>Отзывы</h3>
                <button className={styles.button} onClick={() => handleRedirect("/sight/review")}>Написать отзыв</button>
            </div>
            <DisplayingRating rating={4.2}></DisplayingRating>
            <GalleryCarousel count={8} ></GalleryCarousel>
            <ReviewList />
        </div>
        </>
    )
}