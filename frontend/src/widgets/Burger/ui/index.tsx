import burger from "shared/assets/burger.svg";
import styles from "./Burger.module.scss";

interface Props {
  isOpen: boolean;
  onClick: () => void;
}

const Burger = ({ isOpen, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className={styles.burger}
      aria-label="Открыть меню"
    >
      <img src={burger} className={isOpen ? styles.open : ""} alt="menu" />
    </button>
  );
};

export default Burger;
