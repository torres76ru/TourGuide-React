import styles from './ChoiceButton.module.scss';

interface ChoiceButtonProps {
  label: string;
  iconSrc: string;
  altText: string;
  onClick?: () => void;
}

export default function ChoiceButton({ label, iconSrc, altText, onClick }: ChoiceButtonProps) {
  return (
    <>
      <div className={styles.choice_colomn}>
        <button onClick={onClick} className={styles.choice_btn}>
          <img src={iconSrc} alt={altText} />
        </button>
        <span>{label}</span>
      </div>
    </>
  );
}
