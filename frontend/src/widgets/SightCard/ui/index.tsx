import Rating from 'shared/ui/Rating/ui/Rating';
import style from './SightCard.module.scss';
import { useNavigate } from 'react-router';
import attractionPlaceholder from 'shared/assets/attraction_placeholder.png';
import { BASE_URL } from 'shared/config/constants';
interface Props {
  id: number;
  name: string;
  description: string;
  prices?: string;
  rating: number;
  img?: string | null;
  className?: string;
}

const SightCard = ({ id, name, description, prices, rating, img, className }: Props) => {
  const addressParts = description.split(',').slice(1); 
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate(`/sight/${id}`);
  };
  return (
    <div
      className={`${style.cardBody}${className ? ' ' + className : ''}`}
      onClick={handleRedirect}
    >
      <div className={style.cardImage}>
        <img
          src={img ? BASE_URL + img : attractionPlaceholder}
          alt="Достопримечательность"
          onError={(e) => {
            // заменяем на плейсхолдер, если картинка не загрузилась
            (e.currentTarget as HTMLImageElement).src = attractionPlaceholder;
          }}
        ></img>
      </div>
      <div className={style.context}>
        <div className={style.info}>
          <div className={style.row}>
            <h3>{name}</h3>
            <Rating rating={rating} />
          </div>
          <div className={style.description}>{addressParts}</div>
        </div>
        {prices && <div className={style.prices}>От {prices} рублей</div>}
      </div>
    </div>
  );
};

export default SightCard;
