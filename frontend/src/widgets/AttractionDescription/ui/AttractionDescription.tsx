import styles from "./AttractionDescription.module.scss"

interface AttractionDescriptionProps {
  titleClassName?: string;  
  textClassName?: string; 
  linkClassName?: string; 
  description?: string 
}

export default function AttractionDescription({titleClassName, textClassName, description}: AttractionDescriptionProps) {
    return (
        <div className={styles.description}>
        <h3 className={titleClassName}>Описание</h3>
        <p className={textClassName}>{description}</p>
      </div>
    )
}