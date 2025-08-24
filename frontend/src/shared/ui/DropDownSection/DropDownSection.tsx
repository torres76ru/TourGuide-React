import DropDown from "../DropDown/DropDown"
import styles from "./DropDownSection.module.scss"

interface DropDownSectionProps {
    title?: string
    options: string[];
    selectedValue_1?: string;
    onValueChange_1?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    selectedValue_2?: string;
    onValueChange_2?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    error_1?: string;
    error_2?: string;
}

export default function DropDownSection({title, options, 
  selectedValue_1, 
  onValueChange_1, 
  selectedValue_2, 
  onValueChange_2,
    error_1, 
    error_2,
  } : DropDownSectionProps) {
    return (
        <div className={styles.section}>
            <p>{title}</p>
            <div className={styles.drop_down_section}>
                <DropDown 
                options={options}
                selectedValue={selectedValue_1}
                handleChange={onValueChange_1}
                label="от"
                error={error_1}
                ></DropDown>
                <DropDown 
                options={options}
                selectedValue={selectedValue_2}
                handleChange={onValueChange_2}
                label="до"
                error={error_2}
                ></DropDown>
            </div>
        </div>
    )
}