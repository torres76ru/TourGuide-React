import styles from "./EditingExcursionPage.module.scss"
import BackHeader from "shared/ui/BackHeader/ui/BachHeader";
import EditingForm from "features/EditingForm/ui/EditingForm";


export default function EditingExcursionPage() {
    return (
        <>
        <div className={styles.EditingExcursionPage}>
            <BackHeader title="Редактирование экскурсии"></BackHeader>
            <EditingForm></EditingForm>
        </div>
        </>
    )
}