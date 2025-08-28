import Search from "shared/ui/Search/Search";
import styles from "./styles.module.scss";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

const SearchInput = ({ onChange, value }: Props) => {
  return (
    <div className={styles.searchInput}>
      <input
        type="text"
        placeholder={"Куда сходить?"}
        className={styles.input}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <Search className={styles.searchIcon} />
    </div>
  );
};

export default SearchInput;
