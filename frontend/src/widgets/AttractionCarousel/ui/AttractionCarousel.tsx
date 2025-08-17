// widgets/Carousel/ui/index.tsx
import { getRandomCard } from "widgets/AttractionCard/lib/getRandomCard";
import AttractionCard from "widgets/AttractionCard/ui/AttractionCard";
import styles from "./AttractionCarousel.module.scss";

interface Props {
  category: string;
  count?: number;
}

const AttractionCarousel = ({ category, count = 5 }: Props) => {
  const cards = Array.from({ length: count }, getRandomCard);

  return (
    <div className={styles.container}> 
      <div className={styles.header}>
        <h3>{category}</h3>
      </div>
        <div className={styles.carousel}>
            <div className={styles.carousel_list}>
              {cards.map((card, index) => (
                <AttractionCard
                  key={index}
                  name={card.name}
                  isOpen={card.isOpen}
                  rating={Number(card.rating)}
                  img={card.image}
                  location={Number(card.location)}
                  categories={card.categories}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default AttractionCarousel;
