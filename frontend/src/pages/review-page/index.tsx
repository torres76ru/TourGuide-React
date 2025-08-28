import UserName from "shared/ui/UserName/ui/UserName";
import styles from "./ReviewPage.module.scss";
import BackHeader from "shared/ui/BackHeader/ui/BachHeader";
import { useSelector } from "react-redux";
import type { RootState } from "app/store/mainStore";
import starBlue from "shared/assets/star-blue.svg";
import star from "shared/assets/star.svg";
import { useState } from "react";
import TextArea from "shared/ui/TextArea/TextArea";
import AddPhotoButton from "shared/ui/AddPhotoButton/AddPhotoButton";
import Button from "shared/ui/Button";

const ReviewPage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [rating, setRating] = useState<number>(0);

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
            width: "27px",
            height: "27px"
          }}
        />
        
        <div className={styles.rating}>{stars}</div>

        <TextArea
          placeholder="Напишите свой отзыв...">
        </TextArea>
        <AddPhotoButton children="Добавить фото"/>
         <Button variant="black" style={{ width: "278px", position: "absolute", bottom: "35px", left: "50%", transform: "translate(-50%, -50%)"}} 
          type="button">
              Опубликовать    
          </Button>
      </div>
    </div>
  );
};

export default ReviewPage;