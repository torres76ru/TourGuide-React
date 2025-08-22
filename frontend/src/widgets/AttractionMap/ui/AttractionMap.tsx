import styles from "./AttractionMap.module.scss"

interface AttractionMapProps {
  titleClassName?: string;  
  textClassName?: string;  
  address?: string;
}

export default function AttractionMap({titleClassName, textClassName, address}: AttractionMapProps) {
    return (
        <div className={styles.map_section}>
          <div className={styles.map_container}>Карта</div>
          <div className={styles.adress}>
            <h3 className={titleClassName}>Адрес</h3>
            <p className={textClassName}>{address}</p>
          </div>
      </div>
    )
}