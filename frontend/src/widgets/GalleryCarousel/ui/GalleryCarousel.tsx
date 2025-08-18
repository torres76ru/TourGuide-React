import styles from "./GalleryCarousel.module.scss"
import { getRandomImage } from "widgets/SightCard/lib/getRandomImage";

interface GalleryCarouselProps {
  count?: number;
}


export default function GalleryCarousel({count = 5} : GalleryCarouselProps) {
    const imgs = Array.from({ length: count }, getRandomImage);
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
    )
}