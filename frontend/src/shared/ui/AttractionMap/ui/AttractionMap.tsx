import styles from "./AttractionMap.module.scss"

interface AttractionMapProps {
  titleClassName?: string;  
  textClassName?: string;   
}

export default function AttractionMap({titleClassName, textClassName}: AttractionMapProps) {
    return (
        <div className={styles.map_section}>
          <div className={styles.map_container}>Карта</div>
          <div className={styles.adress}>
            <h3 className={titleClassName}>Адрес</h3>
            <p className={textClassName}>Проспект Мира, 119, Москва, Россия</p>
          </div>
      </div>
    )
}