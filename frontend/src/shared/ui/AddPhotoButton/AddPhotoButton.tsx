import styles from "./AddPhotoButton.module.scss"



export default function AddDeleteButton() {
    return (
        <>
        <button type="button" className={styles.button}>Добавить фото</button>
        </>
    )
}