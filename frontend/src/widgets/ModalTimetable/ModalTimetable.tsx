import type { MouseEventHandler } from "react";
import styles from "./ModalTimetable.module.scss"
import { IconArrowBack } from "shared/ui/ArrowBackSvg"
import { excursion } from "features/AddExcursionForm/lib/getExcursion";

interface ModalTimetableProps {
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function ModalTimetable({onClick} : ModalTimetableProps) {
    const formattedDate = excursion.date.replace(/-/g, '.');
    return (
        <>
        <div className={styles.ModalTimetable}>
            <div className={styles.title_section}>
                <button className={styles.back_button} onClick={onClick}> <IconArrowBack /> </button>
                <h3>Расписание</h3>
            </div>
            <table className={styles.table}>
                <tbody>
                     <tr>
                        <td>{formattedDate}</td>
                        <td>{excursion.min_time} - {excursion.max_time}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        </>
    )
}