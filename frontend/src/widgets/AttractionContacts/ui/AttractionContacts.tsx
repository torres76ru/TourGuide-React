import styles from "./AttractionContacts.module.scss";

interface AttractionContactsProps {
  titleClassName?: string;
  textClassName?: string;
  linkClassName?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export default function AttractionContacts({
  titleClassName,
  textClassName,
  linkClassName,
  phone,
  email,
  website,
}: AttractionContactsProps) {
  return (
    <div className={styles.contacts}>
      <h3 className={titleClassName}>Контакты</h3>

      {phone && <p className={textClassName}>Телефон: {phone}</p>}

      {email && (
        <p className={textClassName}>
          Эл. почта: <a href={`mailto:${email}`}>{email}</a>
        </p>
      )}

      {website && (
        <p className={textClassName}>
          Сайт:{" "}
          <a
            href={website}
            className={linkClassName}
            target="_blank"
            rel="noopener noreferrer"
          >
            {website}
          </a>
        </p>
      )}
    </div>
  );
}
