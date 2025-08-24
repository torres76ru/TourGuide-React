import { useState, type MouseEventHandler } from "react";
import styles from "./ModalTimetable.module.scss"
import { IconArrowBack } from "shared/ui/ArrowBackSvg"
import { excursion } from "features/AddExcursionForm/lib/getExcursion";
import Button from "shared/ui/Button";
import { useNavigate } from "react-router-dom";

interface ModalTimetableProps {
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function ModalTimetable({onClick} : ModalTimetableProps) {
    const formattedDate = excursion.date.replace(/-/g, '.');
    const [isClick, setIsClick] = useState(false);

    const navigate = useNavigate();

    const handleRedirect = (href: string) => {
      navigate(href);
    };
    return (
        <>
        <div className={styles.ModalTimetable}>
            <div className={styles.title_section}>
                <button className={styles.back_button} onClick={onClick}> <IconArrowBack /> </button>
                <h3>Расписание</h3>
            </div>
            <table className={`${styles.table} ${isClick ? styles.table_click : ""}`} onClick={() => setIsClick(!isClick)}>
                <tbody>
                     <tr>
                        <td>{formattedDate}</td>
                        <td>{excursion.min_time} - {excursion.max_time}</td>
                    </tr>
                </tbody>
            </table>
            { isClick &&
            <Button variant="black" style={{ width: "278px", position: "absolute", bottom: "35px", left: "50%", transform: "translate(-50%, -50%)"}} 
            onClick={() => handleRedirect('/excursion/join')} type="button">
                    Продолжить
            </Button>}
        </div>
        </>
    )
}