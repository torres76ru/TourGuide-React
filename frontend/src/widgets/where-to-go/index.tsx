import Button from 'shared/ui/Button';
import styles from './WhereToGo.module.scss';
import LocationImage from 'shared/ui/LocationImage';
import { useNavigate } from 'react-router';

const WhereToGo = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/search');
  };

  return (
    <div className={styles.body} onClick={handleRedirect}>
      <h1 className={styles.header}>Куда сходить?</h1>
      <hr className={styles.divider} />
      <div className={styles.row}>
        <div className={styles.locationIcon}>
          <LocationImage />
        </div>
        <Button className={styles.fullWidth}>Поиск</Button>
      </div>
    </div>
  );
};

export default WhereToGo;
