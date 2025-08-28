import styles from "./AttractionWorkingTime.module.scss"

interface AttractionWorkingTimeProps {
  titleClassName?: string;  
  textClassName?: string; 
}

export default function AttractionWorkingTime({titleClassName, textClassName}: AttractionWorkingTimeProps) {
    return (
        <div className={styles.working_time}>
        <h3 className={titleClassName}>Сейчас открыто</h3>
        <div className={styles.time}>
          <p className={textClassName}>Время работы:</p>
          <div className={styles.weekdays}>
            <p className={textClassName}>пн-сб с 9:00 до 18:00</p>
            <p className={textClassName}>вс выходной</p>
          </div>
        </div>
      </div>
    )
}