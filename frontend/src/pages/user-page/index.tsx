import UserName from "shared/ui/UserName/ui/UserName";
import styles from "./UserPage.module.scss"
import type { AppDispatch, RootState } from "app/store/mainStore";
import { useDispatch, useSelector } from "react-redux";
import MenuButton from "shared/ui/MenuButton/ui/MenuButton";
import exit from "shared/assets/exit.svg"
import { logoutRequest } from "entities/user/model/slice";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

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
            <li><MenuButton>Личные данные</MenuButton></li>
            <li><MenuButton>Хочу посетить</MenuButton></li>
            <li><MenuButton>Запланированные экскурсии</MenuButton></li>
            <li><MenuButton>Посещённые экскурсии</MenuButton></li>
            <li><MenuButton>Мои отзывы</MenuButton></li>
            <li><MenuButton onClick={() => {logout();
            handleRedirect("/")
            }}>Выйти <img src={exit} alt="Выход"/></MenuButton></li>
      </ul>
    </div>
  );
};

export default UserPage;
