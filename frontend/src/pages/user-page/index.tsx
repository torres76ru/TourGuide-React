import UserName from "shared/ui/UserName/ui/UserName";
import styles from "./UserPage.module.scss"
import type { AppDispatch, RootState } from "app/store/mainStore";
import { useDispatch, useSelector } from "react-redux";
import MenuButton from "shared/ui/MenuButton/ui/MenuButton";
import exit from "shared/assets/exit.svg"
import { logoutRequest } from "entities/user/model/slice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const UserPage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isExit, setIsExit] = useState(false);

   const handleRedirect = (href: string) => {
    navigate(href);
  };

   const logout = () => {
      dispatch(logoutRequest());
    };

  return (
    <div className={styles.body}>
      <div className={styles.user_name_section}>
          <UserName name={user?.username} 
            headingStyle={{
              fontSize: "16px" 
            }}
            imageStyle={{
              width: "32px",
              height: "32px"
            }}></UserName>
      </div>
      
      <ul className={styles.buttons_list}>
            <li><MenuButton onClick={() => handleRedirect("/user/data")}>Личные данные</MenuButton></li>
            <li><MenuButton>Хочу посетить</MenuButton></li>
            <li><MenuButton>Запланированные экскурсии</MenuButton></li>
            <li><MenuButton onClick={() => handleRedirect("/user/visited_excursions")}>Посещённые экскурсии</MenuButton></li>
            <li><MenuButton>Мои отзывы</MenuButton></li>
            <li><MenuButton onClick={() => {setIsExit(true);}}>Выйти <img src={exit} alt="Выход"/></MenuButton></li>
      </ul>
      {isExit && 
      <div className={styles.black_section} onClick={() => {setIsExit(false);}}>
        <div className={styles.notification}>
          <h3>Вы точно хотите выйти?</h3>
          <div className={styles.buttons}>
            <button className={styles.btn} 
            onClick={() => {setIsExit(false);
              logout();
              handleRedirect("/");
            }}>Да</button>
            <button className={`${styles.btn} ${styles.color}`} onClick={() => {setIsExit(false);}}>Нет</button>
          </div>
        </div>
      </div>}
      
    </div>
  );
};

export default UserPage;
