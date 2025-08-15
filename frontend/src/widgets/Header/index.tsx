import logo from "../../shared/assets/logo.svg";
import search from "../../shared/assets/search.svg";
import burger from "../../shared/assets/burger.svg";
import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      {/* Бургер-меню слева */}
      <button className={styles.burger} aria-label="Открыть меню">
        <img src={burger} alt="menu" />
      </button>

      {/* Лого и надпись по центру */}
      <div className={styles.center}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <span className={styles.title}>TourGuide</span>
      </div>

      {/* Поиск справа */}
      <div>
        <img src={search} alt="Search" className={styles.search} />
      </div>
    </header>
  );
};

export default Header;
