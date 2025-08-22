import ReviewList from "widgets/ReviewList/ui/ReviewList";
import styles from "./Reviews.module.scss";
import GalleryCarousel from "widgets/GalleryCarousel/ui/GalleryCarousel";
import DisplayingRating from "widgets/DisplayingRating/ui/DisplayingRating";
import type { AttractionDetails } from "entities/attraction/model/types";

interface ReviewsProps {
  attraction: AttractionDetails;
}

export default function Reviews({ attraction }: ReviewsProps) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.title_section}>
          <h3 className={styles.title}>Отзывы</h3>
          <a href="#!" className={styles.link}>
            Написать отзыв
          </a>
        </div>

        {attraction?.ratings && (
          <DisplayingRating
            rating={attraction.average_rating}
            reviews={attraction.ratings}
          ></DisplayingRating>
        )}
        {attraction?.additional_photos && (
          <GalleryCarousel
            photos={attraction.additional_photos}
          ></GalleryCarousel>
        )}
        {attraction?.ratings && <ReviewList ratings={attraction.ratings} />}
      </div>
    </>
  );
}
