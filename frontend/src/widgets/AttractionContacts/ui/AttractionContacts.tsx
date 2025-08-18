import styles from "./AttractionContacts.module.scss"

interface AttractionContactsProps {
  titleClassName?: string;  
  textClassName?: string; 
  linkClassName?: string;
  phone?: string;  
  email?: string;
  website?: string;
}

export default function AttractionContacts({titleClassName, textClassName, linkClassName, phone, email, website}: AttractionContactsProps) {
    return (
        <div className={styles.contacts}>
          <h3 className={titleClassName}>Контакты</h3>
          <p className={textClassName}>Телефон: {phone}</p>
          <p className={textClassName}>Эл. почта: {email}</p>
          <a href={website} className={linkClassName}>Сайт</a>
        </div>
    )
}