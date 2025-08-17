import ChoiceButton from "shared/ui/ChoiceButton/ChoiceButton"
import type { MouseEventHandler } from 'react';
import styles from "./RegistrationChoice.module.scss"
import clsx from "clsx";
import tourist from "shared/assets/icons/Tourist.svg"
import guide from "shared/assets/icons/Guide.svg"

interface ChoiceProps {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function RegistrationChoice({className, onClick} : ChoiceProps) {
    return (
        <>
        <div className={clsx( styles.choice, className)}>
            <p className={styles.choice_text}>Зарегистрироваться как:</p>
            <div className={styles.choice_buttons}>
                <ChoiceButton onClick={onClick} label="Турист" iconSrc={tourist} altText="Турист"></ChoiceButton>
                <ChoiceButton onClick={onClick} label="Экскурсовод" iconSrc={guide} altText="Экскурсовод"></ChoiceButton>
            </div>
        </div>
        </>
    )
}