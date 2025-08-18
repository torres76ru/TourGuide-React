import AttractionCarousel from "widgets/AttractionCarousel/ui/AttractionCarousel";
import styles from "./SightPage.module.scss"
import Attraction from "widgets/Attraction/ui";
import Reviews from "widgets/Reviews/ui/Reviews";

const SightPage = () => {
  return <>
  <div className={styles.body}>
    <Attraction />
    <AttractionCarousel category="Для вас:" count={8} />
    <Reviews></Reviews>
  </div>
  </>;
};

export default SightPage;
