import styles from "./People.module.scss"
import people from "shared/assets/people.svg"

interface PeopleProps {
    max?: string
}

export default function People({max} : PeopleProps) {
    return (
        <div className={styles.people_section}>
            <img src={people} alt="Люди" />
            <p>{max}</p>
        </div>
    )
}