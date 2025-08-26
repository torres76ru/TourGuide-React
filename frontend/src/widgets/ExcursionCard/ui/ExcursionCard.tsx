import { useNavigate } from 'react-router-dom';
import styles from './ExcursionCard.module.scss';
import starBlue from 'shared/assets/star-blue.svg';
import star from 'shared/assets/star.svg';
import Button from 'shared/ui/Button';
import Location from 'shared/ui/Location/ui/Location';
import edit from 'shared/assets/edit.svg'

interface ExcursionCardProps {
  img?: string;
  name?: string;
  date?: string;
  rating: number;
  сity?: string;
}

export default function ExcursionCard({ img, name, date, rating, сity }: ExcursionCardProps) {
  const roundedRating = Math.round(rating);

  const stars = Array(5)
    .fill(0)
    .map((_, index) => (
      <img
        key={index}
        src={index < roundedRating ? starBlue : star}
        alt={index < roundedRating ? 'Голубая звезда' : 'Обычная звезда'}
      />
    ));

  const navigate = useNavigate();

  const handleRedirect = (href: string) => {
    navigate(href);
  };

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation(); 
    handleRedirect('/user/guide-excursions/editing');
  };

  const handleCardClick = () => {
    handleRedirect('/excursion');
  };

  return (
    <div className={styles.excursion_card_section}>
      <div className={styles.excursion_card} onClick={handleCardClick}>
        <div className={styles.img_section}>
          <img src={img} alt="Экскурсия" />
        </div>
        <div className={styles.excursion_inf}>
          <div className={styles.name_section}>
            <h3 className={styles.text}>{name}</h3>
          </div>
          <p className={styles.text}>{date}</p>
          <Location distance={''} сity={сity}></Location>
          <div className={styles.stars}>{stars}</div>
        </div>
        <div className={styles.edit_button_section}>
          <button 
            className={styles.edit_button} 
            onClick={handleEditClick}
          > 
            <img src={edit} alt="Редактировать" />
          </button>
        </div>
      </div>
      <Button className={styles.button_size} onClick={() => handleRedirect('/user/guide-excursions/join-list')}>К списку записавшихся</Button>
    </div>
  );
}