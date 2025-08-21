import styles from "./UserScheduledExcursions.module.scss"
import BackHeader from "shared/ui/BackHeader/ui/BachHeader";
// import type { RootState } from "app/store/mainStore";
// import { useSelector } from "react-redux";
// import Input from "shared/ui/Input/Input";
// import { useNavigate } from "react-router-dom";

const UserScheduledExcursions = () => {
//   const { user } = useSelector((state: RootState) => state.user);
//   const navigate = useNavigate();

//   const handleRedirect = (url: string) => {
//     navigate(url);
//   };

  return (
    <div className={styles.userDataPage}>
      <BackHeader title="Посещённые экскурсии"></BackHeader>
    </div>
  );
};

export default UserScheduledExcursions;

