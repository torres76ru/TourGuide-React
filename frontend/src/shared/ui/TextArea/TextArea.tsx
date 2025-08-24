import styles from "./TextArea.module.scss"

interface TextAreaProps {
    placeholder?: string;
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    error?: string
}

export default function TextArea({placeholder, value, onChange, error} : TextAreaProps) {
    return (
        <div>
            <textarea 
            className={`${styles.textarea} ${error && styles.textarea_error}`} 
            maxLength={1000} 
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            ></textarea>
            {error && <span className={styles.error_message}>{error}</span>}
        </div>
    )
}