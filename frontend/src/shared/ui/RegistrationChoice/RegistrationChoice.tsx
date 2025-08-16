import ChoiceButton from "../ChoiceButton/ChoiceButton"
import type { MouseEventHandler } from 'react';
import styles from "./RegistrationChoice.module.scss"
import clsx from "clsx";

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
                <ChoiceButton onClick={onClick} label="Турист" iconSrc="/src/shared/assets/icons/Tourist.svg" altText="Турист"></ChoiceButton>
                <ChoiceButton onClick={onClick} label="Экскурсовод" iconSrc="/src/shared/assets/icons/Guide.svg" altText="Экскурсовод"></ChoiceButton>
            </div>
        </div>
        </>
    )
}