import AttractionCarousel from "widgets/AttractionCarousel/ui/AttractionCarousel";
import styles from "./ExcursionPage.module.scss"
import Excursion from "widgets/Excursion/ui/Excursion";
import { useState } from "react";
import ModalTimetable from "widgets/ModalTimetable/ModalTimetable";

const ExcursionPage = () => {
  const [isModalTimetableOpen, setModalTimetableOpen] = useState(false);
  return (
    <div className={styles.body}>
      <Excursion TimetableClick={() => setModalTimetableOpen(true)}></Excursion>
      <AttractionCarousel category="Для вас:" count={8} />
      {/* <Reviews attraction={attraction} /> */}
      {isModalTimetableOpen && <ModalTimetable onClick={() => setModalTimetableOpen(false)}></ModalTimetable>}
    </div>
  );
};

export default ExcursionPage;
