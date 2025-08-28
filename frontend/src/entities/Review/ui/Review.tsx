import styles from "./Review.module.scss";
// import avatar from "shared/assets/avatar.svg";
import star from "shared/assets/star.svg";
import starBlue from "shared/assets/star-blue.svg";
import { useState } from "react";
import UserName from "shared/ui/UserName/ui/UserName";

interface ReviewProps {
  name?: string;
  rating?: number;
  date: string;
  text?: string;
}

export default function Review({ name, rating = 0, date, text }: ReviewProps) {
  const [expanded, setExpanded] = useState(false);

  // Форматирование даты
  const formatDate = (dateString: string): string => {
  const [datePart] = dateString.split('T');
  const [year, month, day] = datePart.split('-');
  
  return `${day}.${month}.${year}`;
};

  // Рассчитываем, нужно ли показывать кнопку (только если текст длинный)
  const shouldShowButton = text && text.length > 230;

  // Создаем массив из 5 элементов и заполняем звёздами
  const stars = Array(5)
    .fill(0)
    .map((_, index) => (
      <img
        key={index}
        src={index < rating ? starBlue : star}
        alt={index < rating ? "Голубая звезда" : "Обычная звезда"}
      />
    ));

  return (
    <div className={styles.review}>
      <UserName name={name}></UserName>
      {/* <div className={styles.name_section}>
                <img src={avatar} alt="Аватар" />
                <h3>{name}</h3>
            </div> */}
      <div className={styles.rating_date}>
        <div className={styles.rating}>{stars}</div>
        <span className={styles.date}>{formatDate(date)}</span>
      </div>
      <div
        className={expanded ? styles.textExpanded : styles.text}
        style={{ transitionDuration: shouldShowButton ? "0.5s" : "0s" }}
      >
        {text}
      </div>
      {shouldShowButton && (
        <button
          className={styles.button}
          onClick={() => setExpanded(!expanded)}
        >
          {" "}
          {expanded ? "Свернуть" : "Ещё"}{" "}
        </button>
      )}
    </div>
  );
}
