import styles from "./People.module.scss"
import people from "shared/assets/people.svg"

interface PeopleProps {
    min?: string;
    max?: string
}

export default function People({min, max} : PeopleProps) {
    return (
        <div className={styles.people_section}>
            <img src={people} alt="Люди" />
            <p>{min === "0" || min === "0" ? `${max} человек` : `${min}-${max} человек`}</p>
        </div>
    )
}