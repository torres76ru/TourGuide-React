import UserName from "shared/ui/UserName/ui/UserName";
import styles from "./ReviewPage.module.scss";
import BackHeader from "shared/ui/BackHeader/ui/BachHeader";
import { useSelector } from "react-redux";
import type { RootState } from "app/store/mainStore";
import starBlue from "shared/assets/star-blue.svg";
import star from "shared/assets/star.svg";
import { useState } from "react";

const ReviewPage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");

  // Создаем массив из 5 звезд
  const stars = Array(5).fill(0).map((_, index) => (
    <button
      key={index}
      className={styles.star_button}
      onClick={() => setRating(index + 1)}
      type="button"
    >
      <img 
        src={index < rating ? starBlue : star}
        alt={index < rating ? "Голубая звезда" : "Обычная звезда"}
      />
    </button>
  ));

  return (
    <div className={styles.review_page}>
      <BackHeader title="Выставка достижений народного хозяйства (ВДНХ)"></BackHeader>
      
      <div className={styles.review_section}>
        <UserName 
          name={user?.username} 
          headingStyle={{
            fontSize: "16px" 
          }}
          imageStyle={{
            width: "32px",
            height: "32px"
          }}
        />
        
        <div className={styles.rating}>{stars}</div>

        {/* Блок с текстовым полем */}
        <div className={styles.review_input_container}>
          <textarea
            className={styles.review_input}
            placeholder="Напишите свой отзыв..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;