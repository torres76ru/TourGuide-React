import styles from "./AttractionContacts.module.scss"

interface AttractionContactsProps {
  titleClassName?: string;  
  textClassName?: string; 
  linkClassName?: string;  
}

export default function AttractionContacts({titleClassName, textClassName, linkClassName}: AttractionContactsProps) {
    return (
        <div className={styles.contacts}>
          <h3 className={titleClassName}>Контакты</h3>
          <p className={textClassName}>Телефон: 7 (986) 745-43-90</p>
          <p className={textClassName}>Эл. почта: VDNH@mail.ru</p>
          <a href="#!" className={linkClassName}>Сайт</a>
        </div>
    )
}