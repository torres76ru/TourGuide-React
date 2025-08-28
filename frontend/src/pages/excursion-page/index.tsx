import styles from "./ExcursionPage.module.scss"
import Excursion from "widgets/Excursion/ui/Excursion";
import { useState } from "react";
import ModalTimetable from "widgets/ModalTimetable/ModalTimetable";
import BackButton from "features/back-button";

const ExcursionPage = () => {
  const [isModalTimetableOpen, setModalTimetableOpen] = useState(false);
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <BackButton className={styles.back_button}></BackButton>
        <Excursion TimetableClick={() => setModalTimetableOpen(true)}></Excursion>
      </div>
      {/* <Reviews attraction={attraction} /> */}
      {isModalTimetableOpen && <ModalTimetable onClick={() => setModalTimetableOpen(false)}></ModalTimetable>}
    </div>
  );
};

export default ExcursionPage;
