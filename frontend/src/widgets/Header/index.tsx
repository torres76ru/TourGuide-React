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

const Header = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleRedirect = (href: string) => {
    setModalOpen(false);
    navigate(href);
  };

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
      <div>
        <img src={search} alt="Search" className={styles.search} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <div className={styles.modalContent}>
          <div className={styles.container}>
            <button onClick={() => setModalOpen(false)} className={styles.cross}><img src={cross} alt="Крестик" /></button>
            <Button
              variant="black"
              style={{ width: "100%" }}
              onClick={() => handleRedirect("/auth")}>
              Войти
            </Button>
          </div>
          
          <ul className={styles.buttons_list}>
            <li><MenuButton>Поблизости</MenuButton></li>
            <li><MenuButton>Поиск мест</MenuButton></li>
            <li><MenuButton>Карта</MenuButton></li>
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
