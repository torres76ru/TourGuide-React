import AttractionCarousel from "widgets/AttractionCarousel/ui/AttractionCarousel";
import styles from "./SightPage.module.scss"
import Attraction from "widgets/Attraction/ui";

const SightPage = () => {
  return <>
  <div className={styles.body}>
    <Attraction />
    <AttractionCarousel category="Для вас:" count={8} />
  </div>
  </>;
};

export default SightPage;
