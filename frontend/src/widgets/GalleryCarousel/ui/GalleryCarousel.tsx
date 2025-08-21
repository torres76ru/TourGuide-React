import { BASE_URL } from "shared/config/constants";
import styles from "./GalleryCarousel.module.scss";

interface GalleryCarouselProps {
  photos: string[];
}

export default function GalleryCarousel({ photos }: GalleryCarouselProps) {
  const imgs = photos.map((photo) => BASE_URL + photo);
  return (
    <>
      <div className={styles.carousel}>
        <div className={styles.carousel_list}>
          {imgs.map((img, index) => (
            <div key={index} className={styles.img_section}>
              <img src={img} alt={`Изображение ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
