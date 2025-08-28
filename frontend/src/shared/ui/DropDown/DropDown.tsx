import styles from "./DropDown.module.scss"


interface DropDownProps {
  options: string[];
  selectedValue?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  label?: string;
  error?: string;
}

export default function DropDown({ 
  options, 
  selectedValue, 
  handleChange, 
  label, 
  error
}: DropDownProps) {

  return (
    <>
      <span>{label}</span>
      <select 
        className={`${styles.drop_down} ${error && styles.select_error}`}
        value={selectedValue}
        onChange={handleChange}
      >
        <option value="" disabled></option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
}