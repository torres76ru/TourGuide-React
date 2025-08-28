// import AttractionCarousel from "widgets/AttractionCarousel/ui/AttractionCarousel";
import styles from './SightPage.module.scss';
import Attraction from 'widgets/Attraction/ui';
import Reviews from 'widgets/Reviews/ui/Reviews';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { attractionApi } from 'entities/attraction/model/api';
import type { AttractionDetails } from 'entities/attraction/model/types';
import Loader from 'shared/ui/Loader/Loader';
import BackButton from 'features/back-button';
import ModalReview from 'widgets/ModalReview/ModalReview';

const SightPage = () => {
  const { id } = useParams<{ id: string }>();
  const [attraction, setAttraction] = useState<AttractionDetails | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isModalReview, setModalReview] = useState(false);

  const fetchAttraction = async (id: string) => {
    try {
      const data = await attractionApi.getById(id); // приводим к числу
      if (!data) {
        console.error('No data found for the given ID');
        return;
      }
      setAttraction(data);
    } catch (error) {
      console.error('Error fetching attraction data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!id) {
      console.error('Attraction ID is not provided');
      setLoading(false);
      return;
    }

    fetchAttraction(id);
  }, [id]);

  const handleSendComment = () => {
    setModalReview(false);
    if (id) fetchAttraction(id);
  };

  if (loading) return <Loader />;
  if (!attraction) return <div>Достопримечательность не найдена</div>;

  return (
    <div className={styles.body}>
      <div>
        <BackButton className={styles.back_button}></BackButton>
        <Attraction attraction={attraction} />
      </div>
      {/* <AttractionCarousel category="Для вас:" count={8} /> */}
      <Reviews attraction={attraction} onClick={() => setModalReview(true)} />
      {isModalReview && (
        <ModalReview onClick={handleSendComment} attraction={attraction}></ModalReview>
      )}
    </div>
  );
};

export default SightPage;
