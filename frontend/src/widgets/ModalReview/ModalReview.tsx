import { useEffect, useState } from 'react';
import styles from './ModalReview.module.scss';
import { IconArrowBack } from 'shared/ui/ArrowBackSvg';
import UserName from 'shared/ui/UserName/ui/UserName';
import TextArea from 'shared/ui/TextArea/TextArea';
import Button from 'shared/ui/Button';
import starBlue from 'shared/assets/star-blue.svg';
import star from 'shared/assets/star.svg';
import type { AttractionDetails } from 'entities/attraction/model/types';
import { useSelector } from 'react-redux';
import type { RootState } from 'app/store/mainStore';
import axios from 'axios';
import { reviewApi } from 'entities/Review/model/api';
import AddPhotoButton from 'shared/ui/AddPhotoButton/AddPhotoButton';

interface ModalReviewProps {
  attraction: AttractionDetails;
  onClick?: () => void;
  initialComment?: string;
  initialRating?: number;
}

export default function ModalReview({
  attraction,
  onClick,
  initialComment = '',
  initialRating = 0,
}: ModalReviewProps) {
  const [rating, setRating] = useState<number>(initialRating);
  const [text, setText] = useState<string>(initialComment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const { user } = useSelector((state: RootState) => state.user);
  const [idComment, setIdComment] = useState<number | null>(null);

  useEffect(() => {
    if (attraction.ratings && user?.email) {
      const comment = attraction.ratings.find((item) => item.user.email === user.email);
      if (comment) {
        setRating(comment.value);
        setText(comment.comment);
        setIdComment(comment.id);
      }
    }
  }, [attraction.ratings, user?.email]);

  // Создаем массив из 5 звезд
  const stars = Array(5)
    .fill(0)
    .map((_, index) => (
      <button
        key={index}
        className={styles.star_button}
        onClick={() => setRating(index + 1)}
        type="button"
      >
        <img
          src={index < rating ? starBlue : star}
          alt={index < rating ? 'Голубая звезда' : 'Обычная звезда'}
        />
      </button>
    ));

  const handleSubmit = async () => {
    setError(null);

    // Валидация
    if (!rating) {
      setError('Поставьте оценку');
      return;
    }
    if (!text.trim()) {
      setError('Напишите комментарий');
      return;
    }

    setLoading(true);
    try {
      if (idComment) {
        await reviewApi.updateComment(idComment, attraction.id, text, rating);
        if (photo) await reviewApi.sendPhoto(attraction.id, photo);
      } else {
        await reviewApi.sendComment(attraction.id, text, rating);
        if (photo) await reviewApi.sendPhoto(attraction.id, photo);
      }
      // Закрыть форму после успешной отправки
      if (onClick) onClick();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(
          e.response?.data?.error ||
            e.response?.data?.detail ||
            e.message ||
            'Ошибка отправки отзыва'
        );
      } else {
        setError('Неизвестная ошибка');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.ModalReview}>
        <div className={styles.title_section}>
          <button className={styles.back_button} onClick={onClick}>
            <IconArrowBack />
          </button>
          <h3>{attraction.name}</h3>
        </div>
        <div className={styles.review_section}>
          <UserName
            name={user?.username}
            headingStyle={{
              fontSize: '16px',
            }}
            imageStyle={{
              width: '32px',
              height: '32px',
            }}
          />

          <div className={styles.rating}>{stars}</div>

          <TextArea
            placeholder="Напишите свой отзыв..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <AddPhotoButton photo={photo} onPhotoChange={setPhoto} className={styles.margin} />
          <Button
            variant="black"
            style={{
              width: '278px',
              position: 'absolute',
              bottom: '35px',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Отправка...' : 'Опубликовать'}
          </Button>
          {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
        </div>
      </div>
    </>
  );
}
