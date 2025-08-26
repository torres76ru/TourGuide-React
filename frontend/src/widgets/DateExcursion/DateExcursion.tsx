import Input from "shared/ui/Input/Input"
import styles from "./DateExcursion.module.scss"
import DropDownSection from "shared/ui/DropDownSection/DropDownSection"
import AddDeleteButton from "shared/ui/AddDeleteButton/AddDeleteButton"

interface DateExcursionProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    options: string[];
    selectedValue_1?: string;
    onValueChange_1?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    selectedValue_2?: string;
    onValueChange_2?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    error_1?: string;
    error_2?: string;
    error_3?: string;
}

export default function DateExcursion({
    value, 
    onChange, 
    options, 
    selectedValue_1, 
    onValueChange_1, 
    selectedValue_2, 
    onValueChange_2, 
    error_1,
    error_2,
    error_3
} : DateExcursionProps) {
    return (
        <div className={styles.date_section}>
            <div>
                <div className={styles.date}>
                    <span>Число</span>
                    <Input
                    type="date"
                    value={value}
                    onChange={onChange}
                    classInput={`${styles.size} ${styles.small}`}
                    error={error_3}>
                    </Input>
                </div>
                <DropDownSection 
                title="Время"
                options={options}
                selectedValue_1={selectedValue_1}
                onValueChange_1={onValueChange_1}
                selectedValue_2={selectedValue_2}
                onValueChange_2={onValueChange_2}
                error_1={error_1}
                error_2={error_2}
                ></DropDownSection>
            </div>
                <div className={styles.buttons}>
                    <AddDeleteButton addOrDelete="delete"></AddDeleteButton>
                    <AddDeleteButton addOrDelete="add"></AddDeleteButton>
                </div>
        </div>
    )
}