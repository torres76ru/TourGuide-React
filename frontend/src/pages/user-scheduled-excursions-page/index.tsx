// import ScheduledExcursion from "widgets/ScheduledExcursion/ui/ScheduledExcursion";
import styles from "./UserScheduledExcursions.module.scss"
import BackHeader from "shared/ui/BackHeader/ui/BachHeader";
// import type { RootState } from "app/store/mainStore";
// import { useSelector } from "react-redux";
// import Input from "shared/ui/Input/Input";
// import { useNavigate } from "react-router-dom";



const UserScheduledExcursionsPage = () => {
//   const { user } = useSelector((state: RootState) => state.user);
//   const navigate = useNavigate();

//   const handleRedirect = (url: string) => {
//     navigate(url);
//   };

  return (
    <div className={styles.UserScheduledExcursions}>
      <BackHeader title="Запланированные экскурсии"></BackHeader>
      <ul className={styles.excursion_list}>
        {/* <li>
          <ScheduledExcursion 
          name="Прогулка по Москве" 
          date="15.09.2025" 
          time="13:00 - 16:00" 
          address="Проспект Мира, 119, Москва, Россия" 
          phone="7 (986) 745-43-90" 
          email="VDNH@mail.ru"></ScheduledExcursion>
        </li> */}
      </ul>
    </div>
  );
};

export default UserScheduledExcursionsPage;

