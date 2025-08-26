import { useState } from "react";
import styles from "./ReviewList.module.scss";
import Review from "entities/Review/ui/Review";
import type { iReview } from "entities/attraction/model/types";

interface ReviewListProps {
  ratings: iReview[];
}

export default function ReviewList({ ratings }: ReviewListProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);

  return (
    <>
      <div className={styles.reviews_list}>
        {ratings.map((review, index) => (
          <Review
            key={index}
            name={review.user.username}
            rating={review.value}
            date={review.created_at}
            text={review.comment}
          />
        ))}
      </div>
      {ratings.length > 3 && (
        <button
          className={styles.show_more_button}
          onClick={() => setShowAllReviews(!showAllReviews)}
        >
          {showAllReviews ? "Скрыть отзывы" : "Все отзывы"}
        </button>
      )}
    </>
  );
}
