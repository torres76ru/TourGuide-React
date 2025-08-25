import styles from "./AddDeleteButton.module.scss"
import plus from "shared/assets/plus.svg"
import minus from "shared/assets/minus.svg"

interface AddDeleteButtonProps {
    addOrDelete?: string
}

export default function AddDeleteButton({addOrDelete} : AddDeleteButtonProps) {
    const img = addOrDelete === "add" ? plus : minus;
    return (
        <>
        <button type="button" className={styles.button}> <img src={img} alt={addOrDelete} /></button>
        </>
    )
}