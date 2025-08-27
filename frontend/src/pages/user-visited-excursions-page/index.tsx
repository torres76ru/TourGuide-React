// import ExcursionCard from "widgets/ExcursionCard/ui/ExcursionCard";
import styles from "./UserVisitedExcursions.module.scss"
import BackHeader from "shared/ui/BackHeader/ui/BachHeader";
import img from "shared/assets/attraction.png"
// import type { RootState } from "app/store/mainStore";
// import { useSelector } from "react-redux";
// import Input from "shared/ui/Input/Input";
// import { useNavigate } from "react-router-dom";

const UserVisitedExcursionsPage = () => {
  // const { user } = useSelector((state: RootState) => state.user);
//   const navigate = useNavigate();

//   const handleRedirect = (url: string) => {
//     navigate(url);т
//   };

  return (
    <div className={styles.UserVisitedExcursions}>
      <BackHeader title="Посещённые экскурсии"></BackHeader>
      <ul className={styles.excursion_list}>
        {/* <li>
          <ExcursionCard isGuide={user?.is_guide} img={img} name='Выставка достижений народного хозяйства (ВДНХ)'
          date='15.06.2025' rating={4.2} city='Москва'></ExcursionCard>
        </li> */}
      </ul>
    </div>
  );
};

export default UserVisitedExcursionsPage;

