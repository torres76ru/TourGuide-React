import { BASE_URL } from 'shared/config/constants';
import style from './style.module.scss';
import placeholderImg from 'shared/assets/attraction_placeholder.png';
import { useNavigate } from 'react-router';

interface SightTinyProps {
  id: number;
  img_url?: string | null;
  title?: string;
  town?: string;
}

export const SightTiny = ({ id, img_url, title, town }: SightTinyProps) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(`/sight/${id}`);
  };
  return (
    <div className={style.row} onClick={handleRedirect}>
      <div className={style.preview}>
        <img src={img_url ? BASE_URL + img_url : placeholderImg} alt="Достопримечательность" />
      </div>
      <div className={style.info}>
        <h2 className={style.title}>{title}</h2>
        <p className={style.town}>{town}</p>
      </div>
    </div>
  );
};
