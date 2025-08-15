import ChoiceButton from "./ChoiceButton"
import type { MouseEventHandler } from 'react';

interface ChoiceProps {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function RegistrationChoice({className, onClick} : ChoiceProps) {
    return (
        <>
        <div className={`registration__choice ${className}`}>
            <p className="registration__choice-text">Зарегистрироваться как:</p>
            <div className="registration__choice-buttons">
                <ChoiceButton onClick={onClick} label="Турист" iconSrc="/src/assets/icons/Tourist.svg" altText="Турист"></ChoiceButton>
                <ChoiceButton onClick={onClick} label="Экскурсовод" iconSrc="/src/assets/icons/Guide.svg" altText="Экскурсовод"></ChoiceButton>
            </div>
        </div>
        </>
    )
}