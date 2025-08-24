import ExcursionCard from "widgets/ExcursionCard/ui/ExcursionCard";
import styles from "./GuideExcursionsPage.module.scss"
import BackHeader from "shared/ui/BackHeader/ui/BachHeader";
import img from "shared/assets/attraction.png"
import plus from "shared/assets/plus.svg"
import { useState } from "react";
import ModalAddExcursion from "widgets/ModalAddExcursions/ui/ModalAddExcursions";
// import type { RootState } from "app/store/mainStore";
// import { useSelector } from "react-redux";
// import Input from "shared/ui/Input/Input";
// import { useNavigate } from "react-router-dom";

const GuideExcursionsPage = () => {
    const [isModalAddOpen, setModalAddOpen] = useState(false);
//   const { user } = useSelector((state: RootState) => state.user);
//   const navigate = useNavigate();

//   const handleRedirect = (url: string) => {
//     navigate(url);
//   };

  return (
    <div className={styles.GuideExcursionsPage}>
      <BackHeader title="Мои экскурсии"></BackHeader>
      <button className={styles.button} onClick={() => setModalAddOpen(true)}><img src={plus} alt="Плюс"/></button>
      <ul className={styles.excursion_list}>
        <li>
          <ExcursionCard img={img} name='Выставка достижений народного хозяйства (ВДНХ)'
          date='15.06.2025' rating={4.2} sity='Москва'></ExcursionCard>
        </li>
      </ul>
      {isModalAddOpen && <ModalAddExcursion onClick={() => setModalAddOpen(false)}></ModalAddExcursion>}
      
    </div>
  );
};

export default GuideExcursionsPage;

