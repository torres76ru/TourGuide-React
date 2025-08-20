import Burger from "widgets/Burger/ui";
import logo from "../../shared/assets/logo.svg";
import search from "../../shared/assets/search.svg";

import styles from "./Header.module.scss";
// import { useBurger } from "features/useBurger";
import Modal from "widgets/Modal/ui";
import { useState } from "react";
import Button from "shared/ui/Button";
import { useNavigate } from "react-router";
import cross from "shared/assets/Cross.svg"
import MenuButton from "shared/ui/MenuButton/ui/MenuButton";
import { useSelector } from "react-redux";
import type { RootState } from "app/store/mainStore";
// import { logoutRequest } from "entities/user/model/slice";
import UserName from "shared/ui/UserName/ui/UserName";


const Header = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  // const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.user);

  const handleRedirect = (href: string) => {
    setModalOpen(false);
    navigate(href);
  };

  // const logout = () => {
  //   dispatch(logoutRequest());
  // };

  return (
    <header className={styles.header}>
      {/* Бургер-меню слева */}
      <Burger isOpen={isModalOpen} onClick={() => setModalOpen(!isModalOpen)} />

      {/* Лого и надпись по центру */}
      <div className={styles.center} onClick={() => handleRedirect("/")}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <span className={styles.title}>TourGuide</span>
      </div>

      {/* Поиск справа */}
      <div onClick={() => handleRedirect("/search")}>
        <img src={search} alt="Search" className={styles.search} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <div className={styles.modalContent}>
          <div className={styles.container}>
            <button onClick={() => setModalOpen(false)} className={styles.cross}><img src={cross} alt="Крестик" /></button>
            {!user ? (
            <Button
              variant="black"
              style={{ width: "100%" }}
              onClick={() => handleRedirect("/auth")}>
              Войти
            </Button>
          ) : (
            <> <button onClick={() => handleRedirect("/user")} className={styles.user_btn}> <UserName name={user.username} 
              headingStyle={{
                fontWeight: 300,
                fontSize: "20px" 
                }}
              imageStyle={{
                width: "50px",
                height: "50px"
                }}></UserName> </button>
            </>
          )}
          </div>
          
          <ul className={styles.buttons_list}>
            <li><MenuButton onClick={() => handleRedirect("/search")}>Поблизости</MenuButton></li>
            <li><MenuButton>Поиск мест</MenuButton></li>
            <li><MenuButton>Карта</MenuButton></li>
            {user && <li><MenuButton>Добавить место</MenuButton></li>}
          </ul>
          {/* <Button
            variant="black"
            style={{ width: "100%" }}
            onClick={() => handleRedirect("/sight")}>
            Достопримечательность
          </Button> */}
        </div>
      </Modal>
    </header>
  );
};

export default Header;
