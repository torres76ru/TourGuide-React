import ReviewList from "widgets/ReviewList/ui/ReviewList";
import styles from "./Reviews.module.scss";
import GalleryCarousel from "widgets/GalleryCarousel/ui/GalleryCarousel";
import DisplayingRating from "widgets/DisplayingRating/ui/DisplayingRating";
import type { AttractionDetails } from "entities/attraction/model/types";
import type { MouseEventHandler } from "react";

interface ReviewsProps {
  attraction: AttractionDetails;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Reviews({ attraction, onClick }: ReviewsProps) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.title_section}>
          <h3 className={styles.title}>Отзывы</h3>
          <button className={styles.link} onClick={onClick}>Написать отзыв</button>
        </div>

        {attraction?.ratings && attraction.ratings.length > 0 ? (
          <DisplayingRating
            rating={attraction.average_rating}
            reviews={attraction.ratings}
          ></DisplayingRating>)
          :
          <div style={{margin: '20px 0', fontSize: '14px', fontWeight: '600'}}>
            <p>Здесь пока нет отзывов и оценок.</p>
          </div>
        }
        {attraction?.additional_photos && attraction.additional_photos.length > 0 && (
          <GalleryCarousel
            photos={attraction.additional_photos}
          ></GalleryCarousel>
        )}
        {attraction?.ratings && attraction.ratings.length > 0 && <ReviewList ratings={attraction.ratings} />}
      </div>
    </>
  );
}
