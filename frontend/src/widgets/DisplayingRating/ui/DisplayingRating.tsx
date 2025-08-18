import styles from "./DisplayingRating.module.scss"
import star from "shared/assets/star.svg"
import starBlue from "shared/assets/star-blue.svg"
import {mockReviews} from "widgets/Reviews/lib/getReviews"
import RatingScale from "shared/ui/RatingScale/ui/RatingScale"

interface DisplayingRatingProps {
    rating: number
}

export default function DisplayingRating({rating} : DisplayingRatingProps) {
    
    const roundedRating = Math.round(rating);

    // 1. Рассчитываем количество отзывов для каждой оценки
    const ratingCounts = mockReviews.reduce((acc, review) => {
    const rounded = Math.round(review.rating);
    acc[rounded] = (acc[rounded] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

    // 2. Вычисляем процент для каждой оценки
    const totalReviews = mockReviews.length;
    const ratingPercentages = [5, 4, 3, 2, 1].map((star) => ({
        star,
        percentage: ((ratingCounts[star] || 0) / totalReviews) * 100,
    }));

     // Создаем массив из 5 элементов и заполняем звёздами
    const stars = Array(5).fill(0).map((_, index) => (
        <img 
            key={index}
            src={index < roundedRating ? starBlue : star}
            alt={index < roundedRating ? "Голубая звезда" : "Обычная звезда"}
        />
    ));

    return (
        <>
        <div className={styles.displaying_ating}>
            <div className={styles.rating_section}>
                <span className={styles.rating}>{rating?.toFixed(1)}</span>
                <div className={styles.stars}>{stars}</div>
                <span className={styles.reviews}>{mockReviews.length}</span>
            </div>
            <div className={styles.rating_scale_section}>
                {ratingPercentages.map(({ star, percentage }) => (
                    <RatingScale 
                        key={star}
                        number={star}
                        width={percentage}
                    />
                    ))}
            </div>
        </div>
        </>
    )
}