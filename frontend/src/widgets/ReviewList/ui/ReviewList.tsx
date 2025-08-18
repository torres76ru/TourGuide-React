import { useState } from "react";
import styles from "./ReviewList.module.scss"
import { mockReviews } from "widgets/Reviews/lib/getReviews"
import Review from "entities/Review/ui/Review";

export default function ReviewList() {
    const [showAllReviews, setShowAllReviews] = useState(false);
        
        // Отображаем либо 3 отзыва, либо все в зависимости от состояния
    const displayedReviews = showAllReviews ? mockReviews : mockReviews.slice(0, 3);
    return (
        <>
        <div className={styles.reviews_list}>
                {displayedReviews.map((review, index) => (
                    <Review
                        key={index}
                        name={review.name}
                        rating={review.rating}
                        date={review.date}
                        text={review.text}
                    />
                ))}
        </div>
        {mockReviews.length > 3 && ( 
            <button 
                className={styles.show_more_button}
                onClick={() => setShowAllReviews(!showAllReviews)}>
                {showAllReviews ? 'Скрыть отзывы' : 'Все отзывы'}
            </button> )}
        </>
    )
}