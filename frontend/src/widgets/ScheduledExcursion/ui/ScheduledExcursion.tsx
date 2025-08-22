import styles from "./ScheduledExcursion.module.scss"

interface ScheduledExcursionProps {
  name?: string,
  date?: string,
  time?: string,
  address?: string,
  phone?: string,
  email?: string,
}

export default function ScheduledExcursion({name, date, time, address, phone, email} : ScheduledExcursionProps) {
    return (
        <>
        <div className={styles.excursion_section}>
            <h3 className={styles.title}>{name}</h3>
            <div className={styles.time_section}>
              <span className={styles.text}>{date}</span>
              <span className={styles.text}>{time}</span>
            </div>
            <div className={styles.place_section}>
              <h4 className={styles.text}>Место встречи</h4>
              <p className={styles.text}>{address}</p>
            </div>
            <div className={styles.contacts_section}>
              <h4 className={styles.text}>Контакты</h4>
              <p className={styles.text}>Телефон: {phone}</p>
              <p className={styles.text}>Эл. почта: {email}</p>
            </div>
          </div>
        </>
    )
}