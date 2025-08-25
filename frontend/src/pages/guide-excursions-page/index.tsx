import ExcursionCard from "widgets/ExcursionCard/ui/ExcursionCard";
import styles from "./GuideExcursionsPage.module.scss"
import BackHeader from "shared/ui/BackHeader/ui/BachHeader";
import img from "shared/assets/attraction.png"
import plus from "shared/assets/plus.svg"
import { useState } from "react";
import ModalAddExcursion from "widgets/ModalAddExcursions/ui/ModalAddExcursions";
import { excursion } from "features/AddExcursionForm/lib/getExcursion";

const GuideExcursionsPage = () => {
    const [isModalAddOpen, setModalAddOpen] = useState(false);
    const formattedDate = excursion.date.replace(/-/g, '.');

  return (
    <div className={styles.GuideExcursionsPage}>
      <BackHeader title="Мои экскурсии"></BackHeader>
      <button className={styles.button} onClick={() => setModalAddOpen(true)}><img src={plus} alt="Плюс"/></button>
      <ul className={styles.excursion_list}>
        <li>
          <ExcursionCard img={img} name={excursion.title}
          date={formattedDate} rating={4.2} сity={excursion.city}></ExcursionCard>
        </li>
      </ul>
      {isModalAddOpen && <ModalAddExcursion onClick={() => setModalAddOpen(false)}></ModalAddExcursion>}
      
    </div>
  );
};

export default GuideExcursionsPage;

