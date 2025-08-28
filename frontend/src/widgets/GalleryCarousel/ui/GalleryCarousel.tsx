import type { AdditionalPhotos } from 'entities/attraction/model/types';
import styles from './GalleryCarousel.module.scss';

interface GalleryCarouselProps {
  photos: AdditionalPhotos[];
}

export default function GalleryCarousel({ photos }: GalleryCarouselProps) {
  return (
    <>
      <div className={styles.carousel}>
        <div className={styles.carousel_list}>
          {photos.map((photo, index) => (
            <div key={index} className={styles.img_section}>
              <img src={photo.photo} alt={`Изображение ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
